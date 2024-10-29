# Deployment
# ==========
#
#
# To use this, first do `npm clean-install` and `npm run build` to create the
# `dist` directory in `apps/frontend`.
#
# You can then run:
#
#    terraform init
#    terraform import aws_s3_bucket.vite_app_bucket pds-portal-demo
#    terraform apply
#
# See the note under the vite_app_bucket resource, below.

# Metadata
# ========
#
# Required Terraform version.

terraform {
  required_version = ">=1.2.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0.0"
    }
  }
}

# AWS Provision
# =============
#
# If this is incorrect, please go right ahead and modify this as needed.

provider "aws" {
  region = "us-west-2"
}

# S3 Bucket
# =========
#
# Since Node.js neatly distributes itself into a set of static files, we can
# make the app available over a web server in front of S3. So, let's define
# the S3 bucket.
#
# NOTE: this bucket cannot be created by the user running `terraform apply`
# due to permissions, so once an admin (such as Vivian Tang) has created it,
# simply do:
#
#    terraform import aws_s3_bucket.vite_app_bucket pds-portal-demo
#
# Then you can proceed with:
#
#    terraform apply

resource "aws_s3_bucket" "vite_app_bucket" {
  bucket = "pds-portal-wp-${data.aws_ssm_parameter.venue.value}"

  tags = {
    Alfa = "en"
    Bravo = data.aws_ssm_parameter.venue.value
    Charlie = "portal-wp"
    pds_node = "PDS_ENG"
  }
}

resource "aws_ssm_parameter" "portal_wp_bucket_name" {
  name  = "/pds/portal-wp/s3-bucket"
  description = "S3 bucket hosting the deployed code of the portal-wp application."
  type  = "String"
  overwrite   = true
  value = aws_s3_bucket.vite_app_bucket.bucket
}


# S3 Uploading
# ============
#
# After building the project with npm we upload the files from `dist`.

locals {
  content_type_map = {
    "css"   = "text/css"
    "html"  = "text/html"
    "jpg"   = "image/jpeg"
    "js"    = "application/javascript"
    "png"   = "image/png"
    "svg"   = "image/svg+xml"
    "woff"  = "font/woff"
    "woff2" = "font/woff2"
  }
}

# At least for now, we will use, not use terraform to deploy the data into the bucket
# I am leaving the section in the terraform script though.
resource "aws_s3_object" "vite_app_files" {
  for_each = fileset("../apps/frontend/dist", "**")

  bucket      = aws_s3_bucket.vite_app_bucket.id
  key         = each.value
  source      = "${path.module}/../apps/frontend/dist/${each.value}"
  source_hash = filesha256("${path.module}/../apps/frontend/dist/${each.value}")
  content_type = lookup(
    local.content_type_map, regex("([^.]+)$", "${each.value}")[0], "application/octet-stream"
  )
}


# S3 Policy
# =========
#
# Make sure the files are readable by CloudFront.

resource "aws_s3_bucket_policy" "vite_app_bucket_policy" {
  bucket = aws_s3_bucket.vite_app_bucket.id

  policy = jsonencode({
    "Version": "2008-10-17",
    "Id": "PolicyForCloudFrontPrivateContent",
    "Statement": [
        {
            "Sid": "AllowCloudFrontServicePrincipal",
            "Effect": "Allow",
            "Principal": {
                "Service": "cloudfront.amazonaws.com"
            },
            "Action": "s3:GetObject",
            "Resource": "${aws_s3_bucket.vite_app_bucket.arn}/*",
            "Condition": {
                "StringEquals": {
                  "AWS:SourceArn": ${data.aws-ssm_parameter.cloudfront_dist_arn.value}
                }
            }
        }
    ]
  })
}
