import http.server
import socketserver
import urllib.request
import urllib.error
import logging
import json
from http.server import BaseHTTPRequestHandler

# Configuration
PROXY_PORT = 3457
TARGET_PORT = 3456
TARGET_URL = f"http://127.0.0.1:{TARGET_PORT}"

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - EMMI Proxy - %(levelname)s - %(message)s')

class ProxyHTTPRequestHandler(BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'

    def do_OPTIONS(self):
        """Handle preflight requests for CORS and Private Network Access."""
        self.send_response(204) # No Content
        self.send_cors_headers()
        self.end_headers()

    def send_cors_headers(self):
        """Inject the necessary headers to bypass browser security."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # Crucial header for HTTPS -> Localhost bridges in 2024+
        self.send_header('Access-Control-Allow-Private-Network', 'true')
        # Handle chunked streaming responses correctly
        self.send_header('Access-Control-Expose-Headers', '*')

    def proxy_request(self, method):
        """Forward the request to the target server and stream the response back."""
        url = f"{TARGET_URL}{self.path}"
        
        # Read body if it's a POST/PUT
        body = None
        if self.headers.get('Content-Length'):
            content_length = int(self.headers.get('Content-Length'))
            body = self.rfile.read(content_length)

        # Prepare request headers for the target
        req_headers = {}
        for key, value in self.headers.items():
            if key.lower() not in ['host']: # Don't forward the proxy host
                req_headers[key] = value

        req = urllib.request.Request(url, data=body, headers=req_headers, method=method)

        try:
            with urllib.request.urlopen(req) as response:
                self.send_response(response.status)
                
                # Forward response headers, replacing/adding our own CORS headers
                for key, value in response.headers.items():
                    if key.lower() not in ['access-control-allow-origin', 'access-control-allow-methods', 'access-control-allow-headers', 'access-control-allow-private-network', 'transfer-encoding']:
                        self.send_header(key, value)
                
                self.send_cors_headers()
                
                # Transfer-encoding logic
                is_chunked = response.headers.get('Transfer-Encoding', '').lower() == 'chunked'
                if is_chunked:
                    self.send_header('Transfer-Encoding', 'chunked')
                self.end_headers()

                # Stream the response body
                while True:
                    chunk = response.read(4096)
                    if not chunk:
                        if is_chunked:
                            self.wfile.write(b'0\r\n\r\n')
                        break
                    if is_chunked:
                        self.wfile.write(f"{len(chunk):X}\r\n".encode())
                        self.wfile.write(chunk)
                        self.wfile.write(b'\r\n')
                    else:
                        self.wfile.write(chunk)
                    self.wfile.flush()

        except urllib.error.HTTPError as e:
            # The target server returned an HTTP error code
            self.send_response(e.code)
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(e.read())
            logging.error(f"Target returned HTTP {e.code} for {self.path}")
            
        except urllib.error.URLError as e:
            # Target server is unreachable (bridge is offline)
            self.send_response(503) # Service Unavailable
            self.send_cors_headers()
            self.end_headers()
            msg = json.dumps({"error": "Target bridge offline or unreachable."}).encode()
            self.wfile.write(msg)
            logging.warning(f"Bridge unreachable. Make sure emmi-bridge.exe is running on port {TARGET_PORT}")
            
        except Exception as e:
            # Generic proxy error
            self.send_response(500)
            self.send_cors_headers()
            self.end_headers()
            logging.error(f"Proxy internal error: {e}")

    def do_GET(self):
        self.proxy_request('GET')

    def do_POST(self):
        self.proxy_request('POST')

def run_proxy():
    # Make sure we can reuse the port immediately
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("127.0.0.1", PROXY_PORT), ProxyHTTPRequestHandler) as httpd:
        logging.info(f"EMMI Proxy Wrapper started.")
        logging.info(f"Listening on: http://127.0.0.1:{PROXY_PORT}")
        logging.info(f"Forwarding to real bridge at: {TARGET_URL}")
        logging.info(f"-> This solves the GitHub HTTPS 'Offline' issue! <-")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            logging.info("Proxy shutting down...")

if __name__ == "__main__":
    run_proxy()
