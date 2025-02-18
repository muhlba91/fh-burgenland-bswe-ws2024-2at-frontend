#!/bin/bash
set -e
set -o pipefail

# set up variables
BUCKET_NAME=${1:-"your-bucket-name"}
AWS_REGION=${2:-"eu-west-1"}
CACHE_TIME=${3:-"3600"}

# allow public access to the bucket
aws s3api put-public-access-block \
    --bucket "${BUCKET_NAME}" \
    --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# create the bucket
aws s3api create-bucket \
  --bucket "${BUCKET_NAME}" \
  --region "${AWS_REGION}" \
  --create-bucket-configuration LocationConstraint="${AWS_REGION}"

# enable website hosting
aws s3api put-bucket-website \
  --bucket "${BUCKET_NAME}" \
  --website-configuration '{
    "IndexDocument": {"Suffix": "index.html"},
    "ErrorDocument": {"Key": "index.html"}
  }'

# create bucket policy for public read access
aws s3api put-bucket-policy \
  --bucket "${BUCKET_NAME}" \
  --policy "{
    \"Version\": \"2012-10-17\",
    \"Statement\": [
      {
        \"Sid\": \"PublicReadGetObject\",
        \"Effect\": \"Allow\",
        \"Principal\": \"*\",
        \"Action\": \"s3:GetObject\",
        \"Resource\": \"arn:aws:s3:::${BUCKET_NAME}/*\"
      }
    ]
  }"

# sync the distribution directory to the S3 bucket
aws s3 sync dist/spa/ s3://"${BUCKET_NAME}"/ \
  --delete \
  --cache-control "max-age=${CACHE_TIME}"

# get the website URL
echo "website url: http://${BUCKET_NAME}.s3-website.${AWS_REGION}.amazonaws.com"
