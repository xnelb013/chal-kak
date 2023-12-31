import { useEffect } from "react";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { AiOutlineClose } from "react-icons/ai";
import InfoAlert from "../components/InfoAlert";
import { useSetRecoilState } from "recoil";
import { alertState } from "@/utils/atoms";

interface ModalComponentProps {
  isOpen: boolean;
  closeModal: () => void;
}

Modal.setAppElement(".wrap");

const URL = "https://chal-kak.vercel.app";

const ShareModal: React.FC<ModalComponentProps> = ({ isOpen, closeModal }) => {
  const router = useRouter();

  const setAlert = useSetRecoilState(alertState);
  const currentURL = URL + router.asPath;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentURL);
      setAlert({ open: true, message: "현재 게시글의 주소가 복사되었습니다!" });
    } catch (error) {
      alert("There was an error!" + error);
    }
  };

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

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Share Modal"
        overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-filter"
        className="bg-white rounded-lg p-10 w-[600px] h-[220px] relative overflow-y-auto "
      >
        <div className="flex justify-between">
          <div className=" text-xl">게시글 공유</div>
          <AiOutlineClose className="text-3xl cursor-pointer" onClick={closeModal} />
        </div>
        <div className="flex mt-10">
          <div className=" border border-gray-300 rounded-xl p-3 flex-1">{currentURL}</div>
          <div>
            <button className="btn ml-5" onClick={copyToClipboard}>
              복사
            </button>
          </div>
        </div>
        <InfoAlert />
      </Modal>
    </div>
  );
};

export default ShareModal;
