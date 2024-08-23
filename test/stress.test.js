import http from 'k6/http'
import { check, sleep } from 'k6'
import { Counter } from 'k6/metrics'

export const failedRequests = new Counter('failed_requests')

const BASE_URL = 'http://app:8080'

//NOTE: Number of virtual users
let target_vus = 50
target_vus = 200
// target_vus = 1000

// NOTE: replace with your access token
const access_token = ''

export let options = {
  stages: [
    { duration: '30s', target: target_vus },
    {
      duration: '30s',
      target: target_vus,
      thresholds: {
        http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2000ms
        failed_requests: ['count<10'], // Allow fewer than 10 failed requests
      },
    },
    { duration: '20s', target: 0 },
  ],
}

export default function () {
  const response = http.get(`${BASE_URL}/post?page=1&perPage=20&type=hotest`, {
    headers: {
      Accepts: 'application/json',
      authorization: `Bearer ${access_token}`,
    },
  })
  const success = check(response, {
    'GET request is successful': (r) => r.status === 200,
  })

  if (!success) failedRequests.add(1)
  sleep(0.3)
}
