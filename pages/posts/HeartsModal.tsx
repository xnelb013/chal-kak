import pofileImage from "./img/프로필사진.jpg";
import { useEffect } from "react";
import Modal from "react-modal";
import Image from "next/image";
import { AiOutlineClose, AiOutlinePlusCircle } from "react-icons/ai";

interface ModalComponentProps {
  isOpen: boolean;
  closeModal: () => void;
}
Modal.setAppElement(".wrap");

const hearts = [
  {
    url: pofileImage,
    name: "eunseok",
  },
  {
    url: pofileImage,
    name: "sohyun",
  },
  {
    url: pofileImage,
    name: "jongjin",
  },
  {
    url: pofileImage,
    name: "eunseok",
  },
  {
    url: pofileImage,
    name: "sohyun",
  },
  {
    url: pofileImage,
    name: "jongjin",
  },
  {
    url: pofileImage,
    name: "eunseok",
  },
  {
    url: pofileImage,
    name: "sohyun",
  },
  {
    url: pofileImage,
    name: "jongjin",
  },
];

const HeartsModal: React.FC<ModalComponentProps> = ({ isOpen, closeModal }) => {
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
        contentLabel="Comments Modal"
        overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-filter"
        className="bg-white rounded-lg p-10 w-[650px] h-[750px] relative overflow-y-auto "
      >
        <div className="w-[570px]">
          {hearts.map((heart, index) => (
            <div key={index} className="flex w-full justify-between items-center mb-5">
              <div className="flex items-center">
                <div className="relative w-12 h-12">
                  <Image
                    src={heart.url}
                    alt="프로필 사진"
                    layout="fill"
                    className="rounded-full object-cover mt-[2px] items-start"
                  />
                </div>
                <div className="ml-5 text-lg">{heart.name}</div>
              </div>

              <div>
                <button className="w-20 h-8 border rounded-md">팔로우</button>
              </div>
            </div>
          ))}
          {hearts.length >= 9 && (
            <div className="flex justify-center">
              <AiOutlinePlusCircle className="text-4xl cursor-pointer" />
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
