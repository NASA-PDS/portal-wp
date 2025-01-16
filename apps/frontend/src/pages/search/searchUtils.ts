import {
    IdentifierNameDoc,
    IdentifierNameResponse,
    Response,
    SolrSearchResponse,
    SolrIdentifierNameResponse,
    SearchResultDoc,
} from "src/types/solrSearchResponse";

import {
    SolrSearchResponse as SolrSearchResponseExpected,
    SolrIdentifierNameResponse as SolrIdentifierNameResponseExpected,
    IdentifierNameResponse as IdentifierNameResponseExpected,
    IdentifierNameDoc as IdentifierNameDocExpected,
    Response as ResponseExpected,
    SearchResultDoc as SearchResultDocExpected
} from "src/types/solrSearchResponseExpected";

export const calculatePaginationCount = (data: SolrSearchResponse) => {
    const rows = Number(data.responseHeader.params.rows);
    const hits = data.response.numFound;
    const count = Math.ceil(hits / rows);

    return count;
};

export const calculateStartValue = (page: number, rows: number) => {
    return (page - 1) * rows;
};

export const organizeFilters = (filters: string) => {
    const filterArray = filters.split("+");
    const filterObjs: {
        name: string,
        values: string[]
    }[] = [];

    filterArray.forEach((filterName, index) => {
        if (index % 2 == 0) {
            const filterValue = filterArray[index + 1];

            const filterObj = filterObjs.find((filter) => filter.name === filterName);
            if(filterObj){
                filterObj.values.push(filterValue);
            }
            else{
                filterObjs.push({
                    name: filterName,
                    values: [filterValue]
                });
            }
            
        }
    });

    return filterObjs;
}

