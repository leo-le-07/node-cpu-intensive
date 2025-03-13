const { heavyComputation } = require('./utils');

process.on('message', (msg) => {
    if (msg.type === 'start') {
        const result = heavyComputation(msg.limit);
        process.send(result);
    }
}); 