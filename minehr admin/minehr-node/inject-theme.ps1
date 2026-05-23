$files = Get-ChildItem "public/*.html"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -notmatch "theme-init.js") {
        # Inject after <head>
        if ($content -match "<head>") {
            $content = $content -replace "<head>", "<head>`r`n    <script src=`"js/theme-init.js`"></script>"
            Set-Content $file.FullName $content
            Write-Host "Injected into $($file.Name)"
        }
    }
}
