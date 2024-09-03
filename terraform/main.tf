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

# S3 Bucket
# =========
#
# Since Node.js neatly distributes itself into a set of static files, we can
# make the app available over a web server in front of S3. So, let's define
# the S3 bucket.

resource "aws_s3_bucket" "vite_app_bucket" {
  bucket = "pds-en"  # TBD: Please fill in the correct bucket name
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}


# S3 Uploading
# ============
#
# After building the project with npm we upload the files from `dist`.

resource "aws_s3_bucket_object" "vite_app_files" {
  for_each = fileset("../dist", "**")

  bucket = aws_s3_bucket.vite_app_bucket.id
  key    = each.value
  source = "${path.module}/../dist/${each.value}"
  acl    = "public-read"
}


# S3 Policy
# =========
#
# Make sure the files are readable by the public internet.

resource "aws_s3_bucket_policy" "vite_app_bucket_policy" {
  bucket = aws_s3_bucket.vite_app_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "s3:GetObject"
        Effect    = "Allow"
        Principal = "*"
        Resource  = "${aws_s3_bucket.vite_app_bucket.arn}/*"
      }
    ]
  })
}

output "s3_bucket_website_url" {
  value = aws_s3_bucket.vite_app_bucket.website_endpoint
}
