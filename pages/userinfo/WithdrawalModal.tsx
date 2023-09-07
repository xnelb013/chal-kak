import debounce from "lodash.debounce";
import { useCallback, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { styled } from "styled-components";
import { apiInstance } from "../api/api";
import Cookies from "js-cookie";

interface WithdrawalModalProps {
  isOpen: boolean;
  handleCloseModal: () => void;
}

const WithdrawalModal = ({ isOpen, handleCloseModal }: WithdrawalModalProps) => {
  const [curPassword, setCurPassword] = useState<string>("");
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false);
  const userId = Cookies.get("userId");
  const accessToken = Cookies.get("accessToken");

  // 현재 비밀번호 확인
  const validatePassword = useCallback(
    debounce(async (value: string) => {
      if (value === "") {
        setInvalidPassword(false);
      } else {
        const response = await apiInstance({
          method: "post",
          url: `/users/check-password`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {
            userId: userId,
            password: value,
          },
        });
        if (response.data.data.isPasswordMatch) {
          setInvalidPassword(true);
        } else {
          setInvalidPassword(false);
        }
      }
    }, 600),
    [curPassword],
  );

  // 비밀번호 handler
  const handleCurPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "curPassword") {
      setCurPassword(value);
      validatePassword(value);
    }
  };

  // 회원탈퇴
  const handleWithdrawal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await apiInstance({
      method: "delete",
      url: `/users/${userId}/withdraw`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    Cookies.remove("accessToken");
    Cookies.remove("userId");
    window.location.href = "/";
  };

  return (
    <>
      {isOpen && (
        <ModalWrapper>
          <div className="mt-[30px] mx-4 w-[550px]">
            <button className="absolute left-[33rem] top-[3.2rem]" onClick={handleCloseModal}>
              <AiOutlineClose size={24} />
            </button>
            <form onSubmit={handleWithdrawal}>
              <div>
                <label className="text-sm font-medium text-gray-700">현재 비밀번호</label>
                <div>
                  <input
                    type="password"
                    id="curPassword"
                    name="curPassword"
                    autoComplete="off"
                    onChange={handleCurPassword}
                    className="mt-1 pt-2 pb-2 block w-full border-b border-gray-200 focus:border-gray-700 focus:outline-none py-2 text-sm transition-colors ease-in duration-100"
                  />
                </div>
                {invalidPassword && <p className="text-blue-500 text-xs pr-1 mt-1">확인되었습니다.</p>}
                {!invalidPassword && curPassword !== "" && (
                  <p className="text-red-500 text-xs pr-1 mt-1">비밀번호가 일치하지 않습니다.</p>
                )}
              </div>
              <div className="flex flex-row justify-center">
                {invalidPassword && (
                  <div>
                    <button className="btn btn-sm ml-4 bg-[#ff2d2d] w-[125px] font-medium rounded-lg text-white">
                      회원탈퇴
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </ModalWrapper>
      )}
    </>
  );
};

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  position: fixed;
  width: 600px;
  min-width: 600px;
  max-height: 90vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -40%);
  z-index: 1000;
  background-color: white;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
`;

export default WithdrawalModal;
