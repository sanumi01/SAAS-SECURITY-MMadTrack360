# PowerShell script to build and deploy frontend to S3/CloudFront
$env:CI = "true"
Write-Host "Building frontend..."
npm run build

Write-Host "Syncing build to S3..."
aws s3 sync dist/ s3://guard-mamaadsolution-prod/ --region us-east-1 --delete --cache-control "public,max-age=31536000,immutable" --exclude "index.html"
aws s3 cp dist/index.html s3://guard-mamaadsolution-prod/ --cache-control "no-cache,no-store,must-revalidate"

Write-Host "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"

Write-Host "Deployment complete!"