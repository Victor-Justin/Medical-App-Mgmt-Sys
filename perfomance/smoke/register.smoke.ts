import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  iterations: 1,
  duration: '15s',
};

export default function () {
  const url = 'http://localhost:6969/auth/register';

const payload = JSON.stringify({
  fName: 'Victor',
  lName: 'Justin',
  email: `vicjus${Math.floor(Math.random() * 100000)}@gmail.com`,
  password: '12345',
  contactNo: '0712345678',
  role: 'patient',
});


  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 201': (r) => r.status === 201,
    'response contains user id or success message': (r) => {
      try {
        const body = JSON.parse(r.body as string);
        return body.userId !== undefined || body.message !== undefined;
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
