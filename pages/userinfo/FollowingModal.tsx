import { followingListState } from "@/utils/atoms";
import { useRouter } from "next/router";
import { AiOutlineClose } from "react-icons/ai";
import { useRecoilValue } from "recoil";
import { styled } from "styled-components";

interface FollowerModalProps {
  initialFollowingData: {
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

const FollowingModal = ({ initialFollowingData, isOpen, handleCloseModal }: FollowerModalProps) => {
  const router = useRouter();
  console.log("followingList", initialFollowingData);
  const list = useRecoilValue(followingListState);
  console.log("list", list);
  const { followerResponses } = list;
  // console.log("followingResponses", followingResponses);

  return (
    <>
      {isOpen && (
        <ModalWrapper>
          <div className="mt-[30px] mx-4 w-[550px]">
            <button className="absolute left-[33rem] top-[3.2rem]" onClick={handleCloseModal}>
              <AiOutlineClose size={24} />
            </button>
            <div className="flex flex-col h-[600px] w-[500px] gap-4">
              {followerResponses.map((following) => (
                <>
                  <div
                    className="flex flex-row w-[400px] cursor-pointer"
                    key={following.memberId}
                    onClick={() => router.push(`/userinfo/${following.memberId}`)}
                  >
                    <div className="avatar ml-6">
                      <div className="w-10 rounded-full">
                        <img src={following.profileUrl} alt="프로필" />
                      </div>
                    </div>
                    <div className="text-lg font-semibold ml-6 text-black">{following.nickName}</div>
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

export default FollowingModal;

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
