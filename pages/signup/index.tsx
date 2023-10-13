import { ChangeEvent, FormEvent, useState, useEffect, useCallback } from "react";
import KeywordModal from "./KeywordModal";
import debounce from "lodash.debounce";
import { apiInstance } from "../api/api";
import router from "next/router";
import { BsQuestionCircle } from "react-icons/bs";
import { useSetRecoilState } from "recoil";
import { alertState } from "@/utils/atoms";
import SkeletonSignup from "./SkeletonSignup";
import { Tooltip } from "react-tooltip";
import Head from "next/head";
import "react-tooltip/dist/react-tooltip.css";
type Gender = "MALE" | "FEMALE";

interface StyleTag {
  id: number;
  category: string;
  keywordImg: string;
  keyword: string;
}

interface SignUpData {
  confirmPassword: string;
  email: string;
  password: string;
  gender: Gender;
  height: number;
  weight: number;
  nickname: string;
  styleTags: number[];
}

export default function signup() {
  const setAlert = useSetRecoilState(alertState);
  const [styleTagsData, setStyleTagsData] = useState<StyleTag[]>([]);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [invalidHeight, setInvalidHeight] = useState(false);
  const [invalidWeight, setInvalidWeight] = useState(false);
  const [invalidNickname, setInvalidNickname] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [styleTags, setStyleTags] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [nicknameTouched, setNicknamewordTouched] = useState(false);
  const [passwordConfirmTouched, setPasswordConfirmTouched] = useState(false);
  const [heightTouched, setHeightTouched] = useState(false);
  const [weightTouched, setWeightTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailDuplicated, setEmailDuplicated] = useState(false);
  const [nicknameDuplicated, setNicknameDuplicated] = useState(false);
  const [formData, setFormData] = useState<SignUpData>({
    email: "",
    password: "",
    gender: "MALE",
    height: 0,
    weight: 0,
    nickname: "",
    confirmPassword: "",
    styleTags: styleTags,
  });

  // 닉네임 중복 확인
  const checkNicknameDuplication = useCallback(
    debounce(async (nickname: string) => {
      try {
        const response = await apiInstance.get(`users/validate/nickname/${encodeURIComponent(nickname)}`);
        // 중복 여부에 따른 처리
        if (response.data.data.isDuplicated === true) {
          setNicknameDuplicated(true);
        } else {
          setNicknameDuplicated(false);
        }
      } catch (error) {
        alert("There was an error!" + error);
      }
    }, 600),
    [],
  );

  useEffect(() => {
    apiInstance
      .get("styleTags")
      .then((response) => {
        setStyleTagsData(response.data.data.styleTags);
        setIsLoading(false);
      })
      .catch((error) => {
        alert("There was an error!" + error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (nicknameTouched && checkNicknameFormat(formData.nickname)) {
      checkNicknameDuplication(formData.nickname);
    }
  }, [formData.nickname, nicknameTouched]);

  // 이메일 중복 확인
  const checkEmailDuplication = useCallback(
    debounce(async (email: string) => {
      try {
        const response = await apiInstance.get(`users/validate/email/${email}`);
        // 중복 여부에 따른 처리
        if (response.data.data.isDuplicated === true) {
          setEmailDuplicated(true);
        } else {
          setEmailDuplicated(false);
        }
      } catch (error) {
        alert("There was an error!" + error);
      }
    }, 600),
    [],
  );

  useEffect(() => {
    if (emailTouched && checkEmailFormat(formData.email)) {
      checkEmailDuplication(formData.email);
    }
  }, [formData.email, emailTouched]);

  // 키워드 모달 창 클릭 핸들러
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ ...formData, styleTags: styleTags });
  };

  //키워드별 삭제 버튼 클릭 핸들러
  const removeKeyword = (removeItem: string) => {
    const removeItemId = styleTagsData.find((tag) => tag.keyword === removeItem)?.id;

    setKeywords(keywords.filter((keyword) => keyword !== removeItem));

    if (removeItemId !== undefined) {
      setStyleTags(styleTags.filter((id) => id !== removeItemId));
    }
  };

  // 이메일 양식 확인
  const checkEmailFormat = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  // 비밀번호 양식 확인
  const checkPasswordFormat = (password: string) => {
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])(?=.*\d)[a-zA-Z\d!@#$%^&*]{8,16}$/;
    return passwordPattern.test(password);
  };

  // 체형 양식 확인
  const checkBodyFormat = (input: string) => {
    const inputPattern = /^\d{1,3}$/;
    return inputPattern.test(input);
  };

  // 닉네임 양식 확인
  const checkNicknameFormat = (nickname: string) => {
    const nicknamePattern = /(^[a-zA-Z0-9_]{4,16}$)|(^[가-힣0-9_]{2,8}$)/;
    return nicknamePattern.test(nickname);
  };

  // 데이터 변경 시 formData 작성
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // weight와 height는 숫자로 변환
    const transformedValue = name === "weight" || name === "height" ? Number(value) : value;
    setFormData({ ...formData, [name]: transformedValue });
  };

  // 입력값 정보 유효성 검사
  const handleChangeValid = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      if (checkEmailFormat(value)) {
        setInvalidEmail(false);
      } else {
        setInvalidEmail(true);
      }
    } else if (name === "password") {
      if (checkPasswordFormat(value)) {
        setInvalidPassword(false);
      } else {
        setInvalidPassword(true);
      }
    } else if (name === "confirmPassword") {
      if (value === formData.password) {
        setPasswordMismatch(false);
      } else {
        setPasswordMismatch(true);
      }
    } else if (name === "height") {
      if (checkBodyFormat(value)) {
        setInvalidHeight(false);
      } else {
        setInvalidHeight(true);
      }
    } else if (name === "weight") {
      if (checkBodyFormat(value)) {
        setInvalidWeight(false);
      } else {
        setInvalidWeight(true);
      }
    } else if (name === "nickname") {
      if (checkNicknameFormat(value)) {
        setInvalidNickname(false);
      } else {
        setInvalidNickname(true);
      }
    }
  };

  // 회원가입 버튼
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // 회원가입 API에 formdata 전송
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, password, gender, height, weight, nickname, styleTags } = formData;
    try {
      const response = await apiInstance.post(`users/signup`, {
        email,
        password,
        styleTags,
        gender,
        height,
        weight,
        nickname,
      });
      console.log(response);
      setIsSubmitting(false);
      setAlert({ open: true, message: "회원가입이 성공했습니다! 이메일 인증 후 로그인 해주세요!" });
      router.push("/login");
      //이메일 인증 구현 예정
    } catch (error) {
      alert("There was an error!" + error);
      setIsSubmitting(false);
    }

    console.log(formData);
  };

  return isLoading ? (
    <div>
      <SkeletonSignup />
    </div>
  ) : (
    <>
      <Head>
        <title>#찰칵 - 회원가입 | 회원가입 페이지입니다. </title>
        <meta name="description" content="회원가입 페이지입니다." />
      </Head>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-[500px]">
          <div className="flex items-center justify-center mt-10 w-full">
            <h1 className="text-2xl">회원가입</h1>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 mt-24">
            <div className="w-full">
              <div className="flex items-center mb-3">
                <h2 className="font-bold">이메일 주소</h2>
                <div className="ml-1">
                  <Tooltip id="my-tooltip" className="text-xs" />
                  <span data-tooltip-id="my-tooltip" data-tooltip-content="인증 가능한 이메일을 입력해주세요!">
                    <BsQuestionCircle className="cursor-pointer" />
                  </span>
                </div>
              </div>
              <input
                type="text"
                className="border-b border-gray-200 w-full pb-2 text-sm focus:border-gray-700 transition-colors ease-in duration-100"
                name="email"
                placeholder="예) example@example.com"
                value={formData.email}
                autoComplete="off"
                onChange={(e) => {
                  handleChange(e);
                  handleChangeValid(e);
                  setEmailTouched(true);
                }}
              />
              {invalidEmail && <p className="text-red-500 text-xs mt-1">이메일 양식이 올바르지 않습니다.</p>}
              {emailDuplicated && (
                <p className="text-red-500 text-xs mt-1">이미 사용 중인 이메일입니다. 다른 이메일을 사용해주세요.</p>
              )}
            </div>
            <div className="w-full">
              <h2 className="text-md font-bold mb-[-10px] mt-2">비밀번호</h2> <br />
              <input
                type="password"
                className="border-b border-gray-200 focus:border-gray-700 transition-colors ease-in duration-100 w-full pb-2 text-sm"
                name="password"
                placeholder="영문, 숫자, 특수문자 조합 8~16자"
                value={formData.password}
                onChange={(e) => {
                  handleChange(e);
                  handleChangeValid(e);
                  setPasswordTouched(true);
                }}
              />
              {invalidPassword && <p className="text-red-500 text-xs mt-1">비밀번호 양식이 올바르지 않습니다.</p>}
            </div>
            <div className="w-full">
              <h2 className="text-md font-bold mb-[-10px] mt-2">비밀번호 확인</h2> <br />
              <input
                type="password"
                className="border-b border-gray-200 w-full pb-2 text-sm focus:border-gray-700 transition-colors ease-in duration-100"
                name="confirmPassword"
                placeholder="비밀번호 확인"
                value={formData.confirmPassword}
                onChange={(e) => {
                  handleChange(e);
                  handleChangeValid(e);
                  setPasswordConfirmTouched(true);
                }}
              />
              {passwordMismatch && <p className="text-red-500 text-xs mt-1">비밀번호가 일치하지 않습니다.</p>}
            </div>
            <div className="w-full">
              <h2 className="text-md font-bold mb-[-10px] mt-2">닉네임</h2> <br />
              <input
                type="text"
                className="border-b border-gray-200 w-full pb-2 text-sm focus:border-gray-700 transition-colors ease-in duration-100"
                name="nickname"
                placeholder="영문 4-16자 이내, 한글 2-8자 이내, 초성, 특수문자 및 공백 사용 불가"
                value={formData.nickname}
                onChange={(e) => {
                  handleChange(e);
                  handleChangeValid(e);
                  setNicknamewordTouched(true);
                }}
              />
              {invalidNickname && <p className="text-red-500 text-xs mt-1">닉네임 양식이 올바르지 않습니다</p>}
              {nicknameDuplicated && <p className="text-red-500 text-xs mt-1">중복된 닉네임입니다.</p>}
            </div>
            <div className="flex w-full">
              <div className="w-1/3 ">
                <p className="text-md font-bold">성별</p>
                <select
                  name="gender"
                  className="text-md h-10 mt-4"
                  value={formData.gender}
                  onChange={handleChange}
                  aria-label="gender"
                >
                  <option value="MALE">남성</option>
                  <option value="FEMALE">여성</option>
                </select>
              </div>
              <br />
              <div className="flex flex-col items-start w-2/3 mb-10 ml-24">
                <h2 className="text-md font-bold mb-6">체형</h2>
                <div className="flex w-full">
                  <div className="flex flex-col items-start w-1/2 mr-5">
                    <div className="flex items-center w-full">
                      <input
                        type="text"
                        name="height"
                        aria-label="height"
                        className="pb-1 border-b border-gray-200 w-full mr-4 text-sm focus:border-gray-700 transition-colors ease-in duration-100"
                        maxLength={3}
                        value={formData.height}
                        onChange={(e) => {
                          handleChange(e);
                          handleChangeValid(e);
                          setHeightTouched(true);
                        }}
                      />
                      cm
                    </div>
                    {invalidHeight && <p className="text-red-500 text-xs mt-1">숫자로만 입력해주세요.</p>}
                  </div>
                  <div className="flex flex-col items-center w-1/2">
                    <div className="flex items-center">
                      <input
                        type="text"
                        name="weight"
                        aria-label="weight"
                        className="pb-1 border-b border-gray-200 w-full mr-4 text-sm focus:border-gray-700 transition-colors ease-in duration-100"
                        maxLength={3}
                        value={formData.weight}
                        onChange={(e) => {
                          handleChange(e);
                          handleChangeValid(e);
                          setWeightTouched(true);
                        }}
                      />
                      kg
                    </div>
                    {invalidWeight && <p className="text-red-500 text-xs pr-1 mt-1">숫자로만 입력해주세요.</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full h-[100px]">
              <div className="flex w-1/3 ">
                <div className="flex">
                  <button type="button" className="btn-neutral p-3 rounded-lg mb-10" onClick={handleOpenModal}>
                    관심 키워드
                  </button>
                </div>
              </div>
              <div className="w-2/3">
                {keywords.map((keyword) => (
                  <div className="badge text-xs badge-outline mr-2 mb-2 h-7" key={keyword}>
                    <button onClick={() => removeKeyword(keyword)}>
                      <i className="fa-solid fa-xmark mr-1"></i>
                    </button>
                    {keyword}
                  </div>
                ))}
              </div>
              {isModalOpen && (
                <KeywordModal
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  keywords={keywords}
                  setKeywords={setKeywords}
                  styleTags={styleTags}
                  setStyleTags={setStyleTags}
                  styleTagsData={styleTagsData}
                />
              )}
            </div>

            <div className="w-full flex">
              {invalidEmail ||
              invalidPassword ||
              passwordMismatch ||
              invalidNickname ||
              emailDuplicated ||
              nicknameDuplicated ||
              !nicknameTouched ||
              !nicknameTouched ||
              !emailTouched ||
              !passwordTouched ||
              !passwordConfirmTouched ||
              !heightTouched ||
              !weightTouched ||
              isSubmitting ? (
                <button
                  type="submit"
                  className="btn w-full p-4 bg-gray-200 rounded-full text-white mb-10 justify-center"
                  disabled
                >
                  회원가입
                </button>
              ) : (
                <button type="submit" className="btn-neutral w-full p-3 rounded-full text-sm mb-10 justify-center">
                  회원가입
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
