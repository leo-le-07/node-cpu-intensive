const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { heavyComputation } = require('./utils');
const url = require('url');

function setupWorkerThread(server, port) {
    if (!isMainThread) {
        const result = heavyComputation(workerData.limit);
        parentPort.postMessage(result);
        return;
    }

    server.on('request', (req, res) => {
        if (req.url.startsWith('/compute')) {
            const queryParams = url.parse(req.url, true).query;
            const limit = parseInt(queryParams.n) || 1000000;

            console.log(`Starting prime number computation up to ${limit} in worker thread...`);
            const startTime = process.hrtime.bigint();

            const worker = new Worker(__filename, {
                workerData: { limit }
            });

            worker.on('message', (result) => {
                const endTime = process.hrtime.bigint();
                const duration = Number(endTime - startTime) / 1e9;
                
                console.log(`Computation completed in ${duration.toFixed(2)} seconds`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    ...result,
                    duration: `${duration.toFixed(2)} seconds`
                }));
            });

            worker.on('error', (error) => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            });
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Hello World\n');
        }
    });

    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/ (Worker Threads Mode)`);
    });
}

module.exports = { setupWorkerThread }; 