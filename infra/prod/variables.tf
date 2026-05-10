variable "aws_region" {
  description = "AWS region for S3 and IAM resources."
  type        = string
  default     = "ap-northeast-2"
}

variable "github_repository" {
  description = "GitHub repository allowed to assume the deployment role, in owner/name format."
  type        = string
  default     = "kyhsa93/fove"
}

variable "site_bucket_name" {
  description = "S3 bucket name for static site assets. Must be globally unique."
  type        = string
}

variable "cloudfront_price_class" {
  description = "CloudFront price class. PriceClass_100 is usually enough for low-cost Korea-based static sites."
  type        = string
  default     = "PriceClass_100"
}

variable "enable_cloudfront_default_certificate" {
  description = "Use the default CloudFront certificate. Set false when adding a custom domain and ACM certificate later."
  type        = bool
  default     = true
}
