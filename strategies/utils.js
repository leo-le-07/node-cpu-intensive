function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;

    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

function heavyComputation(limit = 1000000) {
    let primes = [];
    for (let i = 2; i <= limit; i++) {
        if (isPrime(i)) {
            primes.push(i);
        }
    }
    return {
        count: primes.length,
        lastPrimes: primes.slice(-10), // Return only the last 10 primes for display
        maxChecked: limit
    };
}

module.exports = { heavyComputation }; 