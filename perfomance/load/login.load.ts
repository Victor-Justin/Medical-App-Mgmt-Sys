import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:6969';

export const options = {
  stages: [
    { duration: '30s', target: 40 }, 
    { duration: '40s', target: 50 }, 
    { duration: '10s', target: 0 },  
  ],
  ext: {
    loadimpact: {
      name: 'Login POST Load Test',
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

  const res = http.post(`${BASE_URL}/auth/login`, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response contains token': (r) => {
      try {
        const body = JSON.parse(r.body as string);
        return body.token !== undefined && typeof body.token === 'string';
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
