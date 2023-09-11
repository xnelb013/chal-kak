import axios from "axios";
import Cookies from "js-cookie";
import router from "next/router";

const cookieNames = ["isLoggedIn", "accessToken", "userId", "myKeywords", "refreshToken", "profileImg"];

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
    if (error.response && error.response.status === 401) {
      cookieNames.forEach((cookieName) => {
        Cookies.remove(cookieName);
      });
      alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
      router.push("/login");
    }
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
