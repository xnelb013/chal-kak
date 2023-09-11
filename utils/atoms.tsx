import { atom } from "recoil";
// import Cookies from "js-cookie";
import { followerResType, followingPostsResType, followingResType, userPostsType } from "./type";
import { UserinfoType } from "@/pages/modify-userinfo/[userId]";

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
    profileImg: "",
    postCount: 0,
    followers: [],
    followings: [],
    gender: "",
    height: 0,
    weight: 0,
    styleTags: [] as number[],
    isLoggedIn: false,
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
    nickname: "",
    postsCount: 0,
    followerCount: 0,
    followingCount: 0,
    profileImg: "",
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

// userPosts State
export const userPostsState = atom({
  key: "userPostsState",
  default: {
    authenticated: false,
    currentPage: 0,
    totalPage: 0,
    totalElements: 0,
    posts: [] as userPostsType[],
  },
});

// followerList State
export const followerListState = atom<followerResType>({
  key: "followerListState",
  default: {
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    followerResponses: [{ memberId: 1, nickName: "", profileUrl: "" }],
  },
});

// followingList State
export const followingListState = atom<followingResType>({
  key: "followingListState",
  default: {
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    followerResponses: [{ memberId: 1, nickName: "", profileUrl: "" }],
  },
});

// followingPosts State
export const followingPostsState = atom({
  key: "followingPostsState",
  default: [
    {
      content: "",
      hashTags: [],
      id: 0,
      likeCount: 0,
      liked: false,
      location: "",
      styleTags: [],
      thumbnail: "",
      viewCount: 0,
      writer: {
        id: 0,
        nickname: "",
        profileImg: "",
      },
    } as followingPostsResType,
  ],
});

interface ImageInfo {
  id: number;
  url: string;
}

export const imageInfoState = atom<ImageInfo[]>({
  key: "imageInfo",
  default: [],
});

export const imageIdsState = atom<number[]>({
  key: "imageIds",
  default: [],
});

export const deleteImageIdsState = atom<number[]>({
  key: "deleteImageIds",
  default: [],
});

// userinfoState
export const userinfoState = atom({
  key: "userinfoState",
  default: {
    nickname: "",
    gender: "",
    userId: 0,
    height: "",
    weight: "",
    styleTags: [],
  } as UserinfoType,
});
