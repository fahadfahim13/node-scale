import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {
    stages: [
        { duration: '10s', target: 0 },   // start from 0 users
        { duration: '30s', target: 100 }, // ramp up to 100 users
        { duration: '30s', target: 500 }, // ramp up to 500 users
        { duration: '30s', target: 1000 }, // ramp up to 1000 users
        { duration: '30s', target: 10000 }, // ramp up to 10000 users
        { duration: '30s', target: 10000 }, // ramp up to 10000 users
        { duration: '30s', target: 100000 }, // ramp up to 100000 users
        { duration: '30s', target: 100000 }, // ramp up to 100000 users
        { duration: '30s', target: 1000000 }, // ramp up to 1000000 users
        { duration: '30s', target: 1000000 }, // ramp up to 1000000 users
        { duration: '30s', target: 10000 }, // ramp down to 10000 users
        { duration: '30s', target: 100 }, // ramp down to 100 users
        { duration: '10s', target: 0 },   // ramp down to 0 users
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