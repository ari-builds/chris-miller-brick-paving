$ErrorActionPreference = "Continue"
$rgan = "C:\Users\Arian\AppData\Local\Temp\opencode\realesrgan\realesrgan-ncnn-vulkan.exe"
$root = "C:\Users\Arian\Desktop\chris-miller-brick-paving\assets\photos"
$log = "C:\Users\Arian\AppData\Local\Temp\opencode\ai-enhance.log"
$work = "C:\Users\Arian\AppData\Local\Temp\opencode\ai-enhance-work"
$tmpPng = Join-Path $work "out.png"
$tmpJpg = Join-Path $work "out.jpg"
New-Item -ItemType Directory -Path $work -Force | Out-Null

function L($m) { Add-Content -Path $log -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $m"; Write-Host $m }

$done = @{}
if (Test-Path $log) { Get-Content $log | Where-Object { $_ -match '^.*  OK ' } | ForEach-Object { $done[($_ -split '  OK ')[-1]] = $true } }

$cats = @("driveways", "pools", "patios", "walkways", "walls")
$total = 0
$enhanced = 0

foreach ($cat in $cats) {
  $base = Join-Path $root $cat
  if (-not (Test-Path $base)) { continue }
  foreach ($f in (Get-ChildItem $base -Filter *.jpg -File)) {
    $total++
    $key = "$cat/$($f.Name)"
    if ($done[$key]) { continue }
    L "AI $cat/$($f.Name) ..."
    $backup = Join-Path $root "_orig" $cat
    New-Item -ItemType Directory -Path $backup -Force | Out-Null
    if (-not (Test-Path (Join-Path $backup $f.Name))) { Copy-Item $f.FullName (Join-Path $backup $f.Name) -Force }

    & $rgan -i $f.FullName -o $tmpPng -s 4 -n realesrgan-x4plus *> $null
    if (-not (Test-Path $tmpPng)) { L "FAIL $key"; continue }
    & ffmpeg -y -i $tmpPng -vf "scale=1200:900,lanczos,unsharp=3:3:0.4" -q:v 3 $tmpJpg 2>&1 | Out-Null
    if (-not (Test-Path $tmpJpg)) { L "ENCFAIL $key"; Remove-Item $tmpPng -ErrorAction SilentlyContinue; continue }
    Copy-Item $tmpJpg $f.FullName -Force
    Remove-Item $tmpPng, $tmpJpg -ErrorAction SilentlyContinue
    $enhanced++
    L "OK $key"
  }
}

L "ALLDONE total=$total enhanced=$enhanced"