import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {
    scenarios: {
        fixed_requests: {
            executor: 'shared-iterations',
            vus: 2500,              // Number of virtual users
            iterations: 1000000,   // Total number of iterations
            maxDuration: '20m',    // Optional: Test duration limit
          },
    },
};

export default function () {
    let res = http.get('http://localhost:8000/');
    let result = check(res, {
        'status is 200': (r) => r.status === 200,
    });
    errorRate.add(!result);
    sleep(1);
}