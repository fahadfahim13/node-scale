import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {
    stages: [
        // Load test
        { duration: '2m', target: 100 }, // ramp up to 100 users
        { duration: '3m', target: 100 }, // stay at 100 users
        { duration: '2m', target: 0 },   // ramp down to 0 users

        // Stress test
        { duration: '2m', target: 200 }, // ramp up to 200 users
        { duration: '3m', target: 200 }, // stay at 200 users
        { duration: '2m', target: 0 },   // ramp down to 0 users

        // Spike test
        { duration: '1m', target: 300 }, // spike to 300 users
        { duration: '1m', target: 0 },   // ramp down to 0 users
    ],
};

export default function () {
    let res = http.get('http://localhost:8000');
    let result = check(res, {
        'status is 200': (r) => r.status === 200,
    });
    errorRate.add(!result);
    sleep(1);
}