export type SolrSearchResponse = {
    responseHeader: ResponseHeader;
    response: Response;
    facet_counts: Facetcounts;
}

export type SolrIdentifierNameResponse = {
    responseHeader: ResponseHeader;
    response: IdentifierNameResponse;
    facet_counts: Facetcounts;
}

export type Facetcounts = {
    facet_queries: Facetqueries;
    facet_fields: Facetfields;
    facet_dates: Facetqueries;
    facet_ranges: Facetqueries;
}

export type Facetfields = {
    facet_pds_model_version: (number | string)[];
    facet_agency: (number | string)[];
    facet_type: (number | string)[];
    facet_target: (number | string)[];
    facet_investigation: (number | string)[];
    facet_instrument: (number | string)[];
    facet_primary_result_purpose: (number | string)[];
    facet_primary_result_processing_level: string[];
    page_type: string[];
    investigation_ref: string[];
    target_ref: string[];
    instrument_ref: string[];
}

type Facetqueries = object;

export type Response = {
    numFound: number;
    start: number;
    maxScore: number;
    docs: SearchResultDoc[];
}

type IdentifierNameResponse = {
    numFound: number;
    start: number;
    maxScore: number;
    docs: IdentifierNameDoc[];
}

type SearchResultDoc = {
    page_type: string[];
    file_ref_location: string[];
    data_class: string[];
    description: string[];
    file_ref_url: string[];
    title: string[];
    resLocation: string[];
    objectType: string[];
    product_class: string[];
    data_product_type: string[];
    file_ref_size: string[];
    modification_date: string[];
    file_ref_name: string[];
    identifier: string[];
    resource_url: string[];
    agency_name: string[];
    'form-agency': string[];
    modification_description: string[];
    resource_type: string[];
    version_id: string[];
    search_id: string[];
    pds_model_version: string[];
    resource_description: string[];
    resource_name: string[];
    timestamp: string[];
    score: number;
    collection_type?: string[];
    investigation_description?: string[];
    instrument_host_name?: string[];
    instrument_host_type?: string[];
    investigation_start_date?: string[];
    investigation_stop_date?: string[];
    instrument_description?: string[];
    'form-instrument-host'?: string[];
    citation_doi?: string[];
    primary_result_processing_level?: string[];
    observation_start_date_time?: string[];
    observation_stop_date_time?: string[];
    investigation_name?: string[];
    investigation_type?: string[];
    primary_result_discipline_name?: string[];
    target_type?: string[];
    service_url?: string[];
    version_id?: string[];
    service_category?: string[];
    'form-target'?: string[];
    target_description?: string[];
    instrument_host_description?: string[];
    investigation_type: string[];
    primary_result_purpose: string[];
    node_id: string[];
    instrument_type: string[];
    facility_country: string[];
    facility_type: string[];
    facility_description: string[];
    telescope_description: string[];
    telescope_aperture: string[];
    instrument_name: string[];
    investigation_ref: string[];
    citation_publication_year: string[];
}

type IdentifierNameDoc = {
    identifier: string[];
    investigation_name: string[];
    instrument_name: string[];
    target_name: string[];
    title: string[];
}

type ResponseHeader = {
    status: number;
    QTime: number;
    params: Params;
}

type Params = {
    q: string;
    start: string;
    fq: string[] | string;
    rows: string;
    wt: string;
}