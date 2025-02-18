#!/bin/bash
set -e
set -o pipefail

# set up variables
BUCKET_NAME=${1:-"your-bucket-name"}
AWS_REGION=${2:-"eu-west-1"}
CACHE_TIME=${3:-"3600"}
AWS_ACCOUNT_ID=${4:-$(aws sts get-caller-identity --query 'Account' --output text)}

# create the S3 bucket
aws s3api create-bucket \
  --bucket "${BUCKET_NAME}" \
  --region "${AWS_REGION}" \
  --create-bucket-configuration LocationConstraint="${AWS_REGION}"

# block all public access to the S3 bucket
aws s3api put-public-access-block \
  --bucket "${BUCKET_NAME}" \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# create the CloudFront Origin Access Control (OAC)
OAC_ID=$(aws cloudfront create-origin-access-control \
  --origin-access-control-config "{
    \"Name\": \"S3-${BUCKET_NAME}-OAC\",
    \"Description\": \"OAC for Weather App S3 bucket\",
    \"SigningProtocol\": \"sigv4\",
    \"SigningBehavior\": \"always\",
    \"OriginAccessControlOriginType\": \"s3\"
  }" \
  --query 'OriginAccessControl.Id' \
  --output text)

# create the CloudFront distribution
DISTRIBUTION_ID=$(aws cloudfront create-distribution \
  --distribution-config "{
    \"CallerReference\": \"$(date +%s)\",
    \"Comment\": \"Weather App\",
    \"Enabled\": true,
    \"DefaultRootObject\": \"index.html\",
    \"PriceClass\": \"PriceClass_All\",
    \"Origins\": {
      \"Quantity\": 1,
      \"Items\": [
        {
          \"Id\": \"S3-${BUCKET_NAME}\",
          \"DomainName\": \"${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com\",
          \"OriginAccessControlId\": \"${OAC_ID}\",
          \"S3OriginConfig\": {
            \"OriginAccessIdentity\": \"\"
          }
        }
      ]
    },
    \"DefaultCacheBehavior\": {
      \"TargetOriginId\": \"S3-${BUCKET_NAME}\",
      \"ViewerProtocolPolicy\": \"redirect-to-https\",
      \"AllowedMethods\": {
        \"Quantity\": 2,
        \"Items\": [\"GET\", \"HEAD\"],
        \"CachedMethods\": {
          \"Quantity\": 2,
          \"Items\": [\"GET\", \"HEAD\"]
        }
      },
      \"CachePolicyId\": \"658327ea-f89d-4fab-a63d-7e88639e58f6\",
      \"Compress\": true
    },
    \"CustomErrorResponses\": {
      \"Quantity\": 1,
      \"Items\": [{
        \"ErrorCode\": 404,
        \"ResponsePagePath\": \"/index.html\",
        \"ResponseCode\": \"200\",
        \"ErrorCachingMinTTL\": 300
      }]
    }
  }" \
  --query 'Distribution.Id' \
  --output text)

# create the bucket policy with the DISTRIBUTION_ID
aws s3api put-bucket-policy \
  --bucket "${BUCKET_NAME}" \
  --policy "{
    \"Version\": \"2012-10-17\",
    \"Statement\": [
      {
        \"Sid\": \"AllowCloudFrontServicePrincipal\",
        \"Effect\": \"Allow\",
        \"Principal\": {
          \"Service\": \"cloudfront.amazonaws.com\"
        },
        \"Action\": \"s3:GetObject\",
        \"Resource\": \"arn:aws:s3:::${BUCKET_NAME}/*\",
        \"Condition\": {
          \"StringEquals\": {
            \"AWS:SourceArn\": \"arn:aws:cloudfront::${AWS_ACCOUNT_ID}:distribution/${DISTRIBUTION_ID}\"
          }
        }
      }
    ]
  }"

# wait for the distribution to be deployed
aws cloudfront wait distribution-deployed --id "${DISTRIBUTION_ID}"

# sync the distribution directory to the S3 bucket
aws s3 sync dist/spa/ s3://"${BUCKET_NAME}"/ \
  --delete \
  --cache-control "max-age=${CACHE_TIME}"

# get the CloudFront domain name
DOMAIN_NAME=$(aws cloudfront get-distribution \
  --id "${DISTRIBUTION_ID}" \
  --query 'Distribution.DomainName' \
  --output text)
echo "website url: https://${DOMAIN_NAME}"
