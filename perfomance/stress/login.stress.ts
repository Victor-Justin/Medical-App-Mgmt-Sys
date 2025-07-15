import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },   
    { duration: '30s', target: 100 }, 
    { duration: '30s', target: 200 },
    { duration: '1m', target: 300 },
    { duration: '30s', target: 0 },
  ],

  ext: {
    loadimpact: {
      name: 'Stress Test - POST /auth/login',
    },
  },
};

export default function () {
  const payload = JSON.stringify({
    email: 'vicjus96@gmail.com',
    password: '12345',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post('http://localhost:6969/auth/login', payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response contains token': (r) => {
      try {
        const body = JSON.parse(r.body as string);
        return typeof body.token === 'string';
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
