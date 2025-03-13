# CPU-Intensive Tasks in Node.js

This project demonstrates different strategies for handling CPU-intensive tasks in Node.js. While Node.js is primarily designed for I/O-bound operations, there are several approaches to handle CPU-intensive tasks effectively.

## Project Purpose

Node.js's event-driven, non-blocking I/O model makes it excellent for I/O-bound tasks but challenging for CPU-intensive operations. This project showcases various solutions to handle CPU-intensive tasks without blocking the event loop, allowing the application to remain responsive.

## Available Strategies

1. **Promise-based** (Baseline/Demo)
   - Executes computation in the main thread
   - Wraps the heavy computation in a Promise
   - Not recommended for production use with CPU-intensive tasks
   - Included for demonstration purposes only

2. **Child Process**
   - Spawns separate OS processes
   - Full separation of resources
   - Higher memory overhead
   - Good for CPU-intensive tasks that require isolation

3. **Worker Threads**
   - Lightweight threads sharing memory
   - Efficient communication between threads
   - Lower memory overhead than child processes
   - Ideal for CPU-intensive tasks with shared memory needs

4. **Cluster**
   - Creates multiple Node.js processes
   - Automatically load balances between processes
   - Utilizes all CPU cores
   - Best for scaling Node.js applications across CPU cores

## Running the Project with Docker

1. Build the Docker image:
```bash
docker build -t node-cpu-intensive .
```

2. Run the container:

   **Production mode:**
   ```bash
   docker run -p 3000:3000 --rm node-cpu-intensive
   ```
   The `--rm` flag automatically removes the container when it stops.

   **Development mode (with live code changes):**
   ```bash
   docker run -p 3000:3000 --rm \
     -v "$(pwd):/usr/src/app" \
     -v /usr/src/app/node_modules \
     node-cpu-intensive
   ```
   This command:
   - Maps your current directory to the container's working directory
   - Preserves the container's node_modules
   - Enables live code changes without rebuilding
   - Automatically removes the container when stopped

## Testing the Application

The application provides an API endpoint that finds all prime numbers up to a given number.

### API Endpoint
```
GET /compute?n=1000000
```
Parameter:
- `n`: The upper limit for finding prime numbers (default: 1000000)

Response format:
```json
{
    "count": 78498,
    "lastPrimes": [999953, 999959, 999961, 999979, 999983],
    "maxChecked": 1000000,
    "duration": "1.23 seconds"
}
```

### Method 1: Browser Testing
1. Open `http://localhost:3000/compute?n=1000000` in your browser
2. Open another tab with `http://localhost:3000`
3. Observe how different strategies handle the computation:
   - With Promise: The second tab will be unresponsive
   - With other strategies: The second tab remains responsive

### Method 2: Apache Benchmark Testing
Test with different numbers to compare performance:
```bash
# Test with 1 million
ab -n 100 -c 10 "http://localhost:3000/compute?n=1000000"

# Test with 10 million (heavier computation)
ab -n 10 -c 2 "http://localhost:3000/compute?n=10000000"
```

## Switching Between Strategies

Edit `index.js` and change the `CURRENT_STRATEGY` constant:
```javascript
const CURRENT_STRATEGY = STRATEGIES.WORKER_THREADS; // or CLUSTER, PROMISE, CHILD_PROCESS
```

## When to Use What

| Strategy | Best Used When | Pros | Cons |
|----------|---------------|------|------|
| Promise | • Simple computations<br>• Development/testing | • Easy to implement<br>• No setup required | • Blocks event loop<br>• Poor performance |
| Child Process | • Need process isolation<br>• Memory-intensive tasks<br>• Need separate resources | • Full isolation<br>• Clean process separation<br>• Good for security | • Higher memory usage<br>• Slower IPC<br>• More complex setup |
| Worker Threads | • CPU-intensive tasks<br>• Shared memory needed<br>• Fast communication required | • Efficient memory sharing<br>• Fast communication<br>• Lightweight | • Less isolation<br>• Shared memory risks |
| Cluster | • Web server scaling<br>• Multi-core utilization<br>• Load balancing needed | • Automatic load balancing<br>• Easy scaling<br>• Process isolation | • Limited to # of cores<br>• Higher memory usage |

## Performance Considerations

- **Promise Strategy**: Not recommended for production CPU-intensive tasks
- **Child Process**: Best when process isolation is crucial
- **Worker Threads**: Most efficient for pure CPU tasks with shared memory
- **Cluster**: Ideal for scaling web applications across multiple cores

## Project Structure
```
.
├── index.js                # Main application file
├── strategies/
│   ├── utils.js           # Shared utilities
│   ├── promise.js         # Promise implementation
│   ├── childProcess.js    # Child Process implementation
│   ├── workerThreads.js   # Worker Threads implementation
│   ├── cluster.js         # Cluster implementation
│   └── computeWorker.js   # Worker file for child process
└── Dockerfile             # Docker configuration
```

## Contributing

Feel free to submit issues and enhancement requests!
