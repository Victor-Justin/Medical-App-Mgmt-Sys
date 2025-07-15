import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,        // 1 virtual user for smoke test
    iterations: 1, // 1 iteration for quick health check
};

export default function () {
    const url = 'http://localhost:6969/users';

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.get(url, params);

    check(res, {
        'status is 200': (r) => r.status === 200
    });

    sleep(1);
}