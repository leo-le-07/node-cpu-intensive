const { fork } = require('child_process');
const path = require('path');
const url = require('url');

function setupChildProcess(server, port) {
    server.on('request', (req, res) => {
        if (req.url.startsWith('/compute')) {
            const queryParams = url.parse(req.url, true).query;
            const limit = parseInt(queryParams.n) || 1000000;

            console.log(`Starting prime number computation up to ${limit} in child process...`);
            const startTime = process.hrtime.bigint();

            // Fork a new child process for computation
            const child = fork(path.join(__dirname, 'computeWorker.js'));

            child.on('message', (result) => {
                const endTime = process.hrtime.bigint();
                const duration = Number(endTime - startTime) / 1e9;
                
                console.log(`Computation completed in ${duration.toFixed(2)} seconds`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    ...result,
                    duration: `${duration.toFixed(2)} seconds`,
                    worker: child.pid
                }));
                child.kill();
            });

            child.on('error', (error) => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
                child.kill();
            });

            // Start the computation
            child.send({ type: 'start', limit });
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Hello World\n');
        }
    });

    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/ (Child Process Mode)`);
    });
}

module.exports = { setupChildProcess }; 