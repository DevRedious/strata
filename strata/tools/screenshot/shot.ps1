# usage: pwsh shot.ps1 <name> -> captures the rightmost monitor to %TEMP%\strata-shots\<name>.png
param([string]$Name = 'shot')
Add-Type -AssemblyName System.Windows.Forms, System.Drawing
Add-Type -Namespace W -Name Dpi -MemberDefinition '[DllImport("user32.dll")] public static extern bool SetProcessDPIAware();'
[void][W.Dpi]::SetProcessDPIAware()
$b = ([System.Windows.Forms.Screen]::AllScreens | Sort-Object { $_.Bounds.X } | Select-Object -Last 1).Bounds
$bmp = New-Object System.Drawing.Bitmap $b.Width, $b.Height
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.CopyFromScreen($b.X, $b.Y, 0, 0, $b.Size)
$dir = Join-Path $env:TEMP 'strata-shots'
New-Item -ItemType Directory -Force $dir | Out-Null
$out = Join-Path $dir "$Name.png"
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
$out
