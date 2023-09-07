export interface IArticle {
  content: string;
  createdAt: Date;
  email: string;
  images: string[];
  dynamicKeywords: string[];
  staticKeywords: string[];
  seasonKeywords: string[];
  weatherKeywords: string[];
}

export type Post = {
  email: string;
  images: { url: string }[];
  seasonKeywords: string[];
  weatherKeywords: string[];
  staticKeywords: string[];
  dynamicKeywords: string[];
  content: string[];
};

export type userInfoType = {
  postCount: number;
  followers: string[];
  following: string[];
  nickname: string;
  profileUrl: string;
};

export type userDetailPropsType = {
  postCount: number | null;
  followers: string[];
  following: string[];
};
