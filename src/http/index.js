import axios from "axios";
const $host = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_URL,
});

const $authHost = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_URL,
});

const authRequestInterceptor = (config) => {
  config.headers.authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
};
$authHost.interceptors.request.use(authRequestInterceptor);
$host.interceptors.request.use(authRequestInterceptor);

const authResponsetInterceptor = (config) => {
  //console.log("authResponsetInterceptor", config);
  return config;
};
async function authResponsetInterceptorError(error) {
  //console.log("Auth-Error", error.response?.data?.message);
  const originalRequest = error.config;
  if (error.response.status == 401 && error.config && !error.config._isRetry) {
    originalRequest._isRetry = true;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}api/auth/refresh`,
        {
          withCredentials: true,
        }
      );
      //console.log("refresh response", response);
      localStorage.setItem("token", response.data.accessToken);

      return $host.request(originalRequest);
    } catch (e) {
      console.error("НЕ АВТОРИЗОВАН");
    }
  }
  throw error;
}

$host.interceptors.response.use(
  authResponsetInterceptor,
  authResponsetInterceptorError
);
$authHost.interceptors.response.use(
  authResponsetInterceptor,
  authResponsetInterceptorError
);

export { $host, $authHost };
