param(
  [ValidateSet("codex", "claude")]
  [string]$Target = "codex"
)

$ErrorActionPreference = "Stop"

$repo = Split-Path -Parent $PSScriptRoot
$skillsRoot = if ($Target -eq "claude") {
  Join-Path $env:USERPROFILE ".claude\skills"
} else {
  Join-Path $env:USERPROFILE ".codex\skills"
}

New-Item -ItemType Directory -Force $skillsRoot | Out-Null

function Copy-SkillFolder {
  param(
    [string]$Source,
    [string]$Name
  )

  $dest = Join-Path $skillsRoot $Name
  $resolvedSource = (Resolve-Path -LiteralPath $Source).Path
  $resolvedDest = if (Test-Path $dest) { (Resolve-Path -LiteralPath $dest).Path } else { $dest }

  if ($resolvedSource -eq $resolvedDest) {
    Write-Host "Already installed $Name -> $dest"
    return
  }

  if (Test-Path $dest) {
    Remove-Item -LiteralPath $dest -Recurse -Force
  }
  Copy-Item -LiteralPath $Source -Destination $dest -Recurse

  foreach ($excluded in @(".git", "node_modules", "outputs", "auth")) {
    $excludedPath = Join-Path $dest $excluded
    if (Test-Path $excludedPath) {
      Remove-Item -LiteralPath $excludedPath -Recurse -Force
    }
  }

  Write-Host "Installed $Name -> $dest"
}

Copy-SkillFolder -Source $repo -Name "universal-data-acquisition-pipeline"

Get-ChildItem -LiteralPath (Join-Path $repo "skills") -Directory | ForEach-Object {
  Copy-SkillFolder -Source $_.FullName -Name $_.Name
}
