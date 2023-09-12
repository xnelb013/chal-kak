import React, { useState } from "react";
import { GrClose } from "react-icons/gr";
// import { IoRefreshOutline } from "react-icons/io5";
import { AiOutlineCaretDown } from "react-icons/ai";
import { userState } from "@/utils/atoms";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";
interface BodyShapeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (height: number, weight: number) => void;
}

const BodyShapeModal = ({ isOpen, onClose, onApply }: BodyShapeModalProps) => {
  const [isHeightDropdownOpen, setIsHeightDropdownOpen] = useState(false);
  const [isWeightDropdownOpen, setIsWeightDropdownOpen] = useState(false);
  const [isToggled, setIsToggled] = useState(false);

  const loggedInUser = useRecoilValue(userState);

  const [inputHeight, setInputHeight] = useState<number | null>(null);
  const [inputWeight, setInputWeight] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleToggle = () => {
    if (loggedInUser.isLoggedIn) {
      // 사용자가 로그인한 상태라면
      setIsToggled(!isToggled);
    } else {
      // 사용자가 로그인하지 않았다면
      router.push("/login"); // 로그인 페이지로 리디렉션
    }
  };

  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 backdrop-filter z-[1000]">
      <div className="bg-white p-4 rounded-md w-[450px] h-[350px]">
        <div className="flex items-center justify-between">
          <GrClose className="w-[20px] h-[20px] cursor-pointer" onClick={onClose} />
          {/* <IoRefreshOutline className="w-[24px] h-[24px] cursor-pointer" /> */}
        </div>
        <p className="text-lg font-bold text-center mb-4">키・몸무게</p>
        <form onSubmit={(e) => e.preventDefault()} className="m-3">
          <div
            className="h-[50px] pl-3 text-sm flex items-center border border-gray-200 relative"
            onClick={() => setIsHeightDropdownOpen(!isHeightDropdownOpen)}
          >
            키
            <input
              readOnly
              value={`${inputHeight ? inputHeight : ""}cm`}
              className="cursor-pointer mr-auto pl-4 flex items-center font-semibold outline-none"
            />
            <AiOutlineCaretDown className="mr-4 w-[16px] h-[16px] text-gray-700" />
            {isHeightDropdownOpen && (
              <ul
                className="absolute top-full w-full right-[-1px] z-30 text-center text-sm bg-white border border-gray-200 overflow-auto"
                style={{ width: "394px", maxHeight: "217px", boxSizing: "border-box" }}
              >
                {Array.from({ length: 121 }, (_, i) => i + 100).map((value) => (
                  <li
                    key={value}
                    onClick={() => {
                      setInputHeight(value);
                      setIsHeightDropdownOpen(false);
                    }}
                    className="p-2 cursor-pointer"
                  >
                    {value}cm
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div
            className="h-[50px] mt-2 pl-3 text-sm flex items-center border border-gray-200 relative"
            onClick={() => setIsWeightDropdownOpen(!isWeightDropdownOpen)}
          >
            몸무게
            <input
              readOnly
              value={`${inputWeight ? inputWeight : ""}kg`}
              className="cursor-pointer mr-auto pl-4 flex items-center font-semibold outline-none"
            />
            <AiOutlineCaretDown className="mr-4 w-[16px] h-[16px] text-gray-700" />
            {isWeightDropdownOpen && (
              <ul
                className="absolute top-full w-full right-[-1px] z-30 text-center text-sm bg-white border border-gray-200 overflow-auto"
                style={{ width: "394px", maxHeight: "159px", boxSizing: "border-box" }}
              >
                {Array.from({ length: 121 }, (_, i) => i + 30).map((value) => (
                  <li
                    key={value}
                    onClick={() => {
                      setInputWeight(value);
                      setIsWeightDropdownOpen(false);
                    }}
                    className="p-2 cursor-pointer"
                  >
                    {value}kg
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-2 flex justify-between relative">
            <div onClick={handleToggle}>
              <div
                className={`ml-1 absolute top-1 left-0 inline-flex items-center h-5 rounded-full w-8 cursor-pointer transition-colors duration-200 ease-in-out ${
                  isToggled ? "bg-gray-700" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 inline-block h-[16px] w-[16px] rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    isToggled ? "translate-x-full" : ""
                  }`}
                ></span>
              </div>
              <span className="ml-11 text-sm text-black">마이 사이즈</span>
            </div>
          </div>
          <div className="mt-10 p-4 flex items-center justify-center border bg-gray-900">
            <button
              onClick={() => {
                onApply(inputHeight as number, inputWeight as number); // 적용하기 버튼 클릭 시 height와 weight 값 전달
              }}
              className="text-white text-sm"
            >
              적용하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default BodyShapeModal;
