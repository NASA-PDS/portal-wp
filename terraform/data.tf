data "aws_ssm_parameter" "venue" {
    name = "/pds/core/venue"
}

data "aws_ssm_parameter" "region" {
    name = "/pds/core/region"
}

data "aws_ssm_parameter" "cloudfront_dist_arn" {
    name = "/pds/core/cloudfront-distribution/arn"
}
