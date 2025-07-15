import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 20 },  
    { duration: '3m', target: 20 }, 
    { duration: '40s', target: 0 },    
  ],
  
  ext: {
    loadimpact: {
      name: 'Soak Test - GET /users',
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
