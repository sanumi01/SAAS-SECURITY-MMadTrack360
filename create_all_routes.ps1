# PowerShell script to create all staff-add and staff-list routes for each API ID
$routes = @(
    @{ ApiId = "f0kfq39pu3"; StaffAdd = "b80bq4k"; StaffList = "qjkwkyp" },
    @{ ApiId = "n7gfi9kjdk"; StaffAdd = "9cj30vm"; StaffList = "fkvgn4t" },
    @{ ApiId = "saz2u4myr0"; StaffAdd = "jtzpas0"; StaffList = "tt7wyhj" },
    @{ ApiId = "u5xp3tchy7"; StaffAdd = "8l9mlxb"; StaffList = "s62gxlq" },
    @{ ApiId = "viugz5ie0i"; StaffAdd = "v6sx46m"; StaffList = "ntvmj5h" },
    @{ ApiId = "whspv413ih"; StaffAdd = "ro89alc"; StaffList = "saqsb8i" },
    @{ ApiId = "z1suoj14q1"; StaffAdd = "1qjnylo"; StaffList = "0ue5q8u" }
)

foreach ($route in $routes) {
    Write-Host "Creating POST /staff/add route for $($route.ApiId)"
    aws apigatewayv2 create-route --api-id $route.ApiId --route-key "POST /staff/add" --target "integrations/$($route.StaffAdd)"
    Write-Host "Creating GET /staff/list route for $($route.ApiId)"
    aws apigatewayv2 create-route --api-id $route.ApiId --route-key "GET /staff/list" --target "integrations/$($route.StaffList)"
}

Write-Host "All routes created."
