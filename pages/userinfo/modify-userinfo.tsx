import React, { useEffect, useState } from "react";
import { LiaUserCircleSolid } from "react-icons/lia";
import ChangeImageModal from "./ChangeImageModal";
import Cookies from "js-cookie";
import { apiInstance } from "../api/api";
import { useRecoilValue } from "recoil";
import { styleTagsState } from "@/utils/atoms";
import ChangeUserinfoModal from "./ChangeUserinfoModal";
import ChangePWModal from "./ChangePWModal";
import WithdrawalModal from "./WithdrawalModal";

export type UserinfoType = {
  nickname: string;
  gender: string;
  userId: number;
  height: string;
  weight: string;
  styleTags: number[];
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState<boolean>(false);
  const [isChangePWModalOpen, setIsChangePWModalOpen] = useState<boolean>(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState<boolean>(false);
  const [, setProfileUrl] = useState<string>("");
  const [formData, setFormData] = useState(new FormData());
  const [userinfo, setUserinfo] = useState<UserinfoType>({
    nickname: "",
    gender: "",
    userId: 0,
    height: "",
    weight: "",
    styleTags: [],
  });
  const [profileFile, setProfileFile] = useState<File>();
  console.log("profileFile", profileFile);
  const [userNickname, setUserNickname] = useState<string>("");
  const userId = Cookies.get("userId");
  const accessToken = Cookies.get("accessToken");
  const styleTagList = useRecoilValue(styleTagsState);
  const myKeywords = styleTagList.filter((obj) => userinfo.styleTags.includes(obj.id));
  // const formData = new FormData();
  console.log(formData);
  useEffect(() => {
    const userinfoRes = apiInstance.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    userinfoRes.then((res) => {
      setUserinfo(res.data.data);
      setUserNickname(res.data.data.nickname);
    });
  }, []);

  const hasFile = formData.has("multipartFiles");
  console.log(hasFile);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

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
    <div className="w-full flex flex-col items-center justify-center">
      <div className="p-6">
        <h2 className="text-2xl font-medium mt-3 text-center leading-9 text-gray-800">나의 정보</h2>
      </div>
      {/* 이미지 편집 부분 박스 (버튼 -> 모달) */}
      <div className="flex flex-col">
        <div className="flex items-center justify-center">
          <div className="avatar">
            <div className="w-40 rounded-full">
              {/* {!userinfo.profileImageUrl ? (
                <LiaUserCircleSolid className="w-40 h-40" />
              ) : (
                <img src={userinfo.profileImageUrl as string | undefined} alt="profile-img" />
              )} */}
              <LiaUserCircleSolid className="w-40 h-40" />
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div>
            <button
              className="btn btn-sm ml-4 bg-[#efefef] w-[125px] font-medium rounded-lg text-black"
              onClick={handleOpenModal}
            >
              이미지 편집
            </button>
            {isModalOpen && (
              <ChangeImageModal
                setProfileUrl={setProfileUrl}
                isOpen={isModalOpen}
                handleCloseModal={handleCloseModal}
                userinfo={userinfo}
                setUserInfo={setUserinfo}
                formData={formData}
                setFormData={setFormData}
                setProfileFile={setProfileFile}
              />
            )}
          </div>
        </div>
      </div>
      {/* 개인정보 표시 부분 박스 (닉네임, 성별, 키, 몸무게) */}
      <div className="flex flex-col mt-[60px] mx-4 w-[700px] items-center">
        <div className="flex flex-row w-[400px] mt-4">
          <label className="w-[200px] block mr-10 text-xl">nickname</label>
          <div className="block text-xl">{userinfo.nickname}</div>
        </div>
        <div className="flex flex-row w-[400px] mt-4">
          <div className="w-[200px] block mr-10 text-xl">gender</div>
          <div className="block text-xl">{userinfo.gender}</div>
        </div>
        <div className="flex flex-row w-[400px] mt-4">
          <div className="w-[200px] block mr-10 text-xl">height</div>
          <div className="block text-xl">{userinfo.height}</div>
        </div>
        <div className="flex flex-row w-[400px] mt-4">
          <div className="w-[200px] block mr-10 text-xl">weight</div>
          <div className="block text-xl">{userinfo.weight}</div>
        </div>
        <div className="flex flex-row w-[400px] mt-4">
          <div className="w-[200px] block mr-10 text-xl">styletag</div>
          {myKeywords.map((keyword) => {
            return (
              <div className="badge text-xs badge-outline mr-2 mb-2 h-7 w-[5rem]" key={keyword.id}>
                {keyword.keyword}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-row">
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
  );
}
