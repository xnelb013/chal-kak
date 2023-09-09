import axios from "axios";
import Cookies from "js-cookie";

export const apiInstance = axios.create({
  baseURL: "https://www.chla-kak-back.store",
});

// 인터셉터 사용
apiInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 토큰 갱신부분
// apiInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   }
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       const refreshToken = Cookies.get("refreshToken");
//       const { data } = await apiInstance({
//         url: "/users/reissue",
//         method: "POST",
//         data: {
//           refreshToken: refreshToken,
//       })
//       Cookies.set("accessToken", data.accessToken);
//       return apiInstance(originalRequest);
//     }
//   }
// )
