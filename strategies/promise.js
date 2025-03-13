const url = require('url');
const { heavyComputation } = require('./utils');

function setupPromise(server, port) {
    server.on('request', (req, res) => {
        if (req.url.startsWith('/compute')) {
            const queryParams = url.parse(req.url, true).query;
            const limit = parseInt(queryParams.n) || 1000000;

            console.log(`Starting prime number computation up to ${limit} with Promise...`);
            const startTime = process.hrtime.bigint();

            // Wrap the computation in a Promise to not block the event loop
            new Promise((resolve) => {
                resolve(heavyComputation(limit));
            }).then(result => {
                const endTime = process.hrtime.bigint();
                const duration = Number(endTime - startTime) / 1e9;
                
                console.log(`Computation completed in ${duration.toFixed(2)} seconds`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    ...result,
                    duration: `${duration.toFixed(2)} seconds`
                }));
            }).catch(error => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            });
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Hello World\n');
        }
    });

    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/ (Promise Mode)`);
    });
}

module.exports = { setupPromise }; 