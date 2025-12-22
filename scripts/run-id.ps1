function New-AgentRPGRunId {
    param(
        [Parameter(Position = 0)]
        [string]$Persona = "dev",
        [switch]$IncludeBranch
    )
    $timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    if ($IncludeBranch) {
        try {
            $branch = (git rev-parse --abbrev-ref HEAD) 2>$null
            if ([string]::IsNullOrWhiteSpace($branch)) {
                $branch = "unknown-branch"
            }
        } catch {
            $branch = "no-git"
        }
        return "$Persona-$branch-$timestamp"
    }
    return "$Persona-$timestamp"
}

function Set-AgentRPGRunIdEnv {
    param(
        [Parameter(Position = 0)]
        [string]$Persona = "dev",
        [switch]$IncludeBranch
    )
    $env:AGENTRPG_RUN_ID = New-AgentRPGRunId -Persona $Persona -IncludeBranch:$IncludeBranch
    Write-Output $env:AGENTRPG_RUN_ID
}

Export-ModuleMember -Function New-AgentRPGRunId, Set-AgentRPGRunIdEnv
