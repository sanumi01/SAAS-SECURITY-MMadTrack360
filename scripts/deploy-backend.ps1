# PowerShell script to deploy backend Lambda functions
Write-Host "Packaging backend Lambda functions..."
# Example: zip each function folder
Get-ChildItem -Path ./backend/functions -Directory | ForEach-Object {
    $funcName = $_.Name
    $zipPath = "./backend/functions/$funcName.zip"
    Compress-Archive -Path "./backend/functions/$funcName/*" -DestinationPath $zipPath -Force
    Write-Host "Packaged $funcName as $zipPath"
}

Write-Host "Deploying Lambda functions via AWS CLI..."
# Example: update-function-code (replace with your function names and ARNs)
# aws lambda update-function-code --function-name my-function --zip-file fileb://backend/functions/my-function.zip

Write-Host "Backend deployment complete!"