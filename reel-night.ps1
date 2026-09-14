$ErrorActionPreference = "Continue"
$root = "C:\Users\Arian\Desktop\chris-miller-brick-paving"
$log = "C:\Users\Arian\AppData\Local\Temp\opencode\reel-night.log"
function L($m) { Add-Content -Path $log -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $m" }

L "=== night loop begin ==="

$mutex = New-Object System.Threading.Mutex($false, "ChMReelsRender")
if (-not $mutex.WaitOne(0)) { L "another render wrapper already running - exit"; exit 0 }

Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -like "*hyperframes*" -or $_.CommandLine -like "*npx --yes hyperframes*" } |
  ForEach-Object { try { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue; L "killed stale render pid $($_.ProcessId)" } catch { } }

& powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $root "render-reels.ps1") 2>&1 | ForEach-Object { L $_ }

Push-Location $root
node reel-hub.js    2>&1 | ForEach-Object { L $_ }
node generate-galleries.js 2>&1 | ForEach-Object { L $_ }
node verify-pages.js 2>&1 | ForEach-Object { L $_ }
node check-resources.js 2>&1 | ForEach-Object { L $_ }
Pop-Location

$renderLog = "C:\Users\Arian\AppData\Local\Temp\opencode\reel-render.log"
if (Test-Path $renderLog) {
  $last = Get-Content $renderLog | Select-Object -Last 200
  if ($last -notcontains "ALLDONE") { L "render log missing ALLDONE - will retry next loop"; }
}

git -C $root add -A
git -C $root commit -m "night loop: render reels, embed, verify" --quiet
git -C $root push origin main 2>&1 | ForEach-Object { L $_ }

$mutex.ReleaseMutex()
$mutex.Dispose()
L "=== night loop done ==="