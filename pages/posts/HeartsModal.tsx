import pofileImage from "./img/프로필사진.jpg";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import Image from "next/image";
import { AiOutlineClose, AiOutlinePlusCircle } from "react-icons/ai";
import { apiInstance } from "../api/api";
import router from "next/router";
import Cookies from "js-cookie";

interface ModalComponentProps {
  isOpen: boolean;
  closeModal: () => void;
  postId: string | string[] | undefined;
}

interface LikeList {
  followed: boolean;
  memberId: number;
  nickName: string;
  profileUrl: string | null;
}

Modal.setAppElement(".wrap");

const HeartsModal: React.FC<ModalComponentProps> = ({ isOpen, closeModal, postId }) => {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [likeListData, setLikeListData] = useState<LikeList[]>([]);
  const [followStatuses, setFollowStatuses] = useState<Record<string, boolean>>({});

  const userId = Cookies.get("userId");

  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }
  }, [isOpen]);

  // api호출
  const loadLikeList = (page: number) => {
    setIsLoading(true); // loading 시작임
    apiInstance({
      method: "get",
      url: `like/posts/${postId}/liker?page=${page}&size=9&sort=id,desc`,
    })
      .then((response) => {
        setLikeListData((prevLikeListData) => [...prevLikeListData, ...response.data.data.likerResponses]);
        setTotalPages(response.data.data.totalPages);
        setIsLoading(false); // loading 종료
      })
      .catch((error) => {
        alert("There was an error!" + error);
        setIsLoading(false); // loading 종료
      });
  };

  //로그인 페이지로 이동
  const redirectToLogin = () => {
    router.push("/login");
  };

  const handleCloseModal = () => {
    setPage(0);
    closeModal(); // 모달 창 닫기
  };

  //팔로우 버튼 클릭
  const handleClickFollowBtn = (memberId: number) => {
    if (postId) {
      apiInstance({
        method: "get",
        url: `follow/${memberId}`,
      })
        .then(() => {
          setFollowStatuses({ ...followStatuses, [memberId]: true });
        })
        .catch((error) => {
          alert("There was an error!" + error);
          redirectToLogin();
        });
    }
  };
  // 언팔로우 버튼 클릭
  const handleClickUnfollowBtn = (memberId: number) => {
    if (postId) {
      apiInstance({
        method: "delete",
        url: `follow/${memberId}`,
      })
        .then(() => {
          setFollowStatuses({ ...followStatuses, [memberId]: false });
        })
        .catch((error) => {
          alert("There was an error!" + error);
          redirectToLogin();
        });
    }
  };

  const goToProfile = (id: number) => {
    router.push(`/userinfo/${id}`);
  };

  const handlePlusClick = () => {
    const newPage = page + 1;
    setPage(newPage);
    loadLikeList(newPage);
  };

  useEffect(() => {
    if (isOpen) {
      setLikeListData([]);
      loadLikeList(page);
    }
  }, [isOpen]);

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Comments Modal"
        overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-filter"
        className="bg-white rounded-lg py-10 md:px-8 px-2 w-full md:w-[650px] h-[750px] relative overflow-y-auto "
      >
        <div className="w-full">
          {likeListData.map((likeList, index) => (
            <div key={index} className="flex w-full justify-between items-center mb-5">
              <div className="flex items-center cursor-pointer" onClick={() => goToProfile(likeList.memberId)}>
                <div className="relative w-12 h-12">
                  <Image
                    src={likeList.profileUrl || pofileImage}
                    alt="프로필 사진"
                    layout="fill"
                    className="rounded-full object-cover mt-[2px] items-start"
                  />
                </div>
                <div className="ml-5 text-lg flex flex-wrap">{likeList.nickName}</div>
              </div>
              {likeList.memberId !== Number(userId) &&
                (followStatuses[likeList.memberId.toString()] || likeList.followed ? (
                  <div>
                    <button
                      className="w-20 h-8 border rounded-md bg-gray-600 text-white hover:bg-gray-800 hover:text-gray-200"
                      onClick={() => handleClickUnfollowBtn(likeList.memberId)}
                    >
                      언팔로우
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      className="w-20 h-8 border rounded-md hover:bg-gray-200"
                      onClick={() => handleClickFollowBtn(likeList.memberId)}
                    >
                      팔로우
                    </button>
                  </div>
                ))}
            </div>
          ))}
          {likeListData.length >= 8 && totalPages > page + 1 && (
            <div className="flex justify-center mt-10">
              <AiOutlinePlusCircle className="text-4xl cursor-pointer" onClick={handlePlusClick} />
            </div>
          )}
          {isLoading && (
            <div className="flex justify-center mt-10">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}
        </div>

        <button onClick={closeModal} className="absolute top-2 right-4 text-xl">
          <AiOutlineClose className="text-2xl" />
        </button>
      </Modal>
    </div>
  );
};

export default HeartsModal;
