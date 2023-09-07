import { styled } from "styled-components";
import { UserinfoType } from "./modify-userinfo";
import { ChangeEvent, FormEventHandler, useCallback, useEffect, useState } from "react";
import { apiInstance } from "../api/api";
import debounce from "lodash.debounce";
import { styleTagsState } from "@/utils/atoms";
import { useRecoilValue } from "recoil";
import { AiOutlineClose } from "react-icons/ai";
import Cookies from "js-cookie";

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

const ChangeUserinfoModal = ({
  isOpen,
  handleCloseModal,
  setUserInfo,
  userinfo,
  profileFile,
  formData,
  userNickname,
}: ChangeUserinfoModalProps) => {
  const [invalidNickname, setInvalidNickname] = useState(false);
  const [nicknameTouched, setNicknameTouched] = useState<boolean>(false);
  const keywordTagList = useRecoilValue(styleTagsState);
  const styleTagList = keywordTagList.filter((obj) => obj.category === "STYLE");
  const tpoTagList = keywordTagList.filter((obj) => obj.category === "TPO");
  console.log("profileFile", profileFile);
  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    const blob = new Blob([JSON.stringify(userinfo)], { type: "application/json" });
    formData.append("infoRequest", blob);

    await apiInstance({
      method: "patch",
      url: `/users/${userinfo.userId}/modify`,

      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
      data: formData,
    });
    handleCloseModal();
  };

  useEffect(() => {
    // formData.append("multipartFiles", profileFile as File);
    formData.set("multipartFiles", profileFile as File);
    console.log("formData", formData);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "gender") {
      setUserInfo({ ...userinfo, gender: value });
    } else if (name === "height" || name === "weight") {
      setUserInfo({ ...userinfo, [name]: Number(value) });
    } else {
      setUserInfo({ ...userinfo, [name]: value });
    }
  };

  const maxCheckedCount = 5;
  const [checkedKeyword, setCheckedKeyword] = useState<number[]>(userinfo.styleTags!);
  console.log("checkedKeyword", checkedKeyword);
  const handleKeywordCheckedChange = (keywordId: number) => {
    if (checkedKeyword.includes(keywordId)) {
      setCheckedKeyword(checkedKeyword.filter((id) => id !== keywordId));
      setUserInfo({ ...userinfo, styleTags: checkedKeyword.filter((id) => id !== keywordId) });
    } else if (checkedKeyword.length < maxCheckedCount) {
      setCheckedKeyword([...checkedKeyword, keywordId]);
      setUserInfo({ ...userinfo, styleTags: [...checkedKeyword, keywordId] });
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
    if (nicknameTouched && validateNickname(userinfo.nickname)) {
      validateNickname(userinfo.nickname);
    }
  }, [userinfo.nickname, nicknameTouched]);

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
                    className="mt-1 pt-2 pb-2 block w-full border-b border-gray-200 focus:border-gray-700 focus:outline-none py-2 text-sm transition-colors ease-in duration-100"
                  />
                </div>
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
                    checked={userinfo.gender === "MALE"}
                    className="mt-1 mx-2 pt-2 pb-2 border-b border-gray-200 focus:border-gray-700 focus:outline-none py-2 text-sm transition-colors ease-in duration-100"
                  />
                  <label htmlFor="female">여성</label>
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="FEMALE"
                    onChange={(e) => handleChange(e)}
                    checked={userinfo.gender === "FEMALE"}
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
                      placeholder={userinfo.height}
                      autoComplete="off"
                      inputMode="numeric"
                      className="mt-1 pt-2 pb-2 block w-full border-b border-gray-200 focus:border-gray-700 focus:outline-none py-2 text-sm transition-colors ease-in duration-100"
                    />
                  </div>
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
                      placeholder={userinfo.weight}
                      autoComplete="off"
                      inputMode="numeric"
                      className="mt-1 pt-2 pb-2 block w-full border-b border-gray-200 focus:border-gray-700 focus:outline-none py-2 text-sm transition-colors ease-in duration-100"
                    />
                  </div>
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
                  className="btn btn-sm ml-4 bg-[#efefef] w-[5rem] font-medium rounded-lg text-black"
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
