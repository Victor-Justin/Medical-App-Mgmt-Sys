import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 20 }, 
    { duration: '10s', target: 200 }, 
    { duration: '20s', target: 200 }, 
    { duration: '10s', target: 20 },   
    { duration: '10s', target: 0 }, 
  ],
  ext: {
    loadimpact: {
      name: 'Spike Test - GET /users',
    },
  },
};

export default function () {
  const res = http.get('http://localhost:6969/users', {
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
