const http = require('http');
const https = require('https');
const net = require('net');
const { URL } = require('url');

// Function to handle HTTP requests and modify response if needed
function handleHttpRequest(clientReq, clientRes) {
    const { method, headers, url } = clientReq;

    const parsedUrl = new URL(url);
    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 80,
        path: parsedUrl.pathname + parsedUrl.search,
        method,
        headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
        let body = '';

        proxyRes.on('data', (chunk) => {
            body += chunk;
        });

        proxyRes.on('end', () => {
            if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html')) {
                if (body.toLowerCase().includes('html')) {
                    body += 'NODEJS';
                }
            }

            // Pass modified response back to the client
            clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
            clientRes.end(body);
        });
    });

    proxyReq.on('error', (err) => {
        console.error('Error on HTTP proxy:', err);
        clientRes.writeHead(500);
        clientRes.end('Error on HTTP proxy');
    });

    clientReq.pipe(proxyReq);
}

// Function to handle HTTPS tunneling (CONNECT method)
function handleHttpsTunneling(req, clientSocket) {
    const { url } = req;
    const [hostname, port] = url.split(':');

    const serverSocket = net.connect(port || 443, hostname, () => {
        clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        clientSocket.pipe(serverSocket);
        serverSocket.pipe(clientSocket);
    });

    serverSocket.on('error', (err) => {
        console.error('Error on HTTPS proxy:', err);
        clientSocket.end();
    });
}

// Create server to handle both HTTP and HTTPS
const server = http.createServer((req, res) => {
    if (req.method === 'CONNECT') {
        // Handle HTTPS requests (tunneling)
        req.socket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        const [hostname, port] = req.url.split(':');
        const srvSocket = net.connect(port || 443, hostname, () => {
            req.socket.pipe(srvSocket);
            srvSocket.pipe(req.socket);
        });
    } else {
        // Handle regular HTTP requests
        handleHttpRequest(req, res);
    }
});

// Handle HTTPS `CONNECT` method for tunneling
server.on('connect', (req, clientSocket) => {
    handleHttpsTunneling(req, clientSocket);
});

// Start server on port 3456
server.listen(3456, () => {
    console.log('Proxy server listening on port 3456');
});
