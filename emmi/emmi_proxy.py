import http.server
import socketserver
import urllib.request
import urllib.error
import logging
import json
import sys
import threading
import time

# Configuration
PROXY_PORT = 3457
TARGET_PORT = 3456
TARGET_URL = f"http://127.0.0.1:{TARGET_PORT}"

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - EMMI Proxy - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)


class ProxyHTTPRequestHandler(http.server.BaseHTTPRequestHandler):
    """Reverse proxy that injects CORS + PNA headers for Chrome."""

    def log_message(self, format, *args):
        logging.info(format % args)

    def do_OPTIONS(self):
        """Handle CORS preflight — this is the KEY for Private Network Access."""
        self.send_response(200)
        self._send_cors()
        self.send_header('Content-Length', '0')
        self.end_headers()
        logging.info(f"[PREFLIGHT] {self.path} from {self.headers.get('Origin', 'unknown')}")

    def _send_cors(self):
        origin = self.headers.get('Origin', '*')
        self.send_header('Access-Control-Allow-Origin', origin if origin != 'null' else '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Access-Control-Allow-Private-Network', 'true')
        self.send_header('Access-Control-Expose-Headers', '*')
        self.send_header('Access-Control-Max-Age', '86400')

    def _send_json(self, code, data):
        body = json.dumps(data).encode('utf-8')
        self.send_response(code)
        self._send_cors()
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        # Proxy health check — responds even if bridge is down
        if self.path == '/proxy-health':
            self._send_json(200, {"proxy": "ok", "port": PROXY_PORT, "target": TARGET_URL})
            logging.info("[PROXY-HEALTH] Responded OK")
            return
        self._proxy('GET')

    def do_POST(self):
        self._proxy('POST')

    def _proxy(self, method):
        url = f"{TARGET_URL}{self.path}"

        body = None
        cl = self.headers.get('Content-Length')
        if cl:
            body = self.rfile.read(int(cl))

        skip = {'host', 'origin', 'referer', 'access-control-request-method',
                'access-control-request-headers', 'access-control-request-private-network'}
        headers = {k: v for k, v in self.headers.items() if k.lower() not in skip}

        req = urllib.request.Request(url, data=body, headers=headers, method=method)

        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                resp_body = resp.read()
                self.send_response(resp.status)

                skip_resp = {'access-control-allow-origin', 'access-control-allow-methods',
                             'access-control-allow-headers', 'access-control-allow-private-network',
                             'transfer-encoding', 'content-length', 'connection'}
                for k, v in resp.headers.items():
                    if k.lower() not in skip_resp:
                        self.send_header(k, v)

                self._send_cors()
                self.send_header('Content-Length', str(len(resp_body)))
                self.end_headers()
                self.wfile.write(resp_body)
                logging.info(f"[PROXY] {method} {self.path} -> {resp.status}")

        except urllib.error.HTTPError as e:
            err_body = e.read()
            self.send_response(e.code)
            self._send_cors()
            self.send_header('Content-Length', str(len(err_body)))
            self.end_headers()
            self.wfile.write(err_body)
            logging.error(f"[PROXY] {self.path} -> HTTP {e.code}")

        except urllib.error.URLError:
            self._send_json(503, {"error": "Bridge offline", "target": TARGET_URL})
            logging.warning(f"[PROXY] Bridge unreachable at {TARGET_URL}")

        except Exception as e:
            self._send_json(500, {"error": str(e)})
            logging.error(f"[PROXY] Error: {e}")


class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


def run_proxy():
    try:
        server = ThreadedTCPServer(("0.0.0.0", PROXY_PORT), ProxyHTTPRequestHandler)
        print("=" * 55)
        print("  EMMI CORS Proxy — RUNNING")
        print("=" * 55)
        print(f"  Listening on:   http://0.0.0.0:{PROXY_PORT}")
        print(f"  Also reachable: http://127.0.0.1:{PROXY_PORT}")
        print(f"  Also reachable: http://localhost:{PROXY_PORT}")
        print(f"  Forwarding to:  {TARGET_URL}")
        print(f"  Status:         READY")
        print("=" * 55)
        print("  Keep this window open while using EMMI IDE.")
        print("  Press Ctrl+C to stop.")
        print("=" * 55)
        sys.stdout.flush()

        server.serve_forever()
    except KeyboardInterrupt:
        print("\nProxy stopped.")
    except OSError as e:
        if "Address already in use" in str(e) or "10048" in str(e):
            print(f"ERROR: Port {PROXY_PORT} already in use. Proxy may already be running.")
        else:
            print(f"ERROR: {e}")
        input("Press Enter to exit...")


if __name__ == "__main__":
    run_proxy()
