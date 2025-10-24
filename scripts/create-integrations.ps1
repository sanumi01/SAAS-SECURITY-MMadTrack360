# PowerShell script to automate AWS API Gateway Lambda integrations for all API IDs and functions

# List of your API IDs
$apiIds = @(
    "2fnaijjjz9",
    "2ge6lzu53g",
    "4cqpsrzk77",
    "8omdymayn0",
    "9cacp84y1h",
    "9te1h8n8gh",
    "a9a9rhusq6",
    "bxdccvs9jj",
    "cih01bwx29",
    "f0kfq39pu3",
    "n7gfi9kjdk",
    "saz2u4myr0",
    "u5xp3tchy7",
    "viugz5ie0i",
    "whspv413ih",
    "z1suoj14q1"
)

# List of Lambda function names
$lambdaFunctions = @(
    "admin-access",
    "admin-staff-management",
    "admin-analytics",
    "admin-settings",
    "admin-subscription",
    "admin-communication",
    "admin-scheduling",
    "admin-location",
    "admin-alert",
    "staff-scan",
    "staff-location",
    "staff-scheduling"
)

# AWS region and account
$region = "us-west-2"
$account = "376467672970"

foreach ($apiId in $apiIds) {
    foreach ($function in $lambdaFunctions) {
    $integrationUri = "arn:aws:lambda:${region}:${account}:function:${function}"
        Write-Host "Creating integration for $function on API $apiId..."
        aws apigatewayv2 create-integration --api-id $apiId --integration-type AWS_PROXY --integration-uri $integrationUri --payload-format-version 2.0
    }
}

Write-Host "All integrations created. Save the IntegrationIds from the output for route setup."