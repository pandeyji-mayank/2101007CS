const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const windowSize = 10;
const testServerUrl = 'http://test-server-url.com';

let windowNumbers = [];
let sumWindowNumbers = 0;
let lastRequestTime = Date.now();

function fetchNumbersFromTestServer() {
    if (Date.now() - lastRequestTime > 500) {
        return axios.get(testServerUrl)
            .then(response => response.data.numbers)
            .catch(error => {
                console.error('Error fetching numbers from test server:', error.message);
                return [];
            });
    }
    return [];
}

app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;

    const numbers = await fetchNumbersFromTestServer();

    if (numbers && Array.isArray(numbers)) {
        let qualifiedNumbers = [];
        if (numberid.includes('p')) {
            qualifiedNumbers = numbers.filter(isPrime);
        }
        if (numberid.includes('f')) {
            qualifiedNumbers = numbers.filter(isFibonacci);
        }
        if (numberid.includes('e')) {
            qualifiedNumbers = numbers.filter(num => num % 2 === 0);
        }
        if (numberid.includes('r')) {
            qualifiedNumbers = numbers.filter(num => !qualifiedNumbers.includes(num));
        }

        qualifiedNumbers = [...new Set(qualifiedNumbers)];

        for (const num of qualifiedNumbers) {
            if (windowNumbers.length >= windowSize) {
                const oldestNum = windowNumbers.shift();
                sumWindowNumbers -= oldestNum;
            }
            windowNumbers.push(num);
            sumWindowNumbers += num;
        }
    }

    const average = windowNumbers.length > 0 ? sumWindowNumbers / windowNumbers.length : 0;

    const response = {
        numbers: numbers,
        windowPrevState: windowNumbers.slice(0, windowNumbers.length - qualifiedNumbers.length),
        windowCurrState: windowNumbers,
        avg: average.toFixed(2)
    };
    res.json(response);
});

function isPrime(num) {
    if (num < 2) {
        return false;
    }
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return true;
}

function isFibonacci(num) {
    return isPerfectSquare(5 * num * num + 4) || isPerfectSquare(5 * num * num - 4);
}

function isPerfectSquare(x) {
    const s = Math.sqrt(x);
    return s * s === x;
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});