export const formatFilterQueries = (filters: string) => {
    const filterObjs = organizeFilters(filters);

    let formattedFilterQueryString = "";
    filterObjs.forEach((filterObj) => {
        formattedFilterQueryString =
            formattedFilterQueryString +
            "&fq=";
        
        filterObj.values.forEach((value, index) => {
            if(index === 0){ 
                formattedFilterQueryString = 
                formattedFilterQueryString +
                filterObj.name +
                ':"' +
                value +
                '" OR identifier:"' + 
                value +
                '"';
            }
            else{
                formattedFilterQueryString = 
                formattedFilterQueryString + " OR " +
                filterObj.name +
                ':"' +
                value +
                '" OR identifier:"' + 
                value +
                '"';
            }
           
        });
    });

    return formattedFilterQueryString;
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
    let originals: IdentifierNameDoc[] = [];
    identifier = identifier.split("::")[0];

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
        if(originals[i].identifier[0] === identifier){
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

export const mapFilterIdsToName = (ids: string[], names: IdentifierNameDoc[], searchResultFacets?: (number | string)[]) => {
    const filtersMap: { name: string; identifier: string, count: string }[] = [];

    ids.forEach((id, index) => {
      if (index % 2 == 0) {
        const urnSplit = id.split("::")[0];
        const nameDoc = names.find((name) => name.identifier[0] === urnSplit);
        let count = ids[index + 1];

        if(searchResultFacets){
            const searchResultFacetIndex = searchResultFacets.indexOf(urnSplit);
            if(searchResultFacetIndex === -1){
                count = "0";
            }
            else{
                count = String(searchResultFacets[searchResultFacetIndex + 1]);
            }
        }

        if (nameDoc) {
          let name: string = "";

          if (nameDoc.title) {
            name = nameDoc.title[0];
          }

          filtersMap.push({
            name,
            identifier: id,
            count
          });
        }
      }
    });

    orderFiltersByName(filtersMap);

    return filtersMap;
};

const orderFiltersByName = (filtersMap: { name: string; identifier: string, count: string }[]) => {
    filtersMap.sort((a, b) => a.name.localeCompare(b.name));
}

export const mapPageType = (ids: string[], searchResultFacets?: (number | string)[]) => {
    const filtersMap: { name: string; identifier: string, count: string }[] = [];
        ids.forEach((id, index) => {
            if (index % 2 == 0) {
                let count = ids[index + 1];

                if(searchResultFacets){
                    const searchResultFacetIndex = searchResultFacets.indexOf(id);
                    if(searchResultFacetIndex === -1){
                        count = "0";
                    }
                    else{
                        count = String(searchResultFacets[searchResultFacetIndex + 1]);
                    }
                }

                filtersMap.push({
                    name: id,
                    identifier: id,
                    count
                });
            }
    });

    return filtersMap;
};

export const formatSearchResults = (data: SolrSearchResponseExpected) => {
    const formattedData: SolrSearchResponse = transformSolrSearchResponseExpected(data);

    return formattedData;
};


const transformSolrSearchResponseExpected = (data: SolrSearchResponseExpected) => {
    const formattedData: SolrSearchResponse  = {
        response: transformResponse(data.response),
        responseHeader: data.responseHeader,
        facet_counts: data.facet_counts
    }

    return formattedData;
};


const transformResponse = (data: ResponseExpected) => {
    const formattedData: Response  = {
        numFound: data.numFound,
        start: data.start,
        maxScore: data.maxScore,
        docs: transformDocs(data.docs)
    }

    return formattedData;
}

const transformDocs = (data: SearchResultDocExpected[]) => {
    const formattedData: SearchResultDoc[] = [];

    data.forEach((docExpected) => {
        const doc: SearchResultDoc = {
            page_type: convertToStringArray(docExpected.page_type),
            file_ref_location: convertToStringArray(docExpected.file_ref_location),
            data_class:convertToStringArray(docExpected.data_class),
            description: convertToStringArray(docExpected.description),
            file_ref_url: convertToStringArray(docExpected.file_ref_url),
            title: convertToStringArray(docExpected.title),
            resLocation: convertToStringArray(docExpected.resLocation),
            objectType: convertToStringArray(docExpected.objectType),
            product_class: convertToStringArray(docExpected.product_class),
            data_product_type: convertToStringArray(docExpected.data_product_type),
            file_ref_size: convertToStringArray(docExpected.file_ref_size),
            modification_date: convertToStringArray(docExpected.modification_date),
            file_ref_name: convertToStringArray(docExpected.file_ref_name),
            identifier: convertToStringArray(docExpected.identifier),
            resource_url: convertToStringArray(docExpected.resource_url),
            agency_name: convertToStringArray(docExpected.agency_name),
            'form-agency': convertToStringArray(docExpected['form-agency']),
            modification_description: convertToStringArray(docExpected.modification_description),
            resource_type: convertToStringArray(docExpected.resource_type),
            search_id: convertToStringArray(docExpected.search_id),
            pds_model_version: convertToStringArray(docExpected.pds_model_version),
            resource_description: convertToStringArray(docExpected.resource_description),
            resource_name: convertToStringArray(docExpected.resource_name),
            timestamp: convertToStringArray(docExpected.timestamp),
            score: docExpected.score,
            investigation_type: convertToStringArray(docExpected.investigation_type),
            primary_result_purpose: convertToStringArray(docExpected.primary_result_purpose),
            node_id: convertToStringArray(docExpected.node_id),
            instrument_type: convertToStringArray(docExpected.instrument_type),
            facility_country: convertToStringArray(docExpected.facility_country),
            facility_type: convertToStringArray(docExpected.facility_type),
            facility_description: convertToStringArray(docExpected.facility_description),
            telescope_description: convertToStringArray(docExpected.telescope_description),
            telescope_aperture: convertToStringArray(docExpected.telescope_aperture),
            instrument_name: convertToStringArray(docExpected.instrument_name),
            investigation_ref: convertToStringArray(docExpected.investigation_ref),
            citation_publication_year: convertToStringArray(docExpected.citation_publication_year),
        }

        if(docExpected.collection_type){
            doc.collection_type = convertToStringArray(docExpected.collection_type);
        }
        if(docExpected.investigation_description){
            doc.investigation_description = convertToStringArray(docExpected.investigation_description);
        }
        if(docExpected.instrument_host_name){
            doc.instrument_host_name = convertToStringArray(docExpected.instrument_host_name);
        }
        if(docExpected.investigation_start_date){
            doc.investigation_start_date = convertToStringArray(docExpected.investigation_start_date);
        }
        if(docExpected.investigation_stop_date){
            doc.investigation_stop_date = convertToStringArray(docExpected.investigation_stop_date);
        }
        if(docExpected.instrument_description){
            doc.instrument_description = convertToStringArray(docExpected.instrument_description);
        }
        if(docExpected['form-instrument-host']){
            doc['form-instrument-host'] = convertToStringArray(docExpected['form-instrument-host']);
        }
        if(docExpected.citation_doi){
            doc.citation_doi = convertToStringArray(docExpected.citation_doi);
        }
        if(docExpected.primary_result_processing_level){
            doc.primary_result_processing_level = convertToStringArray(docExpected.primary_result_processing_level);
        }
        if(docExpected.observation_start_date_time){
            doc.observation_start_date_time = convertToStringArray(docExpected.observation_start_date_time);
        }
        if(docExpected.observation_stop_date_time){
            doc.observation_stop_date_time = convertToStringArray(docExpected.observation_stop_date_time);
        }
        if(docExpected.investigation_name){
            doc.investigation_name = convertToStringArray(docExpected.investigation_name);
        }
        if(docExpected.primary_result_discipline_name){
            doc.primary_result_discipline_name = convertToStringArray(docExpected.primary_result_discipline_name);
        }
        if(docExpected.target_type){
            doc.target_type = convertToStringArray(docExpected.target_type);
        }
        if(docExpected.service_url){
            doc.service_url = convertToStringArray(docExpected.service_url);
        }
        if(docExpected.version_id){
            doc.version_id = convertToStringArray(docExpected.version_id);
        }
        if(docExpected.service_category){
            doc.service_category = convertToStringArray(docExpected.service_category);
        }
        if(docExpected['form-target']){
            doc['form-target'] = convertToStringArray(docExpected['form-target']);
        }
        if(docExpected.target_description){
            doc.target_description = convertToStringArray(docExpected.target_description);
        }
        if(docExpected.instrument_host_description){
            doc.instrument_host_description = convertToStringArray(docExpected.instrument_host_description);
        }

        formattedData.push(doc);
    });

    return formattedData;
}

export const formatIdentifierNameResults = (data: SolrIdentifierNameResponseExpected) => {
    const formattedData: SolrIdentifierNameResponse = transformSolrIdentifierNameResponse(data);

    return formattedData;
};


const transformSolrIdentifierNameResponse = (data: SolrIdentifierNameResponseExpected) => {
    const formattedData: SolrIdentifierNameResponse  = {
        response: transformIdentifierNameResponse(data.response),
        responseHeader: data.responseHeader,
        facet_counts: data.facet_counts
    }

    return formattedData;
}

const transformIdentifierNameResponse = (data: IdentifierNameResponseExpected) => {
    const formattedData: IdentifierNameResponse  = {
        numFound: data.numFound,
        start: data.start,
        maxScore: data.maxScore,
        docs: transformIdentifierNameDocs(data.docs)
    }

    return formattedData;
}

const transformIdentifierNameDocs = (data: IdentifierNameDocExpected[]) => {
    const formattedData: IdentifierNameDoc[] = [];

    data.forEach((docExpected) => {
        const doc = {
            identifier: convertToStringArray(docExpected.identifier),
            investigation_name: convertToStringArray(docExpected.investigation_name),
            instrument_name: convertToStringArray(docExpected.instrument_name),
            target_name: convertToStringArray(docExpected.target_name),
            title: convertToStringArray(docExpected.title),
        }

        formattedData.push(doc);
    });

    return formattedData;
}

const convertToStringArray = (param: string | string[]): string[] => Array.isArray(param) ? param : [param];