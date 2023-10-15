import Image from "next/image";
import CommentsModal from "./CommentsModal";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { apiInstance } from "../api/api";
import router from "next/router";

interface CommentsSectionProps {
  postId: string | string[] | undefined;
}

interface Comment {
  commentId: number;
  comment: string;
  nickname: string;
  profileUrl: string | null;
  createAt: string;
  memberId: number;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const [commentsModalIsOpen, setcommentsModalIsOpen] = useState(false);
  const [commentsData, setCommentsData] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState(0);

  const openCommentsModal = () => {
    setcommentsModalIsOpen(true);
  };

  const closeCommentsModal = () => {
    setcommentsModalIsOpen(false);
  };

  const goToProfile = (id: number) => {
    router.push(`/userinfo/${id}`);
  };

  function formatDateToRelativeTime(dateString: string | number | Date) {
    // ISO 8601 형식의 날짜/시간 문자열을 Date 객체로 변환합니다.
    const date = new Date(dateString);

    // 현재 시각과의 차이를 계산하여 상대적인 시간 표현으로 변환합니다.
    return formatDistanceToNow(date, { addSuffix: true, locale: ko });
  }

  const onCommentAdded = () => {
    apiInstance({
      method: "get",
      url: `posts/${postId}/pageComments?page=0&size=3&sort=createdAt,desc`,
    })
      .then((response) => {
        setCommentsData(response.data.data.commentLoadResponses);
        setTotalComments(response.data.data.totalElements);
      })
      .catch((error) => {
        alert("There was an error!" + error);
      });
  };

  useEffect(() => {
    if (postId) {
      onCommentAdded();
    }
  }, [postId]);

  return (
    <div className="mb-4 md:text-base text-sm">
      <div className="mt-3 mb-4 flex cursor-pointer w-24" onClick={openCommentsModal}>
        <h1>댓글</h1>
        <div className="font-bold ml-1">{totalComments}</div>개
      </div>
      <CommentsModal
        isOpen={commentsModalIsOpen}
        closeModal={closeCommentsModal}
        postId={postId}
        onCommentAdded={onCommentAdded}
        onCommentDeleted={onCommentAdded}
      />

      <div className="flex w-full mx-auto ">
        <div className="flex flex-col">
          {commentsData.map((comment, index) => (
            <div key={index} className="flex w-full mb-4 justify-between">
              <div className="flex items-center">
                <div className="relative w-9 h-9 cursor-pointer" onClick={() => goToProfile(comment.memberId)}>
                  <Image
                    src={comment.profileUrl || "/images/defaultImg.jpg"}
                    alt="프로필 사진"
                    layout="fill"
                    className="rounded-full object-cover mt-[2px]"
                  />
                </div>
                <div>
                  <div className="flex flex-col ml-2">
                    <div className="flex w-full">
                      <div
                        className="md:text-sm text-xs font-semibold ml-1 cursor-pointer"
                        onClick={() => goToProfile(comment.memberId)}
                      >
                        {comment.nickname}
                      </div>
                      <div className="md:text-sm text-xs ml-2 col md:w-96 sm:w-48 w-24 overflow-hidden overflow-ellipsis whitespace-nowrap ">
                        {comment.comment}
                      </div>
                    </div>
                    <div className="md:text-xs text-[0.5rem] text-gray-500 ml-1 mt-1">
                      {formatDateToRelativeTime(comment.createAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {totalComments > 3 && (
            <div className="text-gray-500 cursor-pointer text-xs md:text-sm" onClick={openCommentsModal}>
              댓글 더 보기...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
