import {
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
        /*
        if (
            doc.product_class[0].toLowerCase() === "product_document" ||
            (doc.collection_type &&
            doc.collection_type[0].toLowerCase() === "document")
        ) {
            docType = "resource";
        }
        */
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
            if (doc.data_class && doc.data_class[0].toLowerCase() === "target") {
                docType = "target";
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

