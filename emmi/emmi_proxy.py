import http.server
import socketserver
import urllib.request
import urllib.error
import logging
import json
import sys

# Configuration
PROXY_PORT = 3457
TARGET_PORT = 3456
TARGET_URL = f"http://127.0.0.1:{TARGET_PORT}"

# Configure logging to both console and file
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - EMMI Proxy - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
    ]
)

class ProxyHTTPRequestHandler(http.server.BaseHTTPRequestHandler):
    """
    A reverse proxy that sits between the HTTPS website and the local bridge.
    It injects CORS + Private Network Access headers so Chrome allows the connection.
    """

    def log_message(self, format, *args):
        """Override to use our logger instead of stderr."""
        logging.info(format % args)

    def do_OPTIONS(self):
        """Handle preflight requests for CORS and Private Network Access."""
        self.send_response(200)
        self.send_cors_headers()
        self.send_header('Content-Length', '0')
        self.end_headers()

    def send_cors_headers(self):
        """Inject ALL necessary headers to bypass browser security."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Access-Control-Allow-Private-Network', 'true')
        self.send_header('Access-Control-Expose-Headers', '*')
        self.send_header('Access-Control-Max-Age', '86400')

    def send_error_response(self, code, body_dict):
        """Send a proper error response with Content-Length."""
        body = json.dumps(body_dict).encode('utf-8')
        self.send_response(code)
        self.send_cors_headers()
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def proxy_request(self, method):
        """Forward the request to the target server and return the response."""
        url = f"{TARGET_URL}{self.path}"

        # Read body if present
        body = None
        content_length = self.headers.get('Content-Length')
        if content_length:
            body = self.rfile.read(int(content_length))

        # Prepare request headers (skip headers that shouldn't be forwarded)
        skip_headers = {'host', 'origin', 'referer', 'access-control-request-method',
                        'access-control-request-headers', 'access-control-request-private-network'}
        req_headers = {}
        for key, value in self.headers.items():
            if key.lower() not in skip_headers:
                req_headers[key] = value

        req = urllib.request.Request(url, data=body, headers=req_headers, method=method)

        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                # Read the entire response body first so we know Content-Length
                response_body = response.read()

                self.send_response(response.status)

                # Forward safe response headers
                skip_response = {'access-control-allow-origin', 'access-control-allow-methods',
                                 'access-control-allow-headers', 'access-control-allow-private-network',
                                 'transfer-encoding', 'content-length', 'connection'}
                for key, value in response.headers.items():
                    if key.lower() not in skip_response:
                        self.send_header(key, value)

                self.send_cors_headers()
                self.send_header('Content-Length', str(len(response_body)))
                self.end_headers()
                self.wfile.write(response_body)

        except urllib.error.HTTPError as e:
            error_body = e.read()
            self.send_response(e.code)
            self.send_cors_headers()
            self.send_header('Content-Length', str(len(error_body)))
            self.end_headers()
            self.wfile.write(error_body)
            logging.error(f"Bridge returned HTTP {e.code} for {self.path}")

        except urllib.error.URLError as e:
            self.send_error_response(503, {
                "error": "Bridge offline",
                "detail": f"Cannot reach emmi-bridge at {TARGET_URL}. Is it running?"
            })
            logging.warning(f"Bridge unreachable at {TARGET_URL} - is emmi-bridge.exe running?")

        except Exception as e:
            self.send_error_response(500, {"error": str(e)})
            logging.error(f"Proxy error: {e}")

    def do_GET(self):
        self.proxy_request('GET')

    def do_POST(self):
        self.proxy_request('POST')


def run_proxy():
    socketserver.TCPServer.allow_reuse_address = True

    try:
        with socketserver.TCPServer(("127.0.0.1", PROXY_PORT), ProxyHTTPRequestHandler) as httpd:
            print("=" * 50)
            print("  EMMI CORS Proxy - RUNNING")
            print("=" * 50)
            print(f"  Proxy listening on:  http://127.0.0.1:{PROXY_PORT}")
            print(f"  Forwarding to:       {TARGET_URL}")
            print(f"  Status:              READY")
            print("=" * 50)
            print("  Keep this window open while using the EMMI IDE.")
            print("  Press Ctrl+C to stop.")
            print("=" * 50)
            sys.stdout.flush()

            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nProxy stopped.")
    except OSError as e:
        if "Address already in use" in str(e) or "10048" in str(e):
            print(f"ERROR: Port {PROXY_PORT} is already in use.")
            print("The proxy may already be running. Check your task manager.")
        else:
            print(f"ERROR: {e}")
        input("Press Enter to exit...")


if __name__ == "__main__":
    run_proxy()
