import debounce from "lodash.debounce";
import { useCallback, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { styled } from "styled-components";
import { apiInstance } from "../api/api";
import Cookies from "js-cookie";

interface ChangePWModalProps {
  isOpen: boolean;
  handleCloseModal: () => void;
}

const ChangePWModal = ({ isOpen, handleCloseModal }: ChangePWModalProps) => {
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false);
  const userId = Cookies.get("userId");
  const accessToken = Cookies.get("accessToken");
  const [curPassword, setCurPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>("");
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

  // 비밀번호 양식 확인
  const checkPasswordFormat = (password: string) => {
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])(?=.*\d)[a-zA-Z\d!@#$%^&*]{8,16}$/;
    return passwordPattern.test(password);
  };

  // 비밀번호 일치 여부 확인
  const checkPasswordMatch = (password: string, passwordConfirm: string) => {
    return password === passwordConfirm;
  };

  // 비밀번호 onChange
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "curPassword") {
      validatePassword(value);
      setCurPassword(value);
    } else if (name === "newPassword") {
      checkPasswordFormat(value);
      setNewPassword(value);
    } else if (name === "newPasswordConfirm") {
      // 비밀번호 일치 여부 확인
      checkPasswordMatch(newPassword, value);
      setNewPasswordConfirm(value);
    }
  };

  // 비밀번호 수정
  const handleModifyPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await apiInstance({
      method: "post",
      url: `/users/modify-password`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        password: newPasswordConfirm,
      },
    });
    handleCloseModal();
    alert("비밀번호가 수정되었습니다.");
  };

  return (
    <>
      {isOpen && (
        <ModalWrapper>
          <div className="mt-[30px] mx-4 w-[550px]">
            <button className="absolute left-[33rem] top-[3.2rem]" onClick={handleCloseModal}>
              <AiOutlineClose size={24} />
            </button>
            <form onSubmit={handleModifyPassword}>
              <div>
                <label className="text-sm font-medium text-gray-700">현재 비밀번호</label>
                <div>
                  <input
                    type="password"
                    id="curPassword"
                    name="curPassword"
                    autoComplete="off"
                    onChange={handlePasswordChange}
                    className="mt-1 pt-2 pb-2 block w-full border-b border-gray-200 focus:border-gray-700 focus:outline-none py-2 text-sm transition-colors ease-in duration-100"
                  />
                </div>
                {invalidPassword && <p className="text-blue-500 text-xs pr-1 mt-1">확인되었습니다.</p>}
                {!invalidPassword && curPassword !== "" && (
                  <p className="text-red-500 text-xs pr-1 mt-1">비밀번호가 일치하지 않습니다.</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">새 비밀번호</label>
                <div>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="영문, 숫자, 특수문자 조합 8~16자"
                    autoComplete="off"
                    onChange={handlePasswordChange}
                    className="mt-1 pt-2 pb-2 block w-full border-b border-gray-200 focus:border-gray-700 focus:outline-none py-2 text-sm transition-colors ease-in duration-100"
                  />
                </div>
                {!checkPasswordFormat(newPassword) && newPassword !== "" && (
                  <p className="text-red-500 text-xs pr-1 mt-1">비밀번호 양식이 맞지 않습니다.</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">새 비밀번호 확인</label>
                <div>
                  <input
                    type="password"
                    id="newPasswordConfirm"
                    name="newPasswordConfirm"
                    autoComplete="off"
                    onChange={handlePasswordChange}
                    className="mt-1 pt-2 pb-2 block w-full border-b border-gray-200 focus:border-gray-700 focus:outline-none py-2 text-sm transition-colors ease-in duration-100"
                  />
                </div>
                {!checkPasswordMatch(newPassword, newPasswordConfirm) && newPasswordConfirm !== "" && (
                  <p className="text-red-500 text-xs pr-1 mt-1">비밀번호가 일치하지 않습니다.</p>
                )}
              </div>
              <div className="flex justify-center items-center">
                <button className="btn btn-sm mt-4 ml-4 bg-[#efefef] w-[5rem] font-medium rounded-lg text-black">
                  수정
                </button>
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

export default ChangePWModal;
