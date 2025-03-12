import http from 'k6/http'
import { check } from 'k6'

// You don't need to change anything in this section, it's k6 glue code.
// See the default function at the end of the file for defining your smoketest.
// This configuration only executes 1 test, enough for a smoketest. The smoketest will fail on any check failing.
const allChecksNeedToPassTreshold = { checks: [{ threshold: 'rate==1', abortOnFail: true }] }
export const options = {
  vus: 1,
  iterations: 1,
  thresholds: allChecksNeedToPassTreshold,
}

// Define your smoketest(s) here.
export default () => {
  const response = http.get(`${__ENV.BASE_URL}`)
  check(response, {
    'is status 200': (r) => r.status === 200,
  })
  check(JSON.parse(response.body), {
    // there can be multiple tests here, e.g.
    //"contains topics object": (r) => typeof r.data.topics != null,
    'returns {ok:true}': (r) => r.ok == true,
  })
}
