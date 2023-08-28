// HomePage.tsx
import { useRecoilState } from "recoil";
import axios from "axios";
import { uploadedImageFilesState, uploadedImageUrlsState, locationState } from "../../utils/atoms";
import ImageUpload from "./ImageUpload";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import KeywordCheckbox from "./KeywordCheckbox";
import KeywordRadioButton from "./KeywordRadioButton";
import GoogleMapsComponent from "./GoogleMap";
import Divider from "../components/Divider";

const keywordList = {
  style: ["아메카지", "원마일웨어", "미니멀", "댄디", "비즈니스", "캐주얼", "빈티지", "스트릿", "스포티"],
  tpo: ["데이트", "하객", "여행", "출근"],
  season: ["봄", "여름", "가을", "겨울"],
  weather: ["맑음", "흐림", "비", "눈"],
};

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
}

const HomePage = () => {
  // blob
  const [uploadedImageUrls] = useRecoilState(uploadedImageUrlsState);
  // file
  const [uploadedImageFiles] = useRecoilState(uploadedImageFilesState);
  //locaiton
  const [location] = useRecoilState(locationState);
  const [staticKeywords, setStaticKeywords] = useState<string[]>([]);
  const [styleKeywords, setStyleKeywords] = useState<string[]>([]);
  const [dynamicKeywords, setDynamicKeywords] = useState<string[]>([]);
  const [seasonKeywords, setSeasonKeywords] = useState<string[]>([]);
  const [weatherKeywords, setWeatherKeywords] = useState<string[]>([]);
  const [content, setContent] = useState<string>("");
  const [privacyHeight, setPrivacyHeight] = useState(false);
  const [privacyWeight, setPrivacyWeight] = useState(false);
  const [dynamicKeywordInput, setDynamicKeywordInput] = useState<string>("");
  const [formData, setFormData] = useState<postingData>({
    content: "",
    dynamicKeywords: dynamicKeywords,
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

  // 현재 "봄"이라는 동적메소드가 추가될 수 있는 문제가 발생
  const handleDynamicKeywordSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (dynamicKeywordInput.trim() === "") return;
      // 중복 키워드 확인
      if (dynamicKeywords.includes(dynamicKeywordInput.trim()) || staticKeywords.includes(dynamicKeywordInput.trim())) {
        alert("이미 있는 키워드입니다!"); // 이미 있는 키워드일 경우 alert 표시
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

  // 내용 입력 창 체인지
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // submit 함수
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const submissionFormData = new FormData();

    uploadedImageFiles.forEach((file, index) => {
      submissionFormData.append(`image-${index}`, file);
    });

    submissionFormData.append("content", content);
    submissionFormData.append("styleKeywords", styleKeywords.join(","));
    submissionFormData.append("dynamicKeywords", dynamicKeywords.join(","));
    submissionFormData.append("seasonKeyword", seasonKeywords.join(","));
    submissionFormData.append("weatherKeyword", weatherKeywords.join(","));

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      await axios.post("/api", submissionFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error(error);
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
              className="checkbox checkbox-xs mr-5 ml-1 mt-[1px]"
            />
          </label>
          <label className="flex items-center">
            <div>비공개</div>
            <input
              type="checkbox"
              checked={!privacyHeight}
              onChange={handlePrivateCheck}
              className="checkbox checkbox-xs ml-1 mt-[1px]"
            />
          </label>
        </div>
      </div>
      <Divider width="w-[600px]" />
      <div className="mb-5">
        {dynamicKeywords.map((keyword) => (
          <div key={keyword} className="inline-block m-1 text-blue-400 ">
            #{keyword}
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
      {uploadedImageFiles.length > 0 && seasonKeywords.length > 0 && weatherKeywords.length > 0 ? (
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
      )}
    </div>
  );
};

export default HomePage;
