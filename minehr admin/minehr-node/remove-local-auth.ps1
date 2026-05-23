$files = Get-ChildItem "public/*.html"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    # Regex to find the checkAuth function definition and remove it
    # We look for async function checkAuth() { ... } with internal content
    $newContent = $content -replace "(?s)async function checkAuth\(\)\s*\{.*?\r?\n\s*\}", ""
    
    if ($content -ne $newContent) {
        Set-Content $file.FullName $newContent
        Write-Host "Removed local checkAuth from $($file.Name)"
    }
}
