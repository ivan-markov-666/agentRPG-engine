param(
    [string]$Game = $env:ARPG_GAME,
    [string]$RunId = $env:ARPG_RUN_ID,
    [string]$Limit = $env:ARPG_LIMIT,
    [string]$AutoArchive = $env:ARPG_AUTO_ARCHIVE
)

try {
    $repoRoot = (& git rev-parse --show-toplevel 2>$null).Trim()
} catch {
    $repoRoot = $null
}

if ([string]::IsNullOrWhiteSpace($repoRoot)) {
    $repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
}

Set-Location $repoRoot

if ([string]::IsNullOrWhiteSpace($Game)) {
    $Game = "demo"
}

if ([string]::IsNullOrWhiteSpace($RunId)) {
    $RunId = "dev-prepush-" + (Get-Date -Format 'yyyyMMddHHmmss')
}

if ([string]::IsNullOrWhiteSpace($AutoArchive)) {
    $AutoArchive = "50"
}

$argsList = @(
    "--game", $Game,
    "--run-id", $RunId,
    "--auto-archive", $AutoArchive
)

if (-not [string]::IsNullOrWhiteSpace($Limit)) {
    $argsList += @("--limit", $Limit)
}

npm run validate:metrics -- @argsList
