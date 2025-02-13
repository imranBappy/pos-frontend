@echo off
set /p commit_msg="Enter commit message: "
git add .
git commit -m "%commit_msg%"
git push origin master