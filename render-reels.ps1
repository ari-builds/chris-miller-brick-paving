$ErrorActionPreference = "Continue"
$root = "C:\Users\Arian\Desktop\chris-miller-brick-paving"
$log = "C:\Users\Arian\AppData\Local\Temp\opencode\reel-render.log"
function L($m) { $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $m"; Add-Content -Path $log -Value $line; Write-Host $line }

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
  if (Test-Path $final) { L "SKIP $($c.id) (already rendered: $final)"; continue }
  L "RENDER $($c.id) in $proj"
  Push-Location $proj
  npm run render 2>&1 | Out-Null
  Pop-Location
  $raw = Get-ChildItem -Path $renders -Filter "reel-*.mp4" -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -ne $final } |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if (-not $raw -or -not (Test-Path $raw.FullName)) { L "FAIL $($c.id) (no render output)"; continue }
  L "ENC   $($c.id) $($raw.Name) -> $($c.id)-reel.mp4"
  & ffmpeg -y -i $raw.FullName -c:v libx264 -crf 21 -preset medium -pix_fmt yuv420p -movflags +faststart -an $final 2>&1 | Out-Null
  if (-not (Test-Path $final)) { L "FAIL $($c.id) (re-encode failed)"; continue }
  Remove-Item $raw.FullName -Force
  L "DONE  $($c.id) -> $final ($([math]::Round((Get-Item $final).Length/1MB,1)) MB)"
}

New-Item -ItemType Directory -Path (Join-Path $root "assets\videos") -Force | Out-Null
foreach ($c in $cats) {
  $mp4 = Join-Path $root "videos\$($c.dir)\renders\$($c.id)-reel.mp4"
  if (-not (Test-Path $mp4)) { continue }
  $poster = Join-Path $root "assets\videos\$($c.id)-poster.jpg"
  if (-not (Test-Path $poster)) {
    & ffmpeg -y -ss 1 -i $mp4 -frames:v 1 -q:v 3 $poster 2>&1 | Out-Null
    L "POSTER $($c.id) -> $poster"
  }
}
L "ALLDONE"