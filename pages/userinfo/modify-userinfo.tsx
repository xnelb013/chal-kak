import React, { useState } from "react";
import { ChangeImageModal } from "./ChangeImageModal";
import { LiaUserCircleSolid } from "react-icons/lia";

export default function modifyuserinfo() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [profileUrl, setProfileUrl] = useState<string>("");
  // const [formData, setFormData] = useState({
  //   profileImageUrl: "",
  //   nickname: "",
  //   gender: "",
  //   height: "",
  //   weight: "",
  // });
  const profileImageUrl = "";
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  console.log(profileUrl);

  const handleOpenModal = () => {
    setIsModalOpen(true);
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
              {profileImageUrl === "" ? (
                <LiaUserCircleSolid className="w-40 h-40" />
              ) : (
                <img src={profileImageUrl} alt="profile-img" />
              )}
            </div>
          </div>
        </div>
        <button className="mb-3 btn bg-[rgb(43,52,64)] font-medium rounded-full" onClick={handleOpenModal}>
          이미지 편집
        </button>
        {isModalOpen && (
          <ChangeImageModal setProfileUrl={setProfileUrl} isOpen={isModalOpen} handleCloseModal={handleCloseModal} />
        )}
      </div>
      {/* 개인정보 표시 부분 박스 (닉네임, 성별, 키, 몸무게) */}
      <div className="flex flex-col mt-[60px] mx-4 w-[700px] items-center">
        <div className="flex flex-row w-[400px] mt-4">
          <label className="w-[200px] block mr-10 text-xl">nickname</label>
          <div className="block text-xl">현재 닉네임</div>
        </div>
        <div className="flex flex-row w-[400px] mt-4">
          <div className="w-[200px] block mr-10 text-xl">gender</div>
          <div className="block text-xl">남성</div>
        </div>
        <div className="flex flex-row w-[400px] mt-4">
          <div className="w-[200px] block mr-10 text-xl">height</div>
          <div className="block text-xl">185</div>
        </div>
        <div className="flex flex-row w-[400px] mt-4">
          <div className="w-[200px] block mr-10 text-xl">weight</div>
          <div className="block text-xl">65</div>
        </div>
      </div>
      {/* 개인정보 변경 버튼 (모달) */}
    </div>
  );
}
