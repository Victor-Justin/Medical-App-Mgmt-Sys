import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:6969';

export const options = {
    stages: [
        { duration: '30s', target: 50 },    
        { duration: '30s', target: 100 },   
        { duration: '30s', target: 200 },   
        { duration: '30s', target: 400 },   
        { duration: '30s', target: 800 },   
        { duration: '30s', target: 1600 },  
        { duration: '30s', target: 0 },     
    ],
    ext: {
        loadimpact: {
            name: 'Appointments GET Breakpoint Test',
        },
    },
};

export default function () {
    const res = http.get(`${BASE_URL}/appointments`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'has data array': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return Array.isArray(body.data);
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}