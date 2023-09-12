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
  async (error) => {
    console.error("Response error", error);

    if (error.response && error.response.status === 401) {
      try {
        const refreshToken = Cookies.get("refreshToken");
        const userId = Number(Cookies.get("userId"));
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post("https://www.chla-kak-back.store/users/reissue", { refreshToken, userId });
        const newAccessToken = res.data.data.accessToken;
        const newRefreshToken = res.data.data.refreshToken;

        // Store the new access token.
        Cookies.set("accessToken", newAccessToken);
        Cookies.set("refreshToken", newRefreshToken);
        return apiInstance.request({
          ...error.config,
          headers: { Authorization: `Bearer ${newAccessToken}` },
        });
      } catch (err) {
        cookieNames.forEach((cookieName) => {
          Cookies.remove(cookieName);
        });
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        router.push("/login");
      }
    }

    return Promise.reject(error);
  },
);
