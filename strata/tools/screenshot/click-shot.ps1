# usage: pwsh click-shot.ps1 <name> "x1,y1;x2,y2;..." -> clicks each point in turn
# (relative to the rightmost monitor), captures it, then restores the cursor.
param([string]$Name, [string]$Points, [int]$DelayMs = 700)
Add-Type -AssemblyName System.Windows.Forms
Add-Type -Namespace W -Name Click -MemberDefinition @'
[DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
[DllImport("user32.dll")] public static extern void mouse_event(int flags, int dx, int dy, int data, int extra);
'@
[void][W.Click]::SetProcessDPIAware()
$b = ([System.Windows.Forms.Screen]::AllScreens | Sort-Object { $_.Bounds.X } | Select-Object -Last 1).Bounds
$orig = [System.Windows.Forms.Cursor]::Position
try {
  foreach ($p in $Points.Split(';')) {
    $x, $y = $p.Split(',') | ForEach-Object { [int]$_ }
    [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point ($b.X + $x), ($b.Y + $y)
    Start-Sleep -Milliseconds 150
    [W.Click]::mouse_event(2, 0, 0, 0, 0)
    [W.Click]::mouse_event(4, 0, 0, 0, 0)
    Start-Sleep -Milliseconds $DelayMs
  }
  & (Join-Path $PSScriptRoot 'shot.ps1') $Name
} finally {
  [System.Windows.Forms.Cursor]::Position = $orig
}
