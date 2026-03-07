# EMMI CORS Proxy (emmi_proxy.py)

This Python script solves the "Offline" issue on GitHub Pages by acting as a middleman between the web browser and `emmi-bridge.exe`. It automatically injects the necessary security headers (`Access-Control-Allow-Private-Network`) that modern browsers require.

## How to use for testing
1. Start your normal `emmi-bridge.exe` (it runs on port `3456`).
2. Run this python script: `python emmi_proxy.py` (it runs on port `3457`).
3. Open the GitHub Pages site. It will now connect to port `3457` and show "Online"!

## How to package for your Students
You should package this Python script into an invisible `.exe` that launches the bridge and the proxy together.

1. Install PyInstaller:
   ```cmd
   pip install pyinstaller
   ```
2. Build the proxy into a single executable:
   ```cmd
   pyinstaller --onefile --noconsole emmi_proxy.py
   ```
3. You will find `emmi_proxy.exe` in the `dist/` folder.
4. You can instruct your students to run `emmi_proxy.exe` alongside the original bridge, or you can write a simple `.bat` file for them that launches both at the same time.
