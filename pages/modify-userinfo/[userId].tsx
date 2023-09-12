import React, { useEffect, useState } from "react";
import { LiaUserCircleSolid } from "react-icons/lia";
import Cookies from "js-cookie";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { styleTagsState, userState, userinfoState } from "@/utils/atoms";
import ChangeUserinfoModal from "./ChangeUserinfoModal";
import ChangePWModal from "./ChangePWModal";
import WithdrawalModal from "./WithdrawalModal";
import { apiInstance } from "../api/api";

export type UserinfoType = {
  nickname: string;
  gender: string;
  userId: number;
  height: string;
  weight: string;
  styleTags: number[];
  profileImg?: string;
};

export interface ModifiedFormdata {
  multipartFiles: File[];
  infoRequest: {
    nickname: string;
    gender: string;
    height: number;
    weight: number;
    styleTags: number[];
  };
}
export default function modifyuserinfo() {
  const [isModifyModalOpen, setIsModifyModalOpen] = useState<boolean>(false);
  const [isChangePWModalOpen, setIsChangePWModalOpen] = useState<boolean>(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState(new FormData());
  const setCurUser = useSetRecoilState(userState);
  const [userinfoProfile, setUserinfoPropfile] = useRecoilState(userinfoState);
  const [userinfo, setUserinfo] = useState<UserinfoType>({
    nickname: "",
    gender: "",
    userId: 0,
    height: "",
    weight: "",
    styleTags: [],
  });
  const [profileFile] = useState<File>();
  const [userNickname, setUserNickname] = useState<string>("");
  const userId = Cookies.get("userId");
  // const router = useRouter();
  // const id = router.query;
  const accessToken = Cookies.get("accessToken");
  const styleTagList = useRecoilValue(styleTagsState);
  const myKeywords = styleTagList.filter((obj) => userinfoProfile.styleTags.includes(obj.id));

  useEffect(() => {
    // const fetchUserInfo = async () => {
    //   try {
    //     const response = await apiInstance.get(`/users/${userId}`, {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //     });

    //     const data = response.data.data;

    //     setUserinfo(data);
    //     setUserinfoPropfile(data);
    //     setUserNickname(data.nickname);
    //     setCurUser((prev) => ({ ...prev, profileImg: data.profileImg, isLoggedIn: true }));
    //     Cookies.set("profileImg", data.profileImg);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // if (isModifyModalOpen) {
    //   setTimeout(fetchUserInfo, 1500); // API 호출을 비동기 함수 내부로 옮김
    // }
    const userinfoRes = apiInstance.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    userinfoRes.then((res) => {
      setUserinfo(res.data.data);
      setUserinfoPropfile(res.data.data);
      setUserNickname(res.data.data.nickname);
      setCurUser((prev) => ({ ...prev, profileImg: res.data.data.profileImg, isLoggedIn: true }));
      Cookies.set("profileImg", res.data.data.profileImg);
    });
  }, [isModifyModalOpen]);

  // 구글 로그인 후 modify-userinfo로 넘어왔을 때, url 로부터 필요한 정보를 가져와서 설정해주는 함수.
  // https://chal-kak.vercel.app/modify-userinfo/{userId}?accessToken={}&refreshToken={}&profileImg={}
  useEffect(() => {
    const url = window.location.href;
    const urlSplit = url.split("?"); // url을 ? 기준으로 잘라서, api 호출부와 필요한 정보를 분리함.
    console.log(urlSplit);
    const urlParams = urlSplit[1] ? urlSplit[1].split("&") : []; // url을 & 기준으로 잘라서, 필요한 정보를 분리함.
    if (urlParams.length === 0) return;
    const userId = urlSplit[0].split("/")[4]; // url을 / 기준으로 잘라서, userId를 가져옴.
    const accessToken = urlParams[0].split("=")[1]; // url을 = 기준으로 잘라서, accessToken을 가져옴.
    const refreshToken = urlParams[1].split("=")[1]; // url을 = 기준으로 잘라서, refreshToken을 가져옴.
    const profileImg = urlParams[2].split("=")[1]; // url을 = 기준으로 잘라서, profileImg를 가져옴.
    Cookies.set("userId", userId);
    Cookies.set("isLoggedIn", "true");
    Cookies.set("accessToken", accessToken);
    Cookies.set("refreshToken", refreshToken);
    Cookies.set("profileImg", profileImg);
  }, []);

  const handleCloseModifyModal = () => {
    setIsModifyModalOpen(false);
  };

  const handleOpenModifyModal = () => {
    setIsModifyModalOpen(true);
  };

  const handleCloseChangePWModal = () => {
    setIsChangePWModalOpen(false);
  };

  const handleOpenChangePWModal = () => {
    setIsChangePWModalOpen(true);
  };

  const handleCloseWithdrawalModal = () => {
    setIsWithdrawalModalOpen(false);
  };

  const handleOpenWithdrawalModal = () => {
    setIsWithdrawalModalOpen(true);
  };

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="p-6">
          <h2 className="text-2xl font-medium mt-3 text-center leading-9 text-gray-800">나의 정보</h2>
        </div>
        {/* 이미지 편집 부분 박스 (버튼 -> 모달) */}
        <div className="flex flex-col">
          <div className="flex items-center justify-center">
            <div className="avatar">
              <div className="w-40 rounded-full">
                {!userinfoProfile.profileImg ? (
                  <LiaUserCircleSolid className="w-40 h-40" />
                ) : (
                  <img src={userinfoProfile.profileImg as string | undefined} alt="profile-img" />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-[60px] mx-4 w-full justify-center items-center">
          <div className="flex flex-row justify-between items-center w-[70%] mt-4">
            <label className="w-[200px] mr-10 text-xl">nickname</label>
            <div className="text-xl">{userinfoProfile.nickname}</div>
          </div>
          <div className="flex flex-row justify-between w-[70%] mt-4">
            <div className="w-[200px] mr-10 text-xl">gender</div>
            <div className="text-xl">{userinfoProfile.gender}</div>
          </div>
          <div className="flex flex-row justify-between w-[70%] mt-4">
            <div className="w-[200px] mr-10 text-xl">height</div>
            <div className="text-xl">{userinfoProfile.height}</div>
          </div>
          <div className="flex flex-row justify-between w-[70%] mt-4">
            <div className="w-[200px] mr-10 text-xl">weight</div>
            <div className="text-xl">{userinfoProfile.weight}</div>
          </div>
          <div className="flex flex-row justify-between w-[70%] mt-4">
            <div className=" mr-10 text-xl">styletag</div>
            <div className="flex flex-row flex-wrap justify-center w-[70%] gap-y-2">
              {myKeywords.map((keyword) => {
                return (
                  <div className="badge text-xs items-center  badge-outline mr-2 h-6 w-auto " key={keyword.id}>
                    {keyword.keyword}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-row mt-36">
          <div>
            <button
              className="btn btn-sm ml-4 bg-[#efefef] w-[125px] font-medium rounded-lg text-black"
              onClick={handleOpenModifyModal}
            >
              개인정보 수정
            </button>
            {isModifyModalOpen && (
              <ChangeUserinfoModal
                isOpen={isModifyModalOpen}
                handleCloseModal={handleCloseModifyModal}
                userinfo={userinfo}
                setUserInfo={setUserinfo}
                userNickname={userNickname}
                myKeywords={myKeywords}
                formData={formData}
                setFormData={setFormData}
                profileFile={profileFile}
              />
            )}
          </div>
          <div>
            <button
              className="btn btn-sm ml-4 bg-[#efefef] w-[125px] font-medium rounded-lg text-black"
              onClick={handleOpenChangePWModal}
            >
              비밀번호 변경
            </button>
            {isChangePWModalOpen && (
              <ChangePWModal isOpen={isChangePWModalOpen} handleCloseModal={handleCloseChangePWModal} />
            )}
          </div>
          <div>
            <button
              className="btn btn-sm ml-4 bg-[#ec4444] w-[125px] font-medium rounded-lg text-white"
              onClick={handleOpenWithdrawalModal}
            >
              회원탈퇴
            </button>
            {isWithdrawalModalOpen && (
              <WithdrawalModal isOpen={isWithdrawalModalOpen} handleCloseModal={handleCloseWithdrawalModal} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
