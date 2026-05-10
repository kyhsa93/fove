terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Configure the backend from GitHub Actions secrets or local CLI flags.
  # Example:
  # terraform init \
  #   -backend-config="bucket=$TF_STATE_BUCKET" \
  #   -backend-config="key=fove/prod/terraform.tfstate" \
  #   -backend-config="region=$AWS_REGION"
  backend "s3" {}
}

provider "aws" {
  region = var.aws_region
}
