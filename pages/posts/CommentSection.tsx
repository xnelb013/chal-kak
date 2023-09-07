import Image from "next/image";
import CommentsModal from "./CommentsModal";
import { useEffect, useState } from "react";
import profileImg from "./img/프로필사진.jpg";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { apiInstance } from "../api/api";

interface CommentsSectionProps {
  postId: string | string[] | undefined;
}

interface Comment {
  commentId: number;
  comment: string;
  nickname: string;
  profileUrl: string | null;
  createAt: string;
}

const img = profileImg;

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
        console.error("There was an error!", error);
      });
  };

  useEffect(() => {
    if (postId) {
      onCommentAdded();
    }
  }, [postId]);

  return (
    <div className="mb-4">
      <div className="mt-3 ml-5 mb-4 flex cursor-pointer w-24" onClick={openCommentsModal}>
        댓글
        <div className="font-bold ml-1">{totalComments}</div>개
      </div>
      <CommentsModal
        isOpen={commentsModalIsOpen}
        closeModal={closeCommentsModal}
        postId={postId}
        onCommentAdded={onCommentAdded}
        onCommentDeleted={onCommentAdded}
      />

      <div className="flex w-[680px] mx-auto ml-5">
        <div className="flex flex-col">
          {commentsData.map((comment, index) => (
            <div key={index} className="flex w-[680px] mb-4 justify-between">
              <div className="flex items-center">
                <div className="relative w-9 h-9">
                  <Image
                    src={comment.profileUrl || img}
                    alt="프로필 사진"
                    layout="fill"
                    className="rounded-full object-cover mt-[2px]"
                  />
                </div>
                <div>
                  <div className="flex flex-col ml-2">
                    <div className="flex">
                      <div className="text-sm font-semibold ml-1">{comment.nickname}</div>
                      <div className="text-sm ml-2 col w-96 overflow-hidden overflow-ellipsis whitespace-nowrap">
                        {comment.comment}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 ml-1 mt-1">{formatDateToRelativeTime(comment.createAt)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {totalComments > 3 ? (
            <div className="text-gray-400 ml-2 cursor-pointer" onClick={openCommentsModal}>
              댓글 더 보기...
            </div>
          ) : (
            <div className="text-gray-400 ml-2 cursor-pointer" onClick={openCommentsModal}>
              댓글 창 열기
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
