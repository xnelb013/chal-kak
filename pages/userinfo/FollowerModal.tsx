// import { followerListState } from "@/utils/atoms";
import Image from "next/image";
import { useRouter } from "next/router";
import { AiOutlineClose } from "react-icons/ai";
// import { useRecoilValue } from "recoil";
import { styled } from "styled-components";

interface FollowerModalProps {
  initialFollowerData: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    followerResponses: [
      {
        memberId: number;
        nickName: string;
        profileUrl: string | undefined;
      },
    ];
  };
  isOpen: boolean;
  handleCloseModal: () => void;
}

const FollowerModal = ({ initialFollowerData, isOpen, handleCloseModal }: FollowerModalProps) => {
  const router = useRouter();
  const followerResponses = initialFollowerData?.followerResponses;

  return (
    <>
      {isOpen && (
        <ModalWrapper>
          <div className="mt-[30px] mx-4 w-[550px]">
            <button className="absolute left-[33rem] top-[3.2rem]" onClick={handleCloseModal}>
              <AiOutlineClose size={24} />
            </button>
            <div className="flex flex-col h-[600px] w-[500px] gap-4">
              {followerResponses.map((follower) => (
                <>
                  <div
                    className="flex flex-row w-[400px] cursor-pointer"
                    key={follower.memberId}
                    onClick={() => {
                      handleCloseModal();
                      router.push(`/userinfo/${follower.memberId}`);
                    }}
                  >
                    <div className="avatar ml-6">
                      <div className="w-10 rounded-full">
                        {follower.profileUrl && (
                          <Image src={follower.profileUrl} alt="프로필" width={100} height={100} />
                        )}
                        {!follower.profileUrl && (
                          <Image src="/images/defaultImg.jpg" alt="프로필" width={100} height={100} />
                        )}
                      </div>
                    </div>
                    <div className="text-lg font-semibold ml-6 text-black">{follower.nickName}</div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </ModalWrapper>
      )}
    </>
  );
};

export default FollowerModal;

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
