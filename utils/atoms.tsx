import { atom } from "recoil";
import Cookies from "js-cookie";

// file
export const uploadedImageFilesState = atom<File[]>({
  key: "uploadedImageFilesState",
  default: [],
});

// blob url
export const uploadedImageUrlsState = atom<string[]>({
  key: "uploadedImageUrlsState",
  default: [],
});

// location
export const locationState = atom<string>({
  key: "locationState",
  default: "",
});

// season, weather keywords
export const seasonState = atom({
  key: "seasonState",
  default: "",
});

export const weatherState = atom({
  key: "weatherState",
  default: "",
});

export const userState = atom({
  key: "userState",
  default: {
    email: "",
    nickname: "",
    postCount: 0,
    followers: [],
    followings: [],
    gender: "",
    height: 180,
    weight: 70,
    styleTags: [] as number[],
    isLoggedIn: !!Cookies.get("accessToken"), // 초기 isLoggedIn 값은 쿠키에 'accessToken'이 있는지 여부로 결정
  },
});

export const emailState = atom({
  key: "emailState",
  default: "",
});

export const postState = atom({
  key: "postState",
  default: {
    userPosts: [],
  },
});

// accessToken State
export const accessTokenState = atom({
  key: "accessTokenState",
  default: "",
});

// refreshToken State
export const refreshTokenState = atom({
  key: "refreshTokenState",
  default: "",
});

export const totalComments = atom({
  key: "totalComments",
  default: 0,
});

export const alertState = atom({
  key: "alertState",
  default: { open: false, message: "" },
});

// userDetail State
export const userDetailState = atom({
  key: "userDetailState",
  default: {
    posts: 0,
    followerCount: 0,
    followingCount: 0,
  },
});

// styleTags State
export const styleTagsState = atom({
  key: "styleTags",
  default: [
    {
      id: 1,
      category: "",
      keywordImg: "",
      keyword: "",
    },
  ],
});
