$url = "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"
$dest = "$env:LOCALAPPDATA\Maven"
$zip = "$dest\maven.zip"

Write-Host "Creating directory $dest..."
New-Item -ItemType Directory -Force -Path $dest | Out-Null

Write-Host "Downloading Maven from $url..."
Invoke-WebRequest -Uri $url -OutFile $zip

Write-Host "Extracting Maven..."
Expand-Archive -Path $zip -DestinationPath $dest -Force

$mavenHome = Get-ChildItem -Path $dest -Filter "apache-maven*" | Select-Object -ExpandProperty FullName
Write-Host "Maven Home found at: $mavenHome"

$binPath = "$mavenHome\bin"
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")

if ($currentPath -notlike "*$binPath*") {
    Write-Host "Adding $binPath to User PATH..."
    [Environment]::SetEnvironmentVariable("Path", $currentPath + ";$binPath", "User")
} else {
    Write-Host "Maven is already in User PATH."
}

Write-Host "Installation complete. Please restart your terminal/IDE."
