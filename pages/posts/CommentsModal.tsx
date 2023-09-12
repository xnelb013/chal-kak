import Modal from "react-modal";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { AiOutlinePlusCircle, AiOutlineClose } from "react-icons/ai";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { apiInstance } from "../api/api";
import Cookies from "js-cookie";
import router from "next/router";
import WarningAlert from "@/pages/components/WarningAlert";

interface ModalComponentProps {
  isOpen: boolean;
  closeModal: () => void;
  postId: string | string[] | undefined;
  onCommentAdded?: () => void;
  onCommentDeleted?: () => void;
}

interface Comment {
  commentId: number;
  comment: string;
  nickname: string;
  profileUrl: string | null;
  createAt: string;
  updatedAt: string;
  memberId: number;
}

Modal.setAppElement(".wrap");

const CommentsModal: React.FC<ModalComponentProps> = ({
  isOpen,
  closeModal,
  postId,
  onCommentAdded,
  onCommentDeleted,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showFullTexts, setShowFullTexts] = useState(comments.map(() => false));
  const [commentInput, setCommentsInput] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const accessToken = Cookies.get("accessToken");
  const userId = Cookies.get("userId");

  const toggleFullText = (index: number) => {
    const newShowFullTexts = [...showFullTexts];
    newShowFullTexts[index] = !newShowFullTexts[index];
    setShowFullTexts(newShowFullTexts);
  };

  function formatDateToRelativeTime(dateString: string | number | Date) {
    // ISO 8601 형식의 날짜/시간 문자열을 Date 객체로 변환합니다.
    const date = new Date(dateString);

    // 현재 시각과의 차이를 계산하여 상대적인 시간 표현으로 변환합니다.
    return formatDistanceToNow(date, { addSuffix: true, locale: ko });
  }

  const loadComments = (page: number) => {
    setIsLoading(true); // loading 시작
    if (postId) {
      apiInstance({
        method: "get",
        url: `posts/${postId}/pageComments?page=${page}&size=9&sort=createdAt,desc`,
      })
        .then((response) => {
          setComments((prevComments) => [...prevComments, ...response.data.data.commentLoadResponses]);
          setTotalPages(response.data.data.totalPages);
          setIsLoading(false); // loading 종료
        })
        .catch((error) => {
          alert("There was an error!" + error);
          setIsLoading(false); // loading 종료
        });
    }
  };

  const handleCloseModal = () => {
    setPage(0);
    closeModal(); // 모달 창 닫기
  };

  useEffect(() => {
    if (isOpen && !isModalOpen) {
      setComments([]);
      loadComments(0);
    }
    setIsModalOpen(isOpen);
  }, [isOpen, isModalOpen, postId]);

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCommentsInput(value);
  };

  const handlePlusClick = () => {
    const newPage = page + 1;
    setPage(newPage); // + 버튼 클릭시 page 증가
    loadComments(newPage); // 바로 추가적인 댓글 로딩
  };

  // const handleEditComment = (commentId: number) => {
  //   console.log("edit" + commentId);
  // };

  const handleDeleteComment = (commentId: number) => {
    if (currentCommentId === null) return;
    apiInstance({
      method: "delete",
      url: `/posts/comments/${commentId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(() => {
        setComments(comments.filter((comment) => comment.commentId !== commentId));
        setAlertOpen(false);
        if (onCommentDeleted) {
          onCommentDeleted();
        }
      })
      .catch((error) => {
        alert("There was an error!" + error);
      });
  };

  const openDeleteAlert = (commentId: number) => {
    // 삭제 버튼 클릭 시 실행되는 함수
    setCurrentCommentId(commentId); // 삭제할 comment id 저장
    setAlertOpen(true); // 알림창 열기
  };

  const goToProfile = (id: number) => {
    router.push(`/userinfo/${id}`);
  };

  const handleSubmitComment = () => {
    if (postId) {
      apiInstance({
        method: "post",
        url: `posts/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          content: commentInput,
          postId: postId,
        },
      })
        .then(() => {
          setCommentsInput("");
          setComments([]);
          loadComments(0);
          setPage(0);
          if (onCommentAdded) {
            onCommentAdded();
          }
        })
        .catch((error) => {
          if (!userId) {
            router.push("/login");
          }
          console.log(error);
        });
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Comments Modal"
        overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-filter"
        className="bg-white rounded-lg py-10 md:px-10 px-2 w-full md:w-[650px] h-[750px] relative overflow-y-auto "
      >
        <div className="flex w-full justify-between">
          <input
            type="text"
            placeholder="댓글을 입력해주세요."
            value={commentInput}
            onChange={(e) => handleChange(e)}
            className="input input-bordered input-md w-full mb-7 mr-2 focus:border-none rounded-full"
          />
          <button className="btn" onClick={handleSubmitComment}>
            게시
          </button>
        </div>
        {comments.map((comment, index) => (
          <div key={index} className="flex mb-5 items-center justify-between">
            <div className="flex items-start w-full">
              <div className="relative w-11 h-11 cursor-pointer" onClick={() => goToProfile(comment.memberId)}>
                <Image
                  src={comment.profileUrl || "/images/defaultImg.jpg"}
                  alt="프로필 사진"
                  layout="fill"
                  className="rounded-full object-cover mt-[2px] items-start"
                />
              </div>
              <div className="flex-grow-6">
                <div className="flex flex-col ml-2">
                  <div className="block">
                    <div
                      className="text-sm font-semibold ml-1 cursor-pointer"
                      onClick={() => goToProfile(comment.memberId)}
                    >
                      {comment.nickname}
                    </div>
                    <div
                      className={`text-sm ml-1 col whitespace-pre-wrap break-words max-w-[13rem] md:max-w-sm ${
                        !showFullTexts[index] ? "line-clamp-2" : ""
                      }`}
                      onClick={() => toggleFullText(index)}
                    >
                      {comment.comment}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mr-5 flex flex-col h-full flex-grow-1">
                <div className="text-xs text-gray-400 ml-1 text-end w-full">
                  {formatDateToRelativeTime(comment.createAt)}
                </div>
                {comment.memberId === Number(userId) && (
                  <div className="bottom-1 mt-1 right-5 text-[11px] text-end">
                    {/* <button onClick={() => handleEditComment(comment.commentId)} className="mr-1">
                      수정
                    </button> */}
                    <button className="text-red-700" onClick={() => openDeleteAlert(comment.commentId)}>
                      삭제
                    </button>
                    {isModalOpen && currentCommentId !== null && (
                      <WarningAlert
                        open={alertOpen}
                        setOpen={setAlertOpen}
                        message="정말로 삭제하시겠습니까?"
                        onConfirm={handleDeleteComment}
                        id={currentCommentId}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {comments.length >= 8 && totalPages > page + 1 && (
          <div className="flex justify-center mt-10">
            <AiOutlinePlusCircle className="text-4xl cursor-pointer" onClick={handlePlusClick} />
          </div>
        )}
        {isLoading && (
          <div className="flex justify-center mt-10">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}
        <button onClick={closeModal} className="absolute top-2 right-4 text-xl">
          <AiOutlineClose className="text-2xl" />
        </button>
      </Modal>
    </div>
  );
};

export default CommentsModal;
