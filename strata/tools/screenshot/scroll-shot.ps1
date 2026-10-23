# usage: pwsh scroll-shot.ps1 <name> "x,y" [-Notches -5] [-Screen left]
# -> moves the cursor to x,y (relative to the chosen monitor), turns the mouse wheel
# (negative = down), captures the monitor, then restores the cursor.
param([string]$Name, [string]$Point, [int]$Notches = -5, [ValidateSet('right', 'left')][string]$Screen = 'right')
Add-Type -AssemblyName System.Windows.Forms
Add-Type -Namespace W -Name Wheel -MemberDefinition @'
[DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
[DllImport("user32.dll")] public static extern void mouse_event(int flags, int dx, int dy, int data, int extra);
'@
[void][W.Wheel]::SetProcessDPIAware()
$screens = [System.Windows.Forms.Screen]::AllScreens | Sort-Object { $_.Bounds.X }
$b = $(if ($Screen -eq 'left') { $screens[0] } else { $screens[-1] }).Bounds
$orig = [System.Windows.Forms.Cursor]::Position
try {
  $x, $y = $Point.Split(',') | ForEach-Object { [int]$_ }
  [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point ($b.X + $x), ($b.Y + $y)
  Start-Sleep -Milliseconds 150
  $step = if ($Notches -lt 0) { -120 } else { 120 }
  for ($i = 0; $i -lt [Math]::Abs($Notches); $i++) {
    [W.Wheel]::mouse_event(0x0800, 0, 0, $step, 0)
    Start-Sleep -Milliseconds 40
  }
  Start-Sleep -Milliseconds 500
  & (Join-Path $PSScriptRoot 'shot.ps1') $Name -Screen $Screen
} finally {
  [System.Windows.Forms.Cursor]::Position = $orig
}
