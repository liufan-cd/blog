@echo off
for /f "delims=" %%t in ('chdir') do set current_dir=%%t
python "C:\user\markdown\html\openmd.py" %current_dir% %1 