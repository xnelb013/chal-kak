import { keyframes, styled } from "styled-components";

interface ChangeImageModalProps {
  // formData: FormData;
  isOpen: boolean;
  handleCloseModal: () => void;
  setProfileUrl: (url: string) => void;
}

const ChangeImageModal = ({ isOpen, handleCloseModal, setProfileUrl }: ChangeImageModalProps) => {
  const handleConfirm = () => {
    handleCloseModal();
  };
  const imageToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        setProfileUrl(reader.result as string);
        resolve(reader.result);
      };
    });
  };

  return (
    <>
      {isOpen && (
        <ModalWrapper>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const input = e.target as HTMLInputElement;
              if (input.files && input.files[0]) {
                imageToBase64(input.files[0]);
              }
            }}
          />
          <button onClick={handleConfirm}>확인</button>
        </ModalWrapper>
      )}
    </>
  );
};
const slideUp = keyframes`
  0% {
    transform: translate(-50%, 110%);
    opacity: 0;
  }
  20% {
    transform: translate(-50%, 100%);
    opacity: 0.2;
  }
  40% {
    transform: translate(-50%, 90%);
    opacity: 0.4;
  }
  60% {
    transform: translate(-50%, 80%);
    opacity: 0.6;
  }
  80% {
    transform: translate(-50%, 70%);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, 60%);
    opacity: 1;
  }
`;

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  position: fixed;
  width: 600px;
  min-width: 600px;
  max-height: 90vh;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -40%);
  z-index: 1000;
  background-color: white;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  animation: ${slideUp} 0.3s ease-in-out;
`;

export default ChangeImageModal;
