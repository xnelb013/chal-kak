import { ChangeEvent, FormEvent, useState } from "react";
import KeywordModal from "./KeywordModal";

type Gender = "male" | "female";

interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
  gender: Gender;
  height: number;
  weight: number;
  keywords: string[];
}

export default function signup() {
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [invalidHeight, setInvalidHeight] = useState(false);
  const [invalidWeight, setInvalidWeight] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordConfirmTouched, setPasswordConfirmTouched] = useState(false);
  const [heightTouched, setHeightTouched] = useState(false);
  const [weightTouched, setWeightTouched] = useState(false);
  const [formData, setFormData] = useState<SignUpData>({
    email: "",
    password: "",
    confirmPassword: "",
    gender: "male",
    height: 0,
    weight: 0,
    keywords: keywords,
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
    console.log(isModalOpen);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ ...formData, keywords: keywords });
  };

  //키워드 삭제 버튼 클릭 핸들러
  const removeKeyword = (removeItem: string) => {
    setKeywords(keywords.filter((keyword) => keyword !== removeItem));
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

  const checkBodyFormat = (input: string) => {
    const inputPattern = /^\d{1,3}$/;
    return inputPattern.test(input);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 정보 유효성 검사
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
    }
  };

  // 회원가입 버튼
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // 회원가입 API에 formData를 전송하는 로직 구현
    console.log(formData);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-[500px]">
        <div className="flex items-center justify-center mt-20">
          <div className="text-3xl font-bold">회원가입</div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 mt-10">
          <div>
            <p className="text-md font-bold mb-[-10px]">이메일 주소</p> <br />
            <input
              type="text"
              className="border-b border-gray-200 w-[500px] pb-2 text-sm focus:border-gray-700 transition-colors ease-in duration-100"
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
            {invalidEmail && <p className="text-red-500 text-xs mt-1">이메일 양식이 잘못되었습니다.</p>}
          </div>
          <div>
            <p className="text-md font-bold mb-[-10px] mt-2">비밀번호</p> <br />
            <input
              type="password"
              className="border-b border-gray-200 focus:border-gray-700 transition-colors ease-in duration-100 w-[500px] pb-2 text-sm"
              name="password"
              placeholder="영문, 숫자, 특수문자 조합 8~16자"
              value={formData.password}
              onChange={(e) => {
                handleChange(e);
                handleChangeValid(e);
                setPasswordTouched(true);
              }}
            />
            {invalidPassword && <p className="text-red-500 text-xs mt-1">비밀번호 형식이 맞지 않습니다.</p>}
          </div>
          <div>
            <p className="text-md font-bold mb-[-10px] mt-2">비밀번호 확인</p> <br />
            <input
              type="password"
              className="border-b border-gray-200 w-[500px] pb-2 text-sm focus:border-gray-700 transition-colors ease-in duration-100"
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
          <div className="flex w-full">
            <div className="w-1/3 ">
              <p className="text-md font-bold">성별</p>
              <select name="gender" className="text-md h-10 mt-4" value={formData.gender} onChange={handleChange}>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>
            <br />
            <div className="flex flex-col items-start w-2/3 mb-10 ml-24">
              <p className="text-md font-bold mb-[21px]">체형</p>
              <div className="flex w-full">
                <div className="flex flex-col items-start w-1/2 mr-5">
                  <div className="flex items-center">
                    <input
                      type="text"
                      name="height"
                      className="pb-1 border-b border-gray-200 w-[115px] mr-4 text-sm focus:border-gray-700 transition-colors ease-in duration-100"
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
                  {invalidHeight && <p className="text-red-500 text-xs mt-1">체형 정보가 잘못되었습니다.</p>}
                </div>
                <div className="flex flex-col items-center w-1/2">
                  <div className="flex items-center">
                    <input
                      type="text"
                      name="weight"
                      className="pb-1 border-b border-gray-200 w-[115px] mr-4 text-sm focus:border-gray-700 transition-colors ease-in duration-100"
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
                  {invalidWeight && <p className="text-red-500 text-xs pr-1 mt-1">체형 정보가 잘못되었습니다.</p>}
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
              />
            )}
          </div>

          <div>
            {invalidEmail ||
            invalidPassword ||
            passwordMismatch ||
            !emailTouched ||
            !passwordTouched ||
            !passwordConfirmTouched ||
            !heightTouched ||
            !weightTouched ? (
              <button type="submit" className="btn w-[500px] p-4 bg-gray-200 rounded-full text-white">
                회원가입
              </button>
            ) : (
              <button type="submit" className="btn-neutral w-[500px] p-3 rounded-full text-sm">
                회원가입
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
