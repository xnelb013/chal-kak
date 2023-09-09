// HomePage.tsx
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import {
  uploadedImageFilesState,
  uploadedImageUrlsState,
  locationState,
  alertState,
  imageInfoState,
  imageIdsState,
  deleteImageIdsState,
} from "../../utils/atoms";
import ImageUpload from "./ImageUpload";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import KeywordCheckbox from "./KeywordCheckbox";
import KeywordRadioButton from "./KeywordRadioButton";
import GoogleMapsComponent from "./GoogleMap";
import Divider from "../components/Divider";
import { AiOutlineClose } from "react-icons/ai";
import useInitialData from "@/hooks/customHooks";
import { apiInstance } from "../api/api";
import InfoAlert from "../components/InfoAlert";
import Cookies from "js-cookie";
import router, { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";

interface StyleTag {
  id: number;
  category: string;
  keywordImg: string;
  keyword: string;
}

interface postingData {
  content: string;
  styleKeywords: string[];
  dynamicKeywords: string[];
  seasonKeywords: string[];
  weatherKeywords: string[];
  uploadedImageFiles: File[];
  uploadedImageUrls: string[];
  privacyHeight: boolean;
  privacyWeight: boolean;
  staticKeywords: string[];
  location: string;
  styleTags: number[];
}

interface PostPhoto {
  id: number;
  order: number;
  name: string;
  url: string;
}

export interface editData {
  content: string;
  styleTags: string[];
  hashTags: string[];
  seasonTags: string[];
  weatherTags: string[];
  uploadedImageFiles: File[];
  uploadedImageUrls: string[];
  privacyHeight: boolean;
  privacyWeight: boolean;
  staticKeywords: string[];
  location: string;
  postPhotos: PostPhoto[];
}

interface HomePageProps {
  initialPostData?: editData;
}

const accessToken = Cookies.get("accessToken");

const HomePage = ({ initialPostData }: HomePageProps) => {
  const resetUploadedImageFiles = useResetRecoilState(uploadedImageFilesState);
  const resetUploadedImageUrls = useResetRecoilState(uploadedImageUrlsState);
  const resetDeleteImageIds = useResetRecoilState(deleteImageIdsState);
  const [styleTagsData, setStyleTagsData] = useState<StyleTag[]>([]);
  const [styleTags, setStyleTags] = useState<number[]>([]);
  // blob
  const [uploadedImageUrls] = useRecoilState(uploadedImageUrlsState);
  // file
  const [uploadedImageFiles] = useRecoilState(uploadedImageFilesState);
  //locaiton
  const [location, setLocation] = useRecoilState(locationState);
  const [staticKeywords, setStaticKeywords] = useState<string[]>([]);
  const [styleKeywords, setStyleKeywords] = useState<string[]>([]);
  const [dynamicKeywords, setDynamicKeywords] = useState<string[]>([]);
  const [seasonKeywords, setSeasonKeywords] = useState<string[]>([]);
  const [weatherKeywords, setWeatherKeywords] = useState<string[]>([]);
  const [content, setContent] = useState<string>("");
  const [privacyHeight, setPrivacyHeight] = useState(false);
  const [privacyWeight, setPrivacyWeight] = useState(false);
  const [dynamicKeywordInput, setDynamicKeywordInput] = useState<string>("");
  const [allStaticKeywords, setAllStaticKeywords] = useState<string[]>([]);
  const [imageInfo, setImageInfo] = useRecoilState(imageInfoState);
  const [imageIds, setImageIds] = useRecoilState(imageIdsState);
  const [deleteImageIds] = useRecoilState(deleteImageIdsState);
  const setAlert = useSetRecoilState(alertState);
  const [formData, setFormData] = useState<postingData>({
    content: "",
    dynamicKeywords: dynamicKeywords,
    styleTags: styleTags,
    styleKeywords: styleKeywords,
    uploadedImageFiles: uploadedImageFiles,
    seasonKeywords: seasonKeywords,
    weatherKeywords: weatherKeywords,
    uploadedImageUrls: uploadedImageUrls,
    privacyHeight: privacyHeight,
    privacyWeight: privacyWeight,
    staticKeywords: staticKeywords,
    location: location,
  });

  const userouter = useRouter();

  useEffect(() => {
    if (!accessToken) {
      alert("로그인이 필요합니다");
      router.push("/main");
    }
  }, []);

  useInitialData(initialPostData?.location, setLocation);
  // useInitialData(initialPostData?.styleTags, setStyleTags);
  // useInitialData(initialPostData?.styleTags, setStyleTags);
  useInitialData(initialPostData?.content, setContent);
  useInitialData(initialPostData?.privacyHeight, setPrivacyHeight);
  useInitialData(initialPostData?.privacyWeight, setPrivacyWeight);
  useInitialData(initialPostData?.hashTags, setDynamicKeywords);
  useInitialData(initialPostData?.styleTags, setStyleKeywords);
  useInitialData(initialPostData?.seasonTags, setSeasonKeywords);
  useInitialData(initialPostData?.weatherTags, setWeatherKeywords);

  useEffect(() => {
    setImageInfo(initialPostData?.postPhotos.map((photo) => ({ id: photo.id, url: photo.url })) || []);
  }, [initialPostData]);

  useEffect(() => {
    const ids = imageInfo.map((info) => info.id);
    setImageIds(ids);
  }, [imageInfo]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      content,
      uploadedImageFiles,
      styleKeywords,
      dynamicKeywords,
      weatherKeywords,
      seasonKeywords,
      uploadedImageUrls,
      privacyHeight,
      privacyWeight,
      staticKeywords,
      location,
    }));
  }, [
    content,
    uploadedImageFiles,
    styleKeywords,
    dynamicKeywords,
    weatherKeywords,
    seasonKeywords,
    uploadedImageUrls,
    privacyHeight,
    privacyWeight,
    staticKeywords,
    location,
  ]);

  // 키워드 불러오기
  useEffect(() => {
    apiInstance
      .get("styleTags")
      .then((response) => {
        setStyleTagsData(response.data.data.styleTags);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const keywordArray = response.data.data.styleTags.map((tag: any) => tag.keyword);
        setAllStaticKeywords(keywordArray);
      })
      .catch((error) => {
        alert("There was an error!" + error);
      });
  }, []);

  const keywordList = styleTagsData.reduce(
    (acc: { [key: string]: string[] }, item) => {
      const category = item.category.toLowerCase();

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(item.keyword);

      return acc;
    },
    { style: [], tpo: [], season: [], weather: [] },
  );

  useEffect(() => {
    const newStyleTags = styleTagsData.filter((data) => staticKeywords.includes(data.keyword)).map((data) => data.id);

    setStyleTags(newStyleTags);
  }, [styleTagsData, staticKeywords]);

  // 정적 키워드들을 한곳에 담기
  useEffect(() => {
    setStaticKeywords([...styleKeywords, ...seasonKeywords, ...weatherKeywords]);
  }, [styleKeywords, seasonKeywords, weatherKeywords]);

  // 체형 공개 여부
  const handlePublicCheck = () => {
    setPrivacyHeight(true);
    setPrivacyWeight(true);
  };

  const handlePrivateCheck = () => {
    setPrivacyHeight(false);
    setPrivacyWeight(false);
  };

  const handleDynamicKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDynamicKeywordInput(e.target.value);
  };

  const handleDynamicKeywordSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (dynamicKeywordInput.trim() === "") return;
      // 중복 키워드 확인
      if (dynamicKeywords.includes(dynamicKeywordInput.trim()) || staticKeywords.includes(dynamicKeywordInput.trim())) {
        alert("이미 있는 키워드입니다!"); // 이미 있는 키워드일 경우 alert 표시
      } else if (allStaticKeywords.includes(dynamicKeywordInput.trim())) {
        alert("해당 키워드는 버튼을 눌러주세요!"); // keywords에 존재하는 경우 alert 표시
      } else {
        setDynamicKeywords([...dynamicKeywords, dynamicKeywordInput.trim()]);
        setDynamicKeywordInput("");
      }
    }
  };

  // 스타일, tpo 태그 클릭시 이벤트
  const onKeywordCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    const isChecked = e.target.checked;

    const _keywords = [...styleKeywords];

    if (isChecked) {
      _keywords.push(keyword);
    } else {
      _keywords.splice(_keywords.indexOf(keyword), 1);
    }
    setStyleKeywords(_keywords);
  };

  // 게절 체인지
  const onSeasonKeywordRadioButtonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setSeasonKeywords([keyword]);
    } else {
      setSeasonKeywords(seasonKeywords.filter((seasonKeyword) => seasonKeyword !== keyword));
    }
  };

  // 날씨 체인지
  const onWeatherKeywordRadioButtonChange = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setWeatherKeywords([keyword]);
    } else {
      setWeatherKeywords(weatherKeywords.filter((weatherKeyword) => weatherKeyword !== keyword));
    }
  };

  // 스타일키워드 나열
  const styleKeywordCheckboxes = keywordList.style.map((keyword) => (
    <KeywordCheckbox
      key={keyword}
      keyword={keyword}
      isChecked={styleKeywords.includes(keyword)}
      onChange={onKeywordCheckboxChange}
    />
  ));
  // tpo키워드 나열
  const tpoKeywordCheckboxes = keywordList.tpo.map((keyword) => (
    <KeywordCheckbox
      key={keyword}
      keyword={keyword}
      isChecked={styleKeywords.includes(keyword)}
      onChange={onKeywordCheckboxChange}
    />
  ));

  // 계절 키워드 나열
  const seasonKeywordCheckboxes = keywordList.season.map((keyword) => (
    <KeywordRadioButton
      key={keyword}
      name={"season"}
      keyword={keyword}
      isChecked={seasonKeywords.includes(keyword)}
      onChange={onSeasonKeywordRadioButtonChange}
    />
  ));

  // 날씨 키워드
  const weatherKeywordCheckboxes = keywordList.weather.map((keyword) => (
    <KeywordRadioButton
      key={keyword}
      name={"weather"}
      keyword={keyword}
      isChecked={weatherKeywords.includes(keyword)}
      onChange={onWeatherKeywordRadioButtonChange}
    />
  ));

  const renderButton = (isActive: boolean) => {
    return isActive ? (
      <button type="button" onClick={handleSubmit} className="btn-neutral w-[600px] p-3 rounded-full text-sm my-10">
        작성
      </button>
    ) : (
      <button
        type="button"
        disabled
        className="btn w-[600px] p-3 rounded-full text-sm my-10 bg-gray-200 cursor-not-allowed"
      >
        작성
      </button>
    );
  };

  // 내용 입력 창 체인지
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // 동적 입력 태그 삭제

  const removeDynamicKeyword = (removeItem: string) => {
    setDynamicKeywords(dynamicKeywords.filter((dynamicKeyword) => dynamicKeyword !== removeItem));
  };

  // submit 함수
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const submissionFormData = new FormData();
    uploadedImageFiles.forEach((file) => {
      submissionFormData.append("multipartFileList", file);
    });

    let request;

    if (userouter.query.id) {
      request = {
        content: content,
        location: location,
        privacyHeight: privacyHeight,
        privacyWeight: privacyWeight,
        styleTags: styleTags,
        hashTags: dynamicKeywords,
        deletedImageIds: deleteImageIds,
      };
    } else {
      request = {
        content: content,
        location: location,
        privacyHeight: privacyHeight,
        privacyWeight: privacyWeight,
        styleTags: styleTags,
        hashTags: dynamicKeywords,
      };
    }

    const blob = new Blob([JSON.stringify(request)], { type: "application/json" });
    submissionFormData.append("request", blob);

    try {
      if (router.query.id) {
        // postId가 있으면 PATCH 요청으로 게시글 수정
        const response = await apiInstance.patch(`posts/${router.query.id}`, submissionFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setAlert({ open: true, message: "게시물 수정이 완료되었습니다!" });

        router.push(`/posts/${response.data.data.postId}`);
      } else {
        // postId가 없으면 POST 요청으로 게시글 생성
        const response = await apiInstance.post(`posts`, submissionFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setAlert({ open: true, message: "게시물 업로드가 완료되었습니다!" });
        router.push(`/posts/${response.data.data.postId}`);
      }
      // recoil 상태 초기화
      resetUploadedImageFiles();
      resetUploadedImageUrls();
      setLocation("");
      resetDeleteImageIds();
      setImageInfo([]);
    } catch (error) {
      alert("There was an error!" + error);
    }

    console.log(formData);
  };

  return (
    <div className="w-[600px] m-auto">
      <div>
        <GoogleMapsComponent />
      </div>
      <Divider width="w-[600px]" />
      <div className="mb-5">
        <ImageUpload />
      </div>
      <textarea
        placeholder="내용 입력"
        className="textarea textarea-bordered focus:outline-none leading-tight textarea-sm resize-none w-full max-w-2xl py-2 my-5 h-[70px]"
        value={content}
        onChange={handleContentChange}
      ></textarea>
      <div className="mb-4">
        <h2 className="mr-3 mb-3 font-medium">체형 공개</h2>
        <div className="flex items-center">
          <label className="flex items-center">
            <div>공개</div>
            <input
              type="checkbox"
              checked={privacyHeight}
              onChange={handlePublicCheck}
              className="checkbox checkbox-xs mr-5 ml-1 mt-[1.5px]"
            />
          </label>
          <label className="flex items-center">
            <div>비공개</div>
            <input
              type="checkbox"
              checked={!privacyHeight}
              onChange={handlePrivateCheck}
              className="checkbox checkbox-xs ml-1 mt-[1.5px]"
            />
          </label>
        </div>
      </div>
      <Divider width="w-[600px]" />
      <div className="mb-5">
        {dynamicKeywords.map((keyword) => (
          <div key={keyword} className="inline-block">
            <div className="flex m-1 text-blue-400">
              #{keyword}
              <AiOutlineClose
                className="flex items-center text-gray-300 cursor-pointer text-xs mt-[3px]"
                onClick={() => removeDynamicKeyword(keyword)}
              />
            </div>
          </div>
        ))}
        {styleKeywords.map((keyword) => (
          <div key={keyword} className="inline-block m-1">
            #{keyword}
          </div>
        ))}
        {seasonKeywords.map((keyword) => (
          <div key={keyword} className="inline-block m-1">
            #{keyword}
          </div>
        ))}
        {weatherKeywords.map((keyword) => (
          <div key={keyword} className="inline-block m-1">
            #{keyword}
          </div>
        ))}
      </div>
      <div>
        <h2 className="mb-2 font-medium">Tag</h2>
        <input
          type="text"
          className="border-b border-gray-200 focus:border-gray-700 transition-colors ease-in duration-100 w-[600px] mb-7 py-2"
          placeholder="키워드를 입력하세요"
          value={dynamicKeywordInput}
          onChange={handleDynamicKeywordChange}
          onKeyUp={handleDynamicKeywordSubmit}
        />
        <input type="text" className="hidden" />
      </div>
      <div className="w-[600px] mb-5">
        <h2 className="mb-2 font-medium">Style</h2>
        <div className="w-[600px] mb-5">
          <div className="flex">{styleKeywordCheckboxes}</div>
          <div className="flex">{tpoKeywordCheckboxes}</div>
        </div>
      </div>
      <div className="mb-5">
        <h2 className="mb-2 font-medium">Season*</h2>
        <div className="flex ">{seasonKeywordCheckboxes}</div>
      </div>
      <div>
        <h2 className="mb-2 font-medium">Weather*</h2>
        <div className="flex ">{weatherKeywordCheckboxes}</div>
      </div>
      {userouter.query.id
        ? renderButton(
            (imageIds.length > 0 || uploadedImageUrls.length > 0) &&
              seasonKeywords.length > 0 &&
              weatherKeywords.length > 0,
          )
        : renderButton(uploadedImageUrls.length > 0 && seasonKeywords.length > 0 && weatherKeywords.length > 0)}
      <InfoAlert />
    </div>
  );
};

export default HomePage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const postId = context.params?.postId ?? null;
  return {
    props: { postId },
  };
}
