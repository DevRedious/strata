# usage: pwsh hover-shot.ps1 <name> "x1,y1;x2,y2;..." -> moves the cursor through the points
# (relative to the rightmost monitor), captures it, then restores the cursor.
param([string]$Name, [string]$Path)
Add-Type -AssemblyName System.Windows.Forms
Add-Type -Namespace W -Name Dpi -MemberDefinition '[DllImport("user32.dll")] public static extern bool SetProcessDPIAware();'
[void][W.Dpi]::SetProcessDPIAware()
$b = ([System.Windows.Forms.Screen]::AllScreens | Sort-Object { $_.Bounds.X } | Select-Object -Last 1).Bounds
$orig = [System.Windows.Forms.Cursor]::Position
function Set-CursorAt([int]$x, [int]$y) {
  [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point ($b.X + $x), ($b.Y + $y)
  Start-Sleep -Milliseconds 60
}
try {
  $points = $Path.Split(';') | ForEach-Object { , ($_.Split(',') | ForEach-Object { [int]$_ }) }
  $first = $true
  foreach ($p in $points) {
    Set-CursorAt $p[0] $p[1]
    if ($first) { Set-CursorAt $p[0] ($p[1] + 4); Start-Sleep -Milliseconds 600; $first = $false }
  }
  Start-Sleep -Milliseconds 350
  & (Join-Path $PSScriptRoot 'shot.ps1') $Name
} finally {
  [System.Windows.Forms.Cursor]::Position = $orig
}
