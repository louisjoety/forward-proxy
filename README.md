
# Node.js Forward Proxy

A simple forward proxy server built with Node.js that allows users to send HTTP and HTTPS requests through it.

## Installation

1. Ensure you have Node.js (version 14 or higher) installed on your machine.
2. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/nodejs-forward-proxy.git
   cd nodejs-forward-proxy
   ```
3. Run the proxy server:

   ```bash
   node proxy.js
   ```

## Usage

### HTTP Requests
To use the proxy server for HTTP requests, you can run the following command in your terminal:

```bash
curl -x http://localhost:3456 http://example.com
```

### Note on Proxying
- Ensure that your local firewall allows connections on port 3456.
- You may need to run the command with elevated privileges if you encounter permission issues.

## Assumptions
- The proxy server is expected to be run locally and accessed via localhost.
- The proxy assumes well-formed HTTP/HTTPS requests from clients.

## Constraints
- The implementation does not include advanced error handling, logging, or security features like request validation.
- As this is a simple implementation, it does not support authentication or session management.

## Basis for Implementation
The proxy is implemented using native Node.js modules (http, https, net, and url) to fulfill the requirements without using external libraries. The approach allows direct manipulation of HTTP requests and responses, which provides the flexibility needed for the specified functionality.
