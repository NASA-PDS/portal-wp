# Deployment
# ==========
#
#
# To use this, first do `npm install` and `npm run build` to create the
# `dist` directory. You can then run `terraform init` and `terraform apply`
# to make it live.
#
# Please note that the S3 bucket name below will likely need to be updated.
# The region may need to be updated as well.


# Metadata
# ========
#
# Required Terraform version.

terraform {
  required_version = ">= 1.0.0"
}


# AWS Provision
# =============
#
# If this is incorrect, please go right ahead and modify this as needed.

provider "aws" {
  region = "us-west-2"
}


# S3 Uploading
# ============
#
# After building the project with npm we upload the files from `dist`.

resource "aws_s3_bucket_object" "vite_app_files" {
  for_each = fileset("../apps/frontend/dist", "**")

  bucket = "pds-portal-demo"
  key    = each.value
  source = "${path.module}/../apps/frontend/dist/${each.value}"
  acl    = "public-read"
}


# S3 Policy
# =========
#
# Make sure the files are readable by the public internet.

resource "aws_s3_bucket_policy" "vite_app_bucket_policy" {
  bucket = "pds-portal-demo"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "s3:GetObject"
        Effect    = "Allow"
        Principal = "*"
        Resource  = "arn:aws:s3:::pds-portal-demo/*"
      }
    ]
  })
}
