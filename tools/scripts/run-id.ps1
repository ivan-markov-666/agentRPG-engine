param(
    [string]$Prefix = "dev",
    [switch]$Copy
)

function New-AgentRPGRunId {
    param(
        [string]$Prefix = "dev",
        [switch]$Copy
    )

    $uuid = [guid]::NewGuid().ToString().ToLower()
    $runId = "$Prefix-$uuid"

    if ($Copy) {
        if (Get-Command Set-Clipboard -ErrorAction SilentlyContinue) {
            Set-Clipboard -Value $runId
            Write-Output "[run-id] Copied $runId to clipboard"
        } else {
            Write-Warning "Clipboard utility not available. Run ID: $runId"
        }
    } else {
        Write-Output $runId
    }
}

if ($MyInvocation.InvocationName -eq '.') {
    return
}

New-AgentRPGRunId -Prefix $Prefix -Copy:$Copy | Write-Output
