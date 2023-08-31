import Modal from "react-modal";
import pofileImage from "./img/프로필사진.jpg";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { AiOutlinePlusCircle, AiOutlineClose } from "react-icons/ai";
import { API_URL_PREFIX } from "@/constants/apiUrl";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { apiInstance } from "../api/api";

const img = pofileImage;

interface ModalComponentProps {
  isOpen: boolean;
  closeModal: () => void;
  postId: string | string[] | undefined;
}

interface Comment {
  commentId: number;
  comment: string;
  nickname: string;
  profileUrl: string | null;
  createAt: string;
}

Modal.setAppElement(".wrap");

const CommentsModal: React.FC<ModalComponentProps> = ({ isOpen, closeModal, postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showFullTexts, setShowFullTexts] = useState(comments.map(() => false));
  const [commentInput, setComentInput] = useState("");

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

  useEffect(() => {
    if (postId) {
      apiInstance({
        method: "get",
        url: `${API_URL_PREFIX}posts/${postId}/comments`,
      })
        .then((response) => {
          setComments(response.data.data);
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
  }, [postId]);

  useEffect(() => {
    console.log(comments);
  }, [comments]);

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
    setComentInput(value);
  };

  const handleSubmit = () => {
    console.log(commentInput);
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Comments Modal"
        overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-filter"
        className="bg-white rounded-lg p-10 w-[650px] h-[750px] relative overflow-y-auto "
      >
        <div className="flex w-full justify-between">
          <input
            type="text"
            placeholder="댓글을 입력해주세요."
            onChange={(e) => handleChange(e)}
            className="input input-bordered input-md w-full mb-7 mr-2 focus:border-none rounded-full"
          />
          <button className="btn" onClick={handleSubmit}>
            게시
          </button>
        </div>
        {comments.map((comment, index) => (
          <div key={index} className="flex mb-5 items-center justify-between">
            <div className="flex items-start w-[600px]">
              <div className="relative w-9 h-9">
                <Image
                  src={comment.profileUrl || img}
                  alt="프로필 사진"
                  layout="fill"
                  className="rounded-full object-cover mt-[2px] items-start"
                />
              </div>
              <div>
                <div className="flex flex-col ml-2">
                  <div className="block">
                    <div className="text-sm font-semibold ml-1">{comment.nickname}</div>
                    <div
                      className={`text-sm ml-1 col w-[460px] whitespace-pre-wrap break-words ${
                        !showFullTexts[index] ? "line-clamp-2" : ""
                      }`}
                      onClick={() => toggleFullText(index)}
                    >
                      {comment.comment}{" "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400 ml-1 mt-1 text-end flex-1">
                {formatDateToRelativeTime(comment.createAt)}
              </div>
            </div>
          </div>
        ))}
        {comments.length >= 8 && (
          <div className="flex justify-center">
            <AiOutlinePlusCircle className="text-4xl cursor-pointer" />
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
