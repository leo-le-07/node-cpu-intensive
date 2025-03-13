const cluster = require('cluster');
const os = require('os');
const url = require('url');
const { heavyComputation } = require('./utils');

function setupCluster(server, port) {
    if (cluster.isMaster) {
        const numCPUs = os.cpus().length;
        console.log(`Master process ${process.pid} is running`);
        console.log(`Forking for ${numCPUs} CPUs`);

        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died. Restarting...`);
            cluster.fork();
        });
    } else {
        server.on('request', (req, res) => {
            if (req.url.startsWith('/compute')) {
                const queryParams = url.parse(req.url, true).query;
                const limit = parseInt(queryParams.n) || 1000000;

                console.log(`Starting prime number computation up to ${limit}...`);
                const startTime = process.hrtime.bigint();
                
                const result = heavyComputation(limit);
                
                const endTime = process.hrtime.bigint();
                const duration = Number(endTime - startTime) / 1e9;
                
                console.log(`Computation completed in ${duration.toFixed(2)} seconds`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    ...result,
                    duration: `${duration.toFixed(2)} seconds`,
                    worker: process.pid
                }));
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`Hello from Worker ${process.pid}\n`);
            }
        });

        server.listen(port, () => {
            console.log(`Worker ${process.pid} started (Cluster Mode)`);
        });
    }
}

module.exports = { setupCluster }; 