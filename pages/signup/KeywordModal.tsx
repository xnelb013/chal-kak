import styled from "styled-components";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  keywords: string[];
  setKeywords: (keywords: string[]) => void;
}

const KeywordModal: React.FC<Props> = ({ isOpen, onClose, keywords, setKeywords }) => {
  const handleConfirm = () => {
    // 저장된 키워드를 처리하고 모달을 닫기
    onClose();
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    if (e.target.checked) {
      setKeywords([...keywords, keyword]);
    } else {
      setKeywords(keywords.filter((kw) => kw !== keyword));
    }
  };

  const renderKeywordsList = () => {
    return keywords.map((keyword, index) => (
      <div key={`keyword_${index}`} className="inline-block mr-2">
        <div className="badge badge-outline h-7 mb-5">{keyword}</div>
      </div>
    ));
  };

  // 키워드 선택 및 변경 관련 로직 작성

  return (
    <>
      {isOpen && (
        <ModalWrapper>
          <div className="text-lg font-bold mb-5">관심 키워드 선택</div>
          <div>{renderKeywordsList()}</div>

          <div className="mt-4 mb-5">
            <ul className="grid gap-6 grid-cols-4">
              <li className="w-[100px]">
                <input
                  type="checkbox"
                  id="키워드1"
                  value="키워드1"
                  className="hidden peer"
                  onChange={handleKeywordChange}
                  checked={keywords.includes("키워드1")}
                />
                <label
                  htmlFor="키워드1"
                  className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="block overflow-wrap break-words">
                    <svg
                      className="mb-2 w-7 h-7 text-sky-500"
                      fill="currentColor"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="..."></path>
                    </svg>
                    <div className="text-sm text-center font-semibold w-[60px]">키워드1</div>
                  </div>
                </label>
              </li>
              <li className="w-[100px]">
                <input
                  type="checkbox"
                  id="키워드2"
                  value="키워드2"
                  className="hidden peer"
                  onChange={handleKeywordChange}
                  checked={keywords.includes("키워드2")}
                />
                <label
                  htmlFor="키워드2"
                  className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="block">
                    <svg
                      className="mb-2 w-7 h-7 text-sky-500"
                      fill="currentColor"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="..."></path>
                    </svg>
                    <div className="text-sm text-center font-semibold w-[60px]">키워드2</div>
                  </div>
                </label>
              </li>
              <li className="w-[100px]">
                <input
                  type="checkbox"
                  id="키워드3"
                  value="키워드3"
                  className="hidden peer"
                  onChange={handleKeywordChange}
                  checked={keywords.includes("키워드3")}
                />
                <label
                  htmlFor="키워드3"
                  className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="block">
                    <svg
                      className="mb-2 w-7 h-7 text-sky-500"
                      fill="currentColor"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="..."></path>
                    </svg>
                    <div className="text-sm text-center font-semibold w-[60px]">키워드3</div>
                  </div>
                </label>
              </li>
            </ul>
          </div>
          <button type="button" className="btn" onClick={handleConfirm}>
            확인
          </button>
        </ModalWrapper>
      )}
    </>
  );
};

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 500px;
  min-width: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background-color: white;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);

  > div:nth-child(2) {
    text-align: center;
  }
`;

export default KeywordModal;
