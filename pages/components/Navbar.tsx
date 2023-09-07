import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { accessTokenState } from "@/utils/atoms";
import { useRecoilState } from "recoil";
export default function Navbar() {
  const router = useRouter();
  const [actoken, setActoken] = useRecoilState(accessTokenState);
  console.log("actoken", actoken);

  const handleLogout = async () => {
    try {
      Cookies.remove("accessToken");
      Cookies.remove("userId");
      setActoken("");
      // router.push("/");
      alert("로그아웃 되었습니다.");
    } catch (error) {
      console.log("fail");
    }
  };
  return (
    <>
      <div className="h-[50px] navbar bg-base-100">
        <div className="flex-1">
          <Link href={"/"} className="ml-6 normal-case text-3xl title">
            #찰칵
          </Link>
        </div>
        <div className="flex-none gap-2 mt-4 mr-2">
          <div className="mb-4 mr-2">
            <Link href={"/search"}>
              <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 512 512">
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
            </Link>
          </div>
          <div className="dropdown dropdown-end mb-2">
            <label tabIndex={0} className="btn-circle avatar cursor-pointer">
              <div className="mt-[6px]">
                <CgProfile className="w-[32px] h-[32px]" />
                {/* <Image src="/images/카카오.jpg" width={200} height={200} alt="profile-img" /> */}
              </div>
            </label>
            <ul
              tabIndex={0}
              className="z-[1] p-2 shadow menu menu-sm mt-2 dropdown-content bg-base-100 rounded-box w-32"
            >
              {actoken !== "" && (
                <>
                  <li>
                    <a
                      onClick={() => {
                        router.push("/userinfo");
                      }}
                    >
                      userinfo
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        handleLogout();
                        router.reload();
                      }}
                    >
                      Logout
                    </a>
                  </li>
                </>
              )}
              {actoken === "" && (
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
