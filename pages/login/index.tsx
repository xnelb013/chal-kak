import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
import Link from "next/link";
import Alert from "../components/Alert";
import Cookies from "js-cookie";
import { apiInstance } from "../api/api";
import { useRecoilState, useSetRecoilState } from "recoil";
import { accessTokenState, userState } from "@/utils/atoms";

// 이메일과 비밀번호를 포함한 객체
interface LoginData {
  email: string;
  password: string;
}

interface SigninResponse {
  data: {
    success?: boolean;
    message?: string;
    data: {
      userInfo: {
        gender: string;
        height: number;
        weight: number;
        nickname: string;
        styleTags: number[];
        userId: number;
        profileImg: string;
      };
      token: {
        readonly grantType: string;
        readonly accessToken: string;
        readonly refreshToken: string;
        readonly accessTokenExpireDate: number;
      };
    };
  };
}
//
export type UserType = {
  email: string;
  nickname: string;
  profileImg: string;
  postCount: number;
  followers: number;
  followings: number;
  gender: string;
  height: number[];
  weight: number[];
  styleTags: number[];
  isLoggedIn: boolean;
};

export default function Login() {
  const router = useRouter();
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [alertOepn, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const setAcToken = useSetRecoilState(accessTokenState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [loggedInUser, setLoggedInUser] = useRecoilState(userState);

  useEffect(() => {
    console.log(loggedInUser);
  }, [loggedInUser]);

  // 로그인 성공 시, accessToken을 recoil에 저장
  const onLoginSuccess = (response: SigninResponse) => {
    const { accessToken, refreshToken } = response.data.data.token;
    const { styleTags, profileImg, height, weight } = response.data.data.userInfo;

    // 쿠키에 로그인 정보 저장
    Cookies.set("userId", String(response.data.data.userInfo.userId));
    Cookies.set("accessToken", accessToken);
    Cookies.set("refreshToken", refreshToken);
    Cookies.set("profileImg", profileImg);
    Cookies.set("myKeywords", JSON.stringify(styleTags));
    Cookies.set("isLoggedIn", "true");
    // accessToken, refreshToken recoil에 저장
    setAcToken(accessToken);

    // 로그인 성공 시 userState 업데이트
    setLoggedInUser((prevUser: UserType) => ({
      ...prevUser,
      isLoggedIn: true,
      styleTags: styleTags,
      height: height,
      weight: weight,
      profileImg: profileImg,
    }));
    router.push("/main");
  };

  // 로그인 API 호출
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;
    try {
      const tokenResponse = await apiInstance.post("users/signin", {
        email,
        password,
      });
      onLoginSuccess(tokenResponse);
      setFormData({ email: "", password: "" });
    } catch (error) {
      console.log("err", error);
      setAlertMessage("이메일 또는 비밀번호를 확인해주세요.");
      setAlertOpen(true);
    }
  };

  // 구글 로그인 API 호출
  const handleGoogleLogin = () => {
    window.location.href = "https://www.chla-kak-back.store/oauth2/authorization/google";
  };

  // 이메일 양식 확인
  const checkEmailFormat = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleChangeValid = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      if (checkEmailFormat(value)) {
        setInvalidEmail(false);
      } else {
        setInvalidEmail(true);
      }
    }
  };

  // 이메일 및 비밀번호 입력 여부 확인
  function isLoginFormValid() {
    return checkEmailFormat(formData.email) && formData.password.length > 0;
  }

  // 버튼 활성화 결정
  function getButtonActive() {
    return isLoginFormValid()
      ? "btn-neutral bg-[rgb(43,52,64)] w-full py-3 font-medium rounded-full text-md"
      : "btn w-full py-3 font-medium rounded-full bg-gray-200 text-md";
  }

  return (
    <>
      <Alert open={alertOepn} setOpen={setAlertOpen} message={alertMessage} />
      <div className="w-full flex flex-col items-center justify-center bg-white">
        <div className="p-6">
          <h2 className="text-2xl font-medium mt-3 pl-3 text-center leading-9 text-gray-800">로그인</h2>
        </div>
        <div className="mt-[60px] mx-4 w-full h-[600px] md:px-24">
          <form>
            <div>
              <label htmlFor="email" className="block pt-2 pb-2 text-md font-medium leading-6 text-gray-800">
                이메일 주소
              </label>
              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => {
                    handleChangeValid(e);
                    handleChange(e);
                  }}
                  placeholder="zero@zerobase.com"
                  autoComplete="off"
                  className="mt-1 pt-2 pb-2 block w-full border-b border-gray-200 focus:border-gray-700 focus:outline-none py-2 text-sm transition-colors ease-in duration-100"
                />
                {invalidEmail && <p className="text-red-500 text-xs mt-1">이메일 양식이 잘못되었습니다.</p>}
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mt-[40px] pt-2 pb-2 text-md font-medium leading-6 text-gray-800"
              >
                비밀번호
              </label>
              <div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => handleChange(e)}
                  className="mt-1 pt-2 pb-2 block w-full border-b border-gray-200 focus:border-gray-700 focus:outline-none py-2 text-sm transition-colors ease-in duration-100"
                />
              </div>
            </div>
            <div className="mt-[60px]">
              <button type="submit" onClick={handleLogin} disabled={!isLoginFormValid()} className={getButtonActive()}>
                로그인
              </button>
            </div>
          </form>
          <ul className="flex justify-evenly items-center mt-[40px] ml-[10px]">
            <li className="list-none">
              <Link href={"/signup"} className="text-center text-sm text-gray-700">
                회원가입
              </Link>
            </li>
            <li className="list-none">
              <span className="text-gray-200 text-xs mx-1">|</span>
            </li>
            <li className="list-none">
              <Link href={"/signup"} className="text-center text-sm pl-[10px] text-gray-700">
                아이디 찾기
              </Link>
            </li>
            <li className="list-none">
              <span className="text-gray-200 text-xs mx-1">|</span>
            </li>
            <li className="list-none">
              <Link href={"/signup"} className="text-center text-sm text-gray-700">
                비밀번호 찾기
              </Link>
            </li>
          </ul>
          <div className="mt-[80px] flex items-center">
            <hr className="flex-grow border-t border-gray-100 mr-[20px]" />
            <p className="text-gray-700 text-xs pr-[24px]">Or sign in with</p>
            <hr className="flex-grow border-t border-gray-100" />
          </div>
          <div className="w-full flex justify-center">
            <div
              className="mt-6 md:mt-12 background-white border rounded-full w-[70px] h-[70px] flex items-center justify-center cursor-pointer"
              onClick={handleGoogleLogin}
            >
              <FcGoogle className="w-[34px] h-[34px]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
