export const baseOptions = {
  // setting `withCredentials: true` is crucial. if set, the GET request that initializes the login flow will be
  // executed in `credentials: 'include'` mode (see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
  // if it was not set, the browser would ignore any cookies returned in the browser response. in this case, the
  // browser would miss CSRF cookies which are required in subsequent requests
  withCredentials: true,
}
