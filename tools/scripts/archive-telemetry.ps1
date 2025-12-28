param(
    [string]$Label = "scheduled",
    [string]$History = "docs/analysis/reports/telemetry-history.json",
    [switch]$DryRun
)

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot ".."))
Push-Location $projectRoot
try {
    if ($DryRun) {
        Write-Host "[ARCHIVE][DRY-RUN] npm run archive:telemetry -- --label $Label --history $History"
    } else {
        npm run archive:telemetry -- --label $Label --history $History
        if ($LASTEXITCODE -ne 0) {
            throw "archive:telemetry failed with exit code $LASTEXITCODE"
        }
    }
}
finally {
    Pop-Location
}
