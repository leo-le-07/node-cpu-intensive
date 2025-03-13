const http = require('http');
const { setupWorkerThread } = require('./strategies/workerThreads');
const { setupCluster } = require('./strategies/cluster');
const { setupPromise } = require('./strategies/promise');
const { setupChildProcess } = require('./strategies/childProcess');

const port = 3000;

// Available computation strategies
const STRATEGIES = {
    WORKER_THREADS: 'worker_threads',
    CLUSTER: 'cluster',
    PROMISE: 'promise',
    CHILD_PROCESS: 'child_process'
};

// Configure which strategy to use
const CURRENT_STRATEGY = STRATEGIES.WORKER_THREADS;

// Create HTTP server
const server = http.createServer();

// Select and setup the chosen strategy
switch (CURRENT_STRATEGY) {
    case STRATEGIES.PROMISE:
        setupPromise(server, port);
        break;
    case STRATEGIES.CHILD_PROCESS:
        setupChildProcess(server, port);
        break;
    case STRATEGIES.WORKER_THREADS:
        setupWorkerThread(server, port);
        break;
    case STRATEGIES.CLUSTER:
        setupCluster(server, port);
        break;
    default:
        console.error('Invalid strategy selected');
        process.exit(1);
}
