param(
    [string]$Game = $env:ARPG_GAME,
    [string]$RunId = $env:ARPG_RUN_ID,
    [string]$Limit = $env:ARPG_LIMIT
)

if ([string]::IsNullOrWhiteSpace($Game)) {
    $Game = "demo"
}

if ([string]::IsNullOrWhiteSpace($RunId)) {
    $RunId = "dev-prepush-" + (Get-Date -Format 'yyyyMMddHHmmss')
}

$argsList = @(
    "--game", $Game,
    "--run-id", $RunId,
    "--auto-archive", "50"
)

if (-not [string]::IsNullOrWhiteSpace($Limit)) {
    $argsList += @("--limit", $Limit)
}

npm run validate:metrics -- @argsList
