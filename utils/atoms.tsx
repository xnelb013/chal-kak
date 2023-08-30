import { atom } from "recoil";

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
    height: "",
    weight: "",
    keyword: [],
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
