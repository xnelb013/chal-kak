import Link from "next/link";
// import { CgProfile } from "react-icons/cg";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Image from "next/image";
import { accessTokenState, userState, userinfoState } from "@/utils/atoms";
import { useRecoilState, useResetRecoilState } from "recoil";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
export default function Navbar() {
  const router = useRouter();
  const [, setActoken] = useRecoilState(accessTokenState);
  const [myUserState] = useRecoilState(userState);
  const resetUserInfo = useResetRecoilState(userinfoState);
  const [login, setLogin] = useState(false);
  const [profileImg, setProfileImg] = useState("");
  const [cookies, setCookies] = useState({});
  const cookieNames = ["isLoggedIn", "accessToken", "userId", "myKeywords", "refreshToken", "profileImg"];
  const userId = Cookies.get("userId");
  const handleLogout = async () => {
    try {
      cookieNames.forEach((cookieName) => {
        Cookies.remove(cookieName);
      });
      setActoken("");
      setLogin(false);
      setCookies(parseCookies());
      resetUserInfo();
      router.push("/");
      alert("로그아웃 되었습니다.");
    } catch (error) {
      console.log("fail");
    }
  };

  const isValidSrc = (src: string) => {
    return src && src !== "null" && src !== "undefined";
  };

  useEffect(() => {
    if (myUserState.isLoggedIn) {
      setProfileImg(myUserState.profileImg);
      setLogin(true);
    } else {
      setLogin(false);
    }
  }, [myUserState]);

  useEffect(() => {
    setCookies(parseCookies()); // 쿠키 값 업데이트
  }, []);
  useEffect(() => {
    const cookies = parseCookies();
    const profileImg = cookies.profileImg;
    setProfileImg(profileImg);
    const isLoggedIn = !!cookies.isLoggedIn;
    setLogin(isLoggedIn);
  }, [cookies]);
  return (
    <>
      <div className="h-[50px] navbar bg-base-100">
        <div className="flex-1">
          <Link href={"/"} className="normal-case text-3xl title">
            #찰칵
          </Link>
        </div>
        <div className="flex-none mt-2 justify-end">
          <div className="mb-4 mr-2">
            <Link href={"/search"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1.6em"
                viewBox="0 0 512 512"
                className="mt-[6px] text-base"
              >
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
            </Link>
          </div>
          <div className="dropdown dropdown-end mb-2 text-end">
            <label tabIndex={0} className="avatar cursor-pointer flex justify-end mb-1 ml-1">
              <div className="mt-[2px] rounded-full">
                <Image
                  src={isValidSrc(profileImg) ? profileImg : "/images/defaultImg.jpg"}
                  width={32}
                  height={32}
                  alt="profile-img"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="z-[1] p-2 shadow menu menu-sm mt-2 dropdown-content bg-base-100 rounded-box w-32"
            >
              {login ? (
                <>
                  <li>
                    <a
                      onClick={() => {
                        router.push(`/userinfo/${userId}`);
                      }}
                    >
                      userinfo
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        handleLogout();
                        router.push("/main");
                      }}
                    >
                      Logout
                    </a>
                  </li>
                </>
              ) : (
                <li>
                  <a
                    onClick={() => {
                      router.push("/login");
                    }}
                  >
                    Login
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-start pb-2"></div>
    </>
  );
}
