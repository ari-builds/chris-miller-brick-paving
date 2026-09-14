$ErrorActionPreference = "Continue"
$root = "C:\Users\Arian\Desktop\chris-miller-brick-paving"
$log = "C:\Users\Arian\AppData\Local\Temp\opencode\reel-render.log"
function L($m) { $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $m"; Add-Content -Path $log -Value $line; Write-Host $line }

function Kill-Tree([int]$Pid) {
  Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
    Where-Object { $_.ParentProcessId -eq $Pid } | ForEach-Object { Kill-Tree ([int]$_.ProcessId) }
  try { Stop-Process -Id $Pid -Force -ErrorAction SilentlyContinue } catch { }
}

function Invoke-Render($proj, $label) {
  Push-Location $proj
  $proc = $null
  try {
    $proc = Start-Process -FilePath "npm.cmd" -ArgumentList "run", "render" -NoNewWindow -PassThru
    if (-not $proc.WaitForExit(900000)) {
      L "TIMEOUT $label (15min) - killing"
      Kill-Tree $proc.Id
      return $false
    }
    return $true
  } catch {
    L "ERROR $label :: $($_.Exception.Message)"
    if ($proc) { Kill-Tree $proc.Id }
    return $false
  } finally {
    Pop-Location
  }
}

$cats = @(
  @{ id = "driveways"; dir = "reel-driveways-driveways" },
  @{ id = "patios"; dir = "reel-patios-patios" },
  @{ id = "walkways"; dir = "reel-walkways-walkways" },
  @{ id = "walls"; dir = "reel-rock-block-retaining-walls-walls" }
)

foreach ($c in $cats) {
  $proj = Join-Path $root "videos\$($c.dir)"
  $renders = Join-Path $proj "renders"
  $final = Join-Path $renders "$($c.id)-reel.mp4"
  if (Test-Path $final) { L "SKIP $($c.id) (already rendered)"; continue }
  $before = @(Get-ChildItem -Path $renders -Filter "reel-*.mp4" -ErrorAction SilentlyContinue | ForEach-Object { $_.FullName })
  L "RENDER $($c.id)"
  Invoke-Render $proj $($c.id) | Out-Null
  $raw = Get-ChildItem -Path $renders -Filter "reel-*.mp4" -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -ne $final -and $before -notcontains $_.FullName } |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if (-not $raw) { L "FAIL $($c.id) (no render output)"; continue }
  L "ENC $($c.id) -> $($c.id)-reel.mp4"
  & ffmpeg -y -i $raw.FullName -c:v libx264 -crf 21 -preset medium -pix_fmt yuv420p -movflags +faststart -an $final 2>&1 | Out-Null
  if (-not (Test-Path $final)) { L "FAIL $($c.id) (re-encode failed)"; continue }
  Remove-Item $raw.FullName -Force
  L "DONE $($c.id) -> $([math]::Round((Get-Item $final).Length/1MB,1)) MB"
}

New-Item -ItemType Directory -Path (Join-Path $root "assets\videos") -Force | Out-Null
foreach ($c in $cats) {
  $mp4 = Join-Path $root "videos\$($c.dir)\renders\$($c.id)-reel.mp4"
  if (-not (Test-Path $mp4)) { continue }
  $poster = Join-Path $root "assets\videos\$($c.id)-poster.jpg"
  if (-not (Test-Path $poster)) {
    & ffmpeg -y -ss 1 -i $mp4 -frames:v 1 -q:v 3 $poster 2>&1 | Out-Null
    L "POSTER $($c.id)"
  }
}
L "ALLDONE"