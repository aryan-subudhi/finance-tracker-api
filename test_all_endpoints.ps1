
$registerBody = @{ username = "testuser"; email = "testuser@example.com"; password = "TestPass123" } | ConvertTo-Json
$registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
Write-Host "Register Response:" $registerResponse


$loginBody = @{ email = "testuser@example.com"; password = "TestPass123" } | ConvertTo-Json
$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
Write-Host "Login Response:" $loginResponse
$token = $loginResponse.token
$headers = @{ Authorization = "Bearer $token" }


$summary = Invoke-RestMethod -Uri "http://localhost:5000/api/summary" -Headers $headers
Write-Host "Summary:" $summary


$transactionBody = @{ date = "2025-06-21"; description = "Grocery"; amount = 1200; category = "Food"; type = "Expense" } | ConvertTo-Json
$addTransaction = Invoke-RestMethod -Uri "http://localhost:5000/api/transactions" -Method Post -Headers $headers -Body $transactionBody -ContentType "application/json"
Write-Host "Add Transaction Response:" $addTransaction
$transactionId = $addTransaction._id


$transactions = Invoke-RestMethod -Uri "http://localhost:5000/api/transactions" -Headers $headers
Write-Host "Transactions:" $transactions


$updateBody = @{ description = "Updated Grocery" } | ConvertTo-Json
$updateTransaction = Invoke-RestMethod -Uri "http://localhost:5000/api/transactions/$transactionId" -Method Put -Headers $headers -Body $updateBody -ContentType "application/json"
Write-Host "Update Transaction Response:" $updateTransaction


$deleteTransaction = Invoke-RestMethod -Uri "http://localhost:5000/api/transactions/$transactionId" -Method Delete -Headers $headers
Write-Host "Delete Transaction Response:" $deleteTransaction


Invoke-RestMethod -Uri "http://localhost:5000/api/transactions/export/csv" -Headers $headers -OutFile "transactions.csv"
Write-Host "Exported transactions to transactions.csv"


$analytics = Invoke-RestMethod -Uri "http://localhost:5000/api/transactions/analytics/category-summary" -Headers $headers
Write-Host "Analytics:" $analytics


$theme = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/theme" -Headers $headers
Write-Host "Theme:" $theme


$themeBody = @{ theme = "dark" } | ConvertTo-Json
$updateTheme = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/theme" -Method Put -Headers $headers -Body $themeBody -ContentType "application/json"
Write-Host "Update Theme Response:" $updateTheme


$health = Invoke-RestMethod -Uri "http://localhost:5000/api/health"
Write-Host "Health Check:" $health 