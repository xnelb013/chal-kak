import axios from "axios";
import Cookies from "js-cookie";
import router from "next/router";

const cookieNames = ["isLoggedIn", "accessToken", "userId", "myKeywords", "refreshToken", "profileImg"];

export const apiInstance = axios.create({
  baseURL: "https://www.chla-kak-back.store",
});

// 요청 인터셉터
apiInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    // 여기서는 네트워크 오류 등 요청이 서버로 전송되기 전에 발생하는 오류만 처리됩니다.
    console.error("Request error", error);
    return Promise.reject(error);
  },
);

// 응답 인터셉터
apiInstance.interceptors.response.use(
  (response) => {
    // 성공적인 응답을 받았을 때의 처리
    return response;
  },
  (error) => {
    // 서버로부터의 에러 응답(예: 상태 코드가 400 이상인 경우)을 받았을 때의 처리
    console.error("Response error", error);

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
