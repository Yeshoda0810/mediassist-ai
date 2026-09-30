@echo off
setlocal
set MVN_VERSION=3.9.11
set DIR=%~dp0
set M2=%DIR%.maven\apache-maven-%MVN_VERSION%
if exist "%M2%\bin\mvn.cmd" goto run
if not exist "%DIR%.maven" mkdir "%DIR%.maven"
powershell -NoProfile -Command "Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/%MVN_VERSION%/binaries/apache-maven-%MVN_VERSION%-bin.zip' -OutFile '%DIR%.maven\maven.zip'"
powershell -NoProfile -Command "Expand-Archive -Path '%DIR%.maven\maven.zip' -DestinationPath '%DIR%.maven' -Force"
del "%DIR%.maven\maven.zip"
:run
call "%M2%\bin\mvn.cmd" %*
endlocal
