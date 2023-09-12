import { styled } from "styled-components";
import { ChangeEvent, FormEventHandler, useCallback, useEffect, useState } from "react";
import { apiInstance } from "../api/api";
import debounce from "lodash.debounce";
import { styleTagsState, userState, userinfoState } from "@/utils/atoms";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { AiOutlineClose } from "react-icons/ai";
import Cookies from "js-cookie";
import { UserinfoType } from "./[userId]";

interface ChangeUserinfoModalProps {
  formData: FormData;
  setFormData: (formData: FormData) => void;
  isOpen: boolean;
  handleCloseModal: () => void;
  setUserInfo: (userInfo: UserinfoType) => void;
  userinfo: UserinfoType;
  userNickname: string;
  profileFile: File | undefined;
  myKeywords: { id: number; keyword: string; category: string; keywordImg: string }[];
}

const ChangeUserinfoModal = ({ isOpen, handleCloseModal, formData, userNickname }: ChangeUserinfoModalProps) => {
  const [userinfoProfile, setUserinfoPropfile] = useRecoilState(userinfoState);
  const setCurUser = useSetRecoilState(userState);
  const [profileImg, setProfileImg] = useState<File>();
  const [invalidNickname, setInvalidNickname] = useState(false);
  const [nicknameTouched, setNicknameTouched] = useState<boolean>(false);
  const keywordTagList = useRecoilValue(styleTagsState);
  const styleTagList = keywordTagList.filter((obj) => obj.category === "STYLE");
  const tpoTagList = keywordTagList.filter((obj) => obj.category === "TPO");
  const [previewImg, setPreviewImg] = useState<string | undefined>(undefined);
  const [isNicknameValid, setIsNicknameValid] = useState<boolean>(false);
  const [isHeightValid, setIsHeightValid] = useState<boolean>(false);
  const [isWeightValid, setIsWeightValid] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const checkNicknameFormat = (nickname: string): boolean => {
    const nicknamePattern = /(^[a-zA-Z0-9_]{4,16}$)|(^[가-힣0-9_]{2,8}$)/;
    return nicknamePattern.test(nickname);
  };

  const checkHeightFormat = (height: string): boolean => {
    const heightRegex = /^(?:[5-9][0-9]|1[0-9]{2}|2[0-4][0-9]|250)$/;
    return heightRegex.test(height);
  };

  const checkWeightFormat = (weight: string): boolean => {
    const weightRegex = /^(?:[2-9][0-9]|1[0-9]{2}|200)$/;
    return weightRegex.test(weight);
  };

  useEffect(() => {
    // userinfoProfile 이 null 이거나 undefined 이면, 초기화
    if (userinfoProfile.height === null || userinfoProfile.weight === null) {
      setUserinfoPropfile({
        nickname: "",
        gender: "",
        userId: 0,
        height: "",
        weight: "",
        styleTags: [],
      });
    }

    setIsNicknameValid(checkNicknameFormat(userinfoProfile?.nickname));
    setIsHeightValid(checkHeightFormat(userinfoProfile?.height?.toString()));
    setIsWeightValid(checkWeightFormat(userinfoProfile?.weight?.toString()));
  }, [userinfoProfile?.nickname, userinfoProfile?.height, userinfoProfile?.weight]);

  useEffect(() => {
    setIsFormValid(isNicknameValid && isHeightValid && isWeightValid);
  }, [isNicknameValid, isHeightValid, isWeightValid]);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    if (isNicknameValid === false) {
      return;
    }
    const blob = new Blob([JSON.stringify(userinfoProfile)], { type: "application/json" });
    formData.append("infoRequest", blob);

    try {
      const response = await apiInstance({
        method: "patch",
        url: `/users/${userinfoProfile.userId}/modify`,

        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        data: formData,
      });

      if (response.status === 200) {
        setCurUser((prev) => {
          return {
            ...prev,
            profileImg: userinfoProfile.profileImg as string,
          };
        });
      }
      handleCloseModal();
      alert("수정되었습니다.");
    } catch (error) {
      console.log("fail");
    }
  };

  useEffect(() => {
    if (profileImg) {
      setProfileImg(profileImg);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImg(reader.result as string);
      };
      reader.readAsDataURL(profileImg);
    } else {
      if (userinfoProfile.profileImg) {
        setPreviewImg(userinfoProfile.profileImg);
      }
    }
    return () => {
      setPreviewImg(undefined);
    };
  }, [profileImg, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "gender") {
      setUserinfoPropfile({ ...userinfoProfile, gender: value });
    } else if (name === "height" || name === "weight") {
      setUserinfoPropfile({ ...userinfoProfile, [name]: Number(value) });
    } else if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/jpg") {
        alert("jpg, png파일만 업로드 가능합니다");
        e.target.value = "";
        return;
      } else {
        console.log("file", file);
        setProfileImg(file);
        formData.set("multipartFiles", file as File);
      }
    } else {
      setUserinfoPropfile({ ...userinfoProfile, [name]: value });
    }
  };

  const maxCheckedCount = 5;
  const [checkedKeyword, setCheckedKeyword] = useState<number[]>(userinfoProfile.styleTags);
  console.log("checkedKeyword", checkedKeyword);
  const handleKeywordCheckedChange = (keywordId: number) => {
    if (checkedKeyword.includes(keywordId)) {
      setCheckedKeyword(checkedKeyword.filter((id) => id !== keywordId));
      setUserinfoPropfile({ ...userinfoProfile, styleTags: checkedKeyword.filter((id) => id !== keywordId) });
    } else if (checkedKeyword.length < maxCheckedCount) {
      setCheckedKeyword([...checkedKeyword, keywordId]);
      setUserinfoPropfile({ ...userinfoProfile, styleTags: [...checkedKeyword, keywordId] });
    }
  };

  const isKeywordChecked = (keywordId: number) => {
    return checkedKeyword.includes(keywordId);
  };

  const validateNickname = useCallback(
    debounce(async (value: string) => {
      if (userNickname === value || value === "") {
        // 현재 닉네임
        setInvalidNickname(false);
      } else {
        const response = await apiInstance.get(`/users/validate/nickname/${value}`);
        if (response.data.data.isDuplicated === false) {
          // 중복되지 않은 닉네임
          setInvalidNickname(false);
        } else if (response.data.data.isDuplicated === true) {
          // 중복된 닉네임
          setInvalidNickname(true);
        }
      }
    }, 600),
    [userNickname],
  );

  useEffect(() => {
    if (nicknameTouched && validateNickname(userinfoProfile.nickname)) {
      validateNickname(userinfoProfile.nickname);
    }
  }, [nicknameTouched, userinfoProfile.nickname]);

  return (
    <>
      {isOpen && (
        <ModalWrapper>
          <div className="mt-[30px] mx-4 w-[550px]">
            <button className="absolute left-[33rem] top-[3.2rem]" onClick={handleCloseModal}>
              <AiOutlineClose size={24} />
            </button>
            <form>
              <div>
                <div>
                  {previewImg && (
                    <img src={previewImg} alt="프로필 미리보기" style={{ width: "100px", height: "100px" }} />
                  )}
                </div>
                <label htmlFor="profileImg" className="block pt-2 pb-2 text-md font-medium leading-6 text-gray-800">
                  프로필 이미지 변경
                </label>
                <div>
                  <input
                    type="file"
                    id="profileImg"
                    name="profileImg"
                    onChange={(e) => {
                      const input = e.target as HTMLInputElement;
                      console.log(input.files![0]);
                      handleChange(e);
                    }}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="nickname" className="block pt-2 pb-2 text-md font-medium leading-6 text-gray-800">
                  닉네임
                </label>
                <div>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    onChange={(e) => {
                      handleChange(e);
                      setNicknameTouched(true);
                    }}
                    placeholder={userNickname}
                    autoComplete="off"
                    // className="mt-1 pt-2 pb-2 block w-full border-b border-gray-200 focus:border-gray-700 focus:outline-none py-2 text-sm transition-colors ease-in duration-100"
                    className={`mt-1 pt-2 pb-2 block w-full border-b border-gray-200 focus:border-gray-700 focus:outline-none py-2 text-sm transition-colors ease-in duration-100 ${
                      !isNicknameValid ? "border-red" : ""
                    }`}
                  />
                </div>
                {!isNicknameValid && (
                  <p className="text-red-500 text-xs pr-1 mt-[4px]">닉네임 형식이 올바르지 않습니다.</p>
                )}
                {invalidNickname && <p className="text-red-500 text-xs pr-1 mt-1">이미 사용중입니다.</p>}
              </div>
              <div>
                <label htmlFor="gender" className="block pt-2 pb-2 text-md font-medium leading-6 text-gray-800">
                  성별
                </label>
                <div>
                  <label htmlFor="male">남성</label>
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="MALE"
                    onChange={(e) => handleChange(e)}
                    checked={userinfoProfile.gender === "MALE"}
                    className="mt-1 mx-2 pt-2 pb-2 border-b border-gray-200 focus:border-gray-700 focus:outline-none py-2 text-sm transition-colors ease-in duration-100"
                  />
                  <label htmlFor="female">여성</label>
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="FEMALE"
                    onChange={(e) => handleChange(e)}
                    checked={userinfoProfile.gender === "FEMALE"}
                    className="mt-1 mx-2 pt-2 pb-2 border-b border-gray-200 focus:border-gray-700 focus:outline-none py-2 text-sm transition-colors ease-in duration-100"
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <div>
                  <label htmlFor="height" className="block pt-2 pb-2 text-md font-medium leading-6 text-gray-800">
                    키
                  </label>
                  <div>
                    <input
                      type="text"
                      id="height"
                      name="height"
                      onChange={(e) => handleChange(e)}
                      placeholder={userinfoProfile.height}
                      autoComplete="off"
                      inputMode="numeric"
                      className="mt-1 pt-2 pb-2 block w-full border-b border-gray-200 focus:border-gray-700 focus:outline-none py-2 text-sm transition-colors ease-in duration-100"
                    />
                  </div>
                  {!isHeightValid && <p className="text-red-500 text-xs pr-1 mt-1">키를 확인하세요.</p>}
                </div>
                <div>
                  <label htmlFor="height" className="block pt-2 pb-2 text-md font-medium leading-6 text-gray-800">
                    몸무게
                  </label>
                  <div>
                    <input
                      type="text"
                      id="weight"
                      name="weight"
                      onChange={(e) => handleChange(e)}
                      placeholder={userinfoProfile.weight}
                      autoComplete="off"
                      inputMode="numeric"
                      className="mt-1 pt-2 pb-2 block w-full border-b border-gray-200 focus:border-gray-700 focus:outline-none py-2 text-sm transition-colors ease-in duration-100"
                    />
                  </div>
                  {!isWeightValid && <p className="text-red-500 text-xs pr-1 mt-1">몸무게를 확인하세요.</p>}
                </div>
              </div>
              <div>
                <label className="block pt-2 pb-2 text-md font-medium leading-6 text-gray-800">관심 키워드</label>
                <p className="text-gray-500 text-xs pr-1 mt-1">최대 다섯개까지 선택 가능합니다.</p>
                <p className="block pt-2 pb-2 text-sm font-medium leading-6 text-gray-800">STYLE</p>
                {styleTagList.map((keyword) => {
                  const isSelected = isKeywordChecked(keyword.id);
                  return (
                    <label
                      key={keyword.id}
                      className={`badge text-xs badge-outline mr-2 mb-2 h-7 ${
                        isSelected ? "text-blue-700 font-medium" : ""
                      }`}
                    >
                      {keyword.keyword}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleKeywordCheckedChange(keyword.id)}
                        className="hidden"
                      />
                    </label>
                  );
                })}
                <p className="block pt-2 pb-2 text-sm font-medium leading-6 text-gray-800">TPO</p>
                {tpoTagList.map((keyword) => {
                  const isSelected = isKeywordChecked(keyword.id);
                  return (
                    <label
                      key={keyword.id}
                      className={`badge text-xs badge-outline mr-2 mb-2 h-7 ${
                        isSelected ? "text-blue-700 font-medium" : ""
                      }`}
                    >
                      {keyword.keyword}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleKeywordCheckedChange(keyword.id)}
                        className="hidden"
                      />
                    </label>
                  );
                })}
              </div>
              <div className="flex justify-center items-center">
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className={`btn btn-sm ml-4 bg-[#efefef] w-[5rem] font-medium rounded-lg text-black ${
                    !isFormValid ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  수정
                </button>
              </div>
            </form>
          </div>
        </ModalWrapper>
      )}
    </>
  );
};

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  position: fixed;
  width: 600px;
  min-width: 600px;
  max-height: 90vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -40%);
  z-index: 1000;
  background-color: white;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
`;

export default ChangeUserinfoModal;
