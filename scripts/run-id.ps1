param(
    [string]$Prefix = "dev",
    [switch]$Copy
)

$toolsScript = Join-Path $PSScriptRoot "..\tools\scripts\run-id.ps1"
. $toolsScript

function Set-AgentRPGRunIdEnv {
    param(
        [string]$Prefix = "dev",
        [switch]$Copy
    )
    $env:AGENTRPG_RUN_ID = New-AgentRPGRunId -Prefix $Prefix -Copy:$Copy
    Write-Output $env:AGENTRPG_RUN_ID
}

if ($MyInvocation.InvocationName -eq '.') {
    return
}

New-AgentRPGRunId -Prefix $Prefix -Copy:$Copy | Write-Output
