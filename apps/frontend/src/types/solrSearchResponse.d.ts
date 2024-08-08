export type SolrSearchResponse = {
    responseHeader: ResponseHeader;
    response: Response;
    facet_counts: Facetcounts;
}

type Facetcounts = {
    facet_queries: Facetqueries;
    facet_fields: Facetfields;
    facet_dates: Facetqueries;
    facet_ranges: Facetqueries;
}

type Facetfields = {
    facet_pds_model_version: (number | string)[];
    facet_agency: (number | string)[];
    facet_type: (number | string)[];
    facet_target: (number | string)[];
    facet_investigation: (number | string)[];
    facet_instrument: (number | string)[];
    facet_primary_result_purpose: (number | string)[];
    facet_primary_result_processing_level: string[];
}

type Facetqueries = object;

type Response = {
    numFound: number;
    start: number;
    maxScore: number;
    docs: Doc[];
}

type Doc = {
    file_ref_location: string[];
    data_class: string[];
    description: string[];
    file_ref_url: string[];
    title: string;
    resLocation: string;
    objectType: string;
    product_class: string[];
    data_product_type: string[];
    file_ref_size: number[];
    modification_date: string[];
    file_ref_name: string[];
    identifier: string;
    resource_url: string[];
    agency_name: string[];
    'form-agency': string[];
    modification_description: string[];
    resource_type: string[];
    version_id: string[];
    search_id: string;
    pds_model_version: string;
    resource_description: string[];
    resource_name: string[];
    timestamp: string;
    score: number;
}

type ResponseHeader = {
    status: number;
    QTime: number;
    params: Params;
}

type Params = {
    q: string;
    wt: string;
    rows: string;
}