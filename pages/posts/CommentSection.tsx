import Image from "next/image";
import CommentsModal from "./CommentsModal";
import { useEffect, useState } from "react";
import profileImg from "./img/프로필사진.jpg";
import { API_URL_PREFIX } from "@/constants/apiUrl";
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

  useEffect(() => {
    if (postId) {
      apiInstance({
        method: "get",
        url: `${API_URL_PREFIX}posts/${postId}/comments`,
      })
        .then((response) => {
          setCommentsData(response.data.data);
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
  }, [postId]);

  useEffect(() => {
    console.log(commentsData);
  }, [commentsData]);

  return (
    <div className="mb-4 w-24">
      <div className="mt-3 ml-5 mb-4 flex cursor-pointer" onClick={openCommentsModal}>
        댓글
        <div className="font-bold ml-1">{commentsData.length}</div>개
      </div>
      <CommentsModal isOpen={commentsModalIsOpen} closeModal={closeCommentsModal} postId={postId} />

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
                    {/* 여기서는 comment.createAt을 그대로 사용하였으나, 실제로는 적절한 형식으로 날짜를 변환해야 합니다. */}
                    {/* 예: '2023-08-31T01:42:15.578672' -> '1일 전' */}
                    {/* 이러한 변환을 위해서는 date-fns, moment 등의 라이브러리를 사용할 수 있습니다. */}
                    <div className="text-xs text-gray-400 ml-1 mt-1">{formatDateToRelativeTime(comment.createAt)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
