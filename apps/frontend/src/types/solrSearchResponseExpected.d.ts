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

export type SearchResultDoc = {
    file_ref_location: string | string[];
    data_class: string | string[];
    description: string | string[];
    file_ref_url: string | string[];
    title: string | string[];
    resLocation: string | string[];
    objectType: string | string[];
    product_class: string | string[];
    data_product_type: string | string[];
    file_ref_size: string | string[];
    modification_date: string | string[];
    file_ref_name: string | string[];
    identifier: string | string[];
    resource_url: string | string[];
    agency_name: string | string[];
    'form-agency': string | string[];
    modification_description: string | string[];
    resource_type: string | string[];
    search_id: string | string[];
    pds_model_version: string | string[];
    resource_description: string | string[];
    resource_name: string | string[];
    timestamp: string | string[];
    score: number;
    collection_type?: string | string[];
    investigation_description?: string | string[];
    instrument_host_name?: string | string[];
    investigation_start_date?: string | string[];
    investigation_stop_date?: string | string[];
    instrument_description?: string | string[];
    'form-instrument-host'?: string | string[];
    citation_doi?: string | string[];
    primary_result_processing_level?: string | string[];
    observation_start_date_time?: string | string[];
    observation_stop_date_time?: string | string[];
    investigation_name?: string | string[];
    primary_result_discipline_name?: string | string[];
    target_type?: string | string[];
    service_url?: string | string[];
    version_id?: string | string[];
    service_category?: string | string[];
    'form-target'?: string | string[];
    target_description?: string | string[];
    instrument_host_description?: string | string[];
    investigation_type: string | string[];
    primary_result_purpose: string | string[];
    node_id: string | string[];
    instrument_type: string | string[];
    facility_country: string | string[];
    facility_type: string | string[];
    facility_description: string | string[];
    telescope_description: string | string[];
    telescope_aperture: string | string[];
    instrument_name: string | string[];
    investigation_ref: string | string[];
    citation_publication_year: string | string[];
}

type IdentifierNameDoc = {
    identifier: string | string[];
    investigation_name: string | string[];
    instrument_name: string | string[];
    target_name: string | string[];
    title: string | string[];
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