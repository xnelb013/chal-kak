import { ChangeEvent, FormEvent, useState } from "react";

type Gender = "male" | "female";

interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
  gender: Gender;
  height: number;
  weight: number;
}

export default function signup() {
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [invalidWeight, setinvalidWeight] = useState(false);
  const [invalidHeight, setinvalidHeight] = useState(false);

  const [formData, setFormData] = useState<SignUpData>({
    email: "",
    password: "",
    confirmPassword: "",
    gender: "male",
    height: 0,
    weight: 0,
  });

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

  // 키 양식 확인
  const checkHeightFormat = (height: string) => {
    const heightPattern = /^\d{1,3}$/;
    return heightPattern.test(height);
  };

  // 몸무게 양식 확인
  const checkWeightFormat = (weight: string) => {
    const weightPattern = /^\d{1,3}$/;
    return weightPattern.test(weight);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "height" || name === "weight" ? Number(value) : value });
  };

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
      if (checkHeightFormat(value)) {
        setinvalidHeight(false);
      } else {
        setinvalidHeight(true);
      }
    } else if (name === "weight") {
      if (checkWeightFormat(value)) {
        setinvalidWeight(false);
      } else {
        setinvalidWeight(true);
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // 회원가입 API에 formData를 전송하는 로직 구현
    console.log(formData);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-[400px]">
        <div className="flex items-center justify-center mt-20">
          <div className="text-3xl font-bold">회원가입</div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 mt-10">
          <div>
            <p className="text-md font-bold mb-[-10px]">이메일 주소</p> <br />
            <input
              type="email"
              className="border-b border-gray-500 w-[400px] pb-2 text-sm"
              name="email"
              placeholder="예) example@example.com"
              value={formData.email}
              onChange={(e) => {
                handleChange(e);
                handleChangeValid(e);
              }}
            />
            {invalidEmail && <p className="text-red-500 text-xs mt-1">이메일 양식이 잘못되었습니다.</p>}
          </div>
          <div>
            <p className="text-md font-bold mb-[-10px] mt-2">비밀번호</p> <br />
            <input
              type="password"
              className="border-b border-gray-500 w-[400px] pb-2 text-sm"
              name="password"
              placeholder="영문, 숫자, 특수문자 조합 8~16자"
              value={formData.password}
              onChange={(e) => {
                handleChange(e);
                handleChangeValid(e);
              }}
            />
            {invalidPassword && <p className="text-red-500 text-xs mt-1">비밀번호 형식이 맞지 않습니다.</p>}
          </div>
          <div>
            <p className="text-md font-bold mb-[-10px] mt-2">비밀번호 확인</p> <br />
            <input
              type="password"
              className="border-b border-gray-500 w-[400px] pb-2 text-sm mb-2"
              name="confirmPassword"
              placeholder="비밀번호 확인"
              value={formData.confirmPassword}
              onChange={(e) => {
                handleChange(e);
                handleChangeValid(e);
              }}
            />
            {passwordMismatch && <p className="text-red-500 text-xs mt-1">비밀번호가 일치하지 않습니다.</p>}
          </div>
          <div className="flex w-full">
            <div className="w-1/3 ">
              <p className="text-md font-bold ">성별</p> <br />
              <select name="gender" className="text-sm" value={formData.gender} onChange={handleChange}>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>
            <br />
            <div className="flex flex-col items-start w-2/3 mb-10">
              <p className="text-md font-bold mb-[21px]">체형</p>
              <div className="flex w-full">
                <div className="flex items-center w-1/2 mr-5">
                  <input
                    type="text"
                    name="height"
                    className="border-b border-gray-500 w-[100px] mr-1 text-sm"
                    maxLength={3}
                    value={formData.height}
                    onChange={handleChange}
                  />
                  cm
                  {invalidHeight && <p className="text-red-500 text-xs mt-1">숫자만 입력해주세요.</p>}
                </div>
                <div className="flex items-center w-1/2">
                  <input
                    type="text"
                    name="weight"
                    className="border-b border-gray-500 w-[100px] mr-1 text-sm"
                    maxLength={3}
                    value={formData.weight}
                    onChange={handleChange}
                  />
                  kg
                  {invalidWeight && <p className="text-red-500 text-xs mt-1">숫자만 입력해주세요.</p>}
                </div>
              </div>
            </div>
          </div>
          <div>
            <button type="submit" className="btn">
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
