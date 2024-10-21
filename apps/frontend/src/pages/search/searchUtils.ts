import {
    IdentifierNameDoc,
    SolrSearchResponse,
    SolrIdentifierNameResponse,
    SearchResultDoc,
} from "src/types/solrSearchResponse";

export const calculatePaginationCount = (data: SolrSearchResponse) => {
    const rows = Number(data.responseHeader.params.rows);
    const hits = data.response.numFound;
    const count = Math.ceil(hits / rows);

    return count;
};

export const calculateStartValue = (page: number, rows: number) => {
    return (page - 1) * rows;
};

export const formatFilterQueries = (filters: string) => {
    const filterArray = filters.split("+");
    let formattedFilterQueryString = "";

    filterArray.forEach((filterName, index) => {
        if (index % 2 == 0) {
            const filterValue = filterArray[index + 1];
            formattedFilterQueryString =
                formattedFilterQueryString +
                "&fq=" +
                filterName +
                ':"' +
                filterValue +
                '" OR identifier:"' + 
                filterValue +
                '"';
        }
    });

    return formattedFilterQueryString;
};

export const formatIdentifierNameResults = (data: SolrIdentifierNameResponse) => {
    return data;
};

export const formatSearchResults = (data: SolrSearchResponse) => {
    return data;
};

export const getDocType = (doc: SearchResultDoc) => {
    let docType = "";
    if (doc.product_class) {
        if (doc.product_class[0].toLowerCase() === "product_data_set_pds3") {
            docType = "dataset";
        }
        if (doc.product_class[0].toLowerCase() === "product_bundle") {
            docType = "databundle";
        }
        if (doc.product_class[0].toLowerCase() === "product_collection") {
            if (doc.collection_type) {
                if (doc.collection_type[0] !== "document") {
                    docType = "datacollection";
                }
            } else {
                docType = "datacollection";
            }
        }
        if (doc.product_class[0].toLowerCase() === "product_service") {
            docType = "tool";
        }
        if (
            doc.product_class[0].toLowerCase() === "product_document" ||
            (doc.collection_type &&
            doc.collection_type[0].toLowerCase() === "document")
        ) {
            docType = "resource";
        }
        if (doc.product_class[0].toLowerCase() === "product_context") {
            if (
                doc.data_class &&
                doc.data_class[0].toLowerCase() === "investigation"
            ) {
                docType = "investigation";
            }
            if (
                doc.data_class &&
                doc.data_class[0].toLowerCase() === "instrument"
            ) {
                docType = "instrument";
            }
            if (
                doc.data_class &&
                doc.data_class[0].toLowerCase() === "instrument_host"
            ) {
                docType = "instrument_host";
            }
            if (doc.data_class && doc.data_class[0].toLowerCase() === "telescope") {
                docType = "telescope";
            }
            if (doc.data_class && doc.data_class[0].toLowerCase() === "target") {
                docType = "target";
            }
            if (doc.data_class && doc.data_class[0].toLowerCase() === "facility") {
                docType = "facility";
            }
            /*
            if (
                doc.data_class &&
                doc.data_class[0].toLowerCase() === "instrument_host"
            ) {
                docType = "investigation";
            }
            */
        }
    }
    return docType;
};

export const getUnmatchedFilters = (
    originalFilters: string, 
    investigationFilterOptions: { name: string; identifier: string; }[], 
    instrumentFilterOptions: { name: string; identifier: string; }[], 
    targetFilterOptions: { name: string; identifier: string; }[], 
    investigationFilterIds: IdentifierNameDoc[], 
    instrumentFilterIds: IdentifierNameDoc[], 
    targetFilterIds: IdentifierNameDoc[] 
) => {
    const unmatchedFilters: { parentName: string, name: string; identifier: string }[] = [];
    let options: { name: string; identifier: string }[] = [];
    const fqs = originalFilters.split("+");

    fqs.forEach((fq, index) => {
        if (index % 2 === 0) {
            if(fq === "target_ref"){
                options = targetFilterOptions;
            }
            if(fq === "investigation_ref"){
                options = investigationFilterOptions;
            }
            if(fq === "instrument_ref"){
                options = instrumentFilterOptions;
            }

            let matchFound = false;
            options.forEach((option) => {
                if (fqs[index + 1] === option.identifier) {
                    matchFound = true;
                }
            });

            const name = getUnmatchedFilterName(fq, fqs[index + 1], investigationFilterIds, instrumentFilterIds, targetFilterIds);

            if(matchFound === false){
                unmatchedFilters.push({
                    parentName: fq,
                    identifier: fqs[index + 1],
                    name
                })
            }
        }
    });

    return unmatchedFilters;
};

const getUnmatchedFilterName = (
    parentName: string, 
    identifier: string, 
    investigations: IdentifierNameDoc[], 
    instruments: IdentifierNameDoc[], 
    targets: IdentifierNameDoc[]
) => {
    let originals: IdentifierNameDoc[] = []
    identifier = identifier.split("::")[0];

    console.log('getUnmatchedFilterName')
    if(parentName === "target_ref"){
        originals = targets;
    }
    if(parentName === "investigation_ref"){
        originals = investigations;
    }
    if(parentName === "instrument_ref"){
        originals = instruments;
    }

    for(let i = 0; i < originals.length; i++){
        if(originals[i].identifier === identifier){
            if(parentName === "target_ref"){
                return originals[i].target_name[0];
            }
            if(parentName === "investigation_ref"){
                return originals[i].investigation_name[0];
            }
            if(parentName === "instrument_ref"){
                return originals[i].instrument_name[0];
            }
        }
    }

    return "";
}

export const isAllOptionsChecked = (value: string, filters: string) => {
    let isChecked = true;

    if (filters && filters.length > 0) {
        const fqs = filters.split("+");

        fqs.forEach((fq, index) => {
            if (index % 2 === 0) {
                if (fq === value) {
                    isChecked = false;
                }
            }
        });
    }

    return isChecked;
};

export const isOptionChecked = (
    identifier: string,
    parentValue: string,
    filters: string
  ) => {
    let isOptionChecked = false;

    if (filters && filters.length > 0) {
      const fqs = filters.split("+");

        fqs.forEach((fq, index) => {
            if (index % 2 === 0) {
                if (fq === parentValue && fqs[index + 1] === identifier) {
                    isOptionChecked = true;
                }
            }
        });
    }

    return isOptionChecked;
};

export const mapFilterIdsToName = (ids: string[], names: IdentifierNameDoc[]) => {
    const filtersMap: { name: string; identifier: string }[] = [];

    ids.forEach((id, index) => {
      if (index % 2 == 0) {
        const urnSplit = id.split("::")[0];
        const nameDoc = names.find((name) => name.identifier[0] === urnSplit);

        if (nameDoc) {
          let name: string = "";

          if (nameDoc.investigation_name) {
            name = nameDoc.investigation_name[0];
          }
          if (nameDoc.instrument_name) {
            name = nameDoc.instrument_name[0];
          }
          if (nameDoc.target_name) {
            name = nameDoc.target_name[0];
          }

          filtersMap.push({
            name,
            identifier: id,
          });
        }
      }
    });

    return filtersMap;
};

export const mapPageType = (ids: string[]) => {
    const filtersMap: { name: string; identifier: string }[] = [];
        ids.forEach((id, index) => {
            if (index % 2 == 0) {
                filtersMap.push({
                    name: id,
                    identifier: id,
                });
            }
    });

    return filtersMap;
};

  

