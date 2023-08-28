import Image from "next/image";
import styled from "styled-components";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  keywords: string[];
  setKeywords: (keywords: string[]) => void;
}

const KeywordModal = ({ isOpen, onClose, keywords, setKeywords }: Props): JSX.Element => {
  const handleConfirm = () => {
    onClose();
  };

  // 키워드 체인지
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    if (e.target.checked) {
      // 개수제한
      if (keywords.length < 5) {
        setKeywords([...keywords, keyword]);
      } else {
        e.target.checked = false;
      }
      // 키워드리스트에서 빼기
    } else {
      setKeywords(keywords.filter((kw) => kw !== keyword));
    }
  };

  // 키워드 리스트 보여주기
  const renderKeywordsList = () => {
    return keywords.map((keyword, index) => (
      <div key={`keyword_${index}`} className="inline-block mr-2">
        <div className="badge badge-outline h-7 mb-5">{keyword}</div>
      </div>
    ));
  };

  return (
    <>
      {isOpen && (
        <ModalWrapper>
          <div className="text-xl font-bold mt-8">관심 키워드 선택</div>
          <div className="text-md mb-5">(최대 5개까지 선택 가능합니다)</div>
          <div>{renderKeywordsList()}</div>
          <div className="mt-4 mb-5">
            <div className="text-2xl font-bold mb-5 mt-5 text-center">STYLE</div>
            <ul className="grid gap-6 grid-cols-4">
              <li className="w-[100px] flex flex-col items-center">
                <input
                  type="checkbox"
                  id="아메카지"
                  value="아메카지"
                  className="hidden peer"
                  onChange={handleKeywordChange}
                  checked={keywords.includes("아메카지")}
                />
                <label
                  htmlFor="아메카지"
                  className="relative inline-flex w-full h-[100px] text-gray-500 bg-white border-[3px] border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Image
                    src="/images/keywordImages/아메카지.png"
                    className="absolute inset-0 object-cover w-full h-full rounded-full"
                    alt="아메카지 이미지"
                    width={700}
                    height={700}
                  />
                </label>
                <div className="block">
                  <div
                    className={`text-sm text-center font-semibold w-[60px] mt-2 ${
                      keywords.includes("아메카지") ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    아메카지
                  </div>
                </div>
              </li>
              <li className="w-[100px] flex flex-col items-center">
                <input
                  type="checkbox"
                  id="원마일웨어"
                  value="원마일웨어"
                  className="hidden peer"
                  onChange={handleKeywordChange}
                  checked={keywords.includes("원마일웨어")}
                />
                <label
                  htmlFor="원마일웨어"
                  className="relative inline-flex w-full h-[100px] text-gray-500 bg-white border-[3px] border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Image
                    src="/images/keywordImages/원마일웨어.png"
                    className="absolute inset-0 object-cover w-full h-full rounded-full"
                    alt="원마일웨어 이미지"
                    width={700}
                    height={700}
                  />
                </label>
                <div className="block">
                  <div
                    className={`text-sm text-center font-semibold w-[70px] pl-1 mt-2 ${
                      keywords.includes("원마일웨어") ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    원마일웨어
                  </div>
                </div>
              </li>
              <li className="w-[100px] flex flex-col items-center">
                <input
                  type="checkbox"
                  id="미니멀"
                  value="미니멀"
                  className="hidden peer"
                  onChange={handleKeywordChange}
                  checked={keywords.includes("미니멀")}
                />
                <label
                  htmlFor="미니멀"
                  className="relative inline-flex w-full h-[100px] text-gray-500 bg-white border-[3px] border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Image
                    src="/images/keywordImages/미니멀.png"
                    className="absolute inset-0 object-cover w-full h-full rounded-full"
                    alt="미니멀 이미지"
                    width={700}
                    height={700}
                  />
                </label>
                <div className="block">
                  <div
                    className={`text-sm text-center font-semibold w-[60px] mt-2 ${
                      keywords.includes("미니멀") ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    미니멀
                  </div>
                </div>
              </li>
              <li className="w-[100px] flex flex-col items-center">
                <input
                  type="checkbox"
                  id="댄디"
                  value="댄디"
                  className="hidden peer"
                  onChange={handleKeywordChange}
                  checked={keywords.includes("댄디")}
                />
                <label
                  htmlFor="댄디"
                  className="relative inline-flex w-full h-[100px] text-gray-500 bg-white border-[3px] border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Image
                    src="/images/keywordImages/댄디.png"
                    className="absolute inset-0 object-cover w-full h-full rounded-full"
                    alt="댄디 이미지"
                    width={700}
                    height={700}
                  />
                </label>
                <div className="block">
                  <div
                    className={`text-sm text-center font-semibold w-[70px] pl-1 mt-2 ${
                      keywords.includes("댄디") ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    댄디
                  </div>
                </div>
              </li>
              <li className="w-[100px] flex flex-col items-center">
                <input
                  type="checkbox"
                  id="비즈니스캐주얼"
                  value="비즈니스캐주얼"
                  className="hidden peer"
                  onChange={handleKeywordChange}
                  checked={keywords.includes("비즈니스캐주얼")}
                />
                <label
                  htmlFor="비즈니스캐주얼"
                  className="relative inline-flex w-full h-[100px] text-gray-500 bg-white border-[3px] border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Image
                    src="/images/keywordImages/비즈니스캐주얼.png"
                    className="absolute inset-0 object-cover w-full h-full rounded-full"
                    alt="비즈니스캐주얼 이미지"
                    width={700}
                    height={700}
                  />
                </label>
                <div className="block">
                  <div
                    className={`text-sm text-center font-semibold w-[60px] mt-2 ${
                      keywords.includes("비즈니스캐주얼") ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    비즈니스캐주얼
                  </div>
                </div>
              </li>
              <li className="w-[100px] flex flex-col items-center">
                <input
                  type="checkbox"
                  id="빈티지"
                  value="빈티지"
                  className="hidden peer"
                  onChange={handleKeywordChange}
                  checked={keywords.includes("빈티지")}
                />
                <label
                  htmlFor="빈티지"
                  className="relative inline-flex w-full h-[100px] text-gray-500 bg-white border-[3px] border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Image
                    src="/images/keywordImages/빈티지.png"
                    className="absolute inset-0 object-cover w-full h-full rounded-full"
                    alt="빈티지 이미지"
                    width={700}
                    height={700}
                  />
                </label>
                <div className="block">
                  <div
                    className={`text-sm text-center font-semibold w-[70px] pl-1 mt-2 ${
                      keywords.includes("빈티지") ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    빈티지
                  </div>
                </div>
              </li>
              <li className="w-[100px] flex flex-col items-center">
                <input
                  type="checkbox"
                  id="스트릿"
                  value="스트릿"
                  className="hidden peer"
                  onChange={handleKeywordChange}
                  checked={keywords.includes("스트릿")}
                />
                <label
                  htmlFor="스트릿"
                  className="relative inline-flex w-full h-[100px] text-gray-500 bg-white border-[3px] border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Image
                    src="/images/keywordImages/스트릿.png"
                    className="absolute inset-0 object-cover w-full h-full rounded-full"
                    alt="스트릿 이미지"
                    width={700}
                    height={700}
                  />
                </label>
                <div className="block">
                  <div
                    className={`text-sm text-center font-semibold w-[60px] mt-2 ${
                      keywords.includes("스트릿") ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    스트릿
                  </div>
                </div>
              </li>
              <li className="w-[100px] flex flex-col items-center">
                <input
                  type="checkbox"
                  id="스포티"
                  value="스포티"
                  className="hidden peer"
                  onChange={handleKeywordChange}
                  checked={keywords.includes("스포티")}
                />
                <label
                  htmlFor="스포티"
                  className="relative inline-flex w-full h-[100px] text-gray-500 bg-white border-[3px] border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Image
                    src="/images/keywordImages/스포티.png"
                    className="absolute inset-0 object-cover w-full h-full rounded-full"
                    alt="스포티 이미지"
                    width={700}
                    height={700}
                  />
                </label>
                <div className="block">
                  <div
                    className={`text-sm text-center font-semibold w-[70px] pl-1 mt-2 ${
                      keywords.includes("스포티") ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    스포티
                  </div>
                </div>
              </li>
            </ul>
            <div className="text-2xl font-bold mb-5 mt-10 text-center">TPO</div>
            <ul className="grid gap-6 grid-cols-4">
              <li className="w-[100px] flex flex-col items-center">
                <input
                  type="checkbox"
                  id="데이트"
                  value="데이트"
                  className="hidden peer"
                  onChange={handleKeywordChange}
                  checked={keywords.includes("데이트")}
                />
                <label
                  htmlFor="데이트"
                  className="relative inline-flex w-full h-[100px] text-gray-500 bg-white border-[3px] border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Image
                    src="/images/keywordImages/데이트룩.png"
                    className="absolute inset-0 object-cover w-full h-full rounded-full"
                    alt="데이트 이미지"
                    width={700}
                    height={700}
                  />
                </label>
                <div className="block">
                  <div
                    className={`text-sm text-center font-semibold w-[60px] mt-2 ${
                      keywords.includes("데이트") ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    데이트
                  </div>
                </div>
              </li>
              <li className="w-[100px] flex flex-col items-center">
                <input
                  type="checkbox"
                  id="하객"
                  value="하객"
                  className="hidden peer"
                  onChange={handleKeywordChange}
                  checked={keywords.includes("하객")}
                />
                <label
                  htmlFor="하객"
                  className="relative inline-flex w-full h-[100px] text-gray-500 bg-white border-[3px] border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Image
                    src="/images/keywordImages/하객룩.png"
                    className="absolute inset-0 object-cover w-full h-full rounded-full"
                    alt="하객 이미지"
                    width={700}
                    height={700}
                  />
                </label>
                <div className="block">
                  <div
                    className={`text-sm text-center font-semibold w-[70px] pl-1 mt-2 ${
                      keywords.includes("하객") ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    하객
                  </div>
                </div>
              </li>
              <li className="w-[100px] flex flex-col items-center">
                <input
                  type="checkbox"
                  id="여행"
                  value="여행"
                  className="hidden peer"
                  onChange={handleKeywordChange}
                  checked={keywords.includes("여행")}
                />
                <label
                  htmlFor="여행"
                  className="relative inline-flex w-full h-[100px] text-gray-500 bg-white border-[3px] border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Image
                    src="/images/keywordImages/여행룩.png"
                    className="absolute inset-0 object-cover w-full h-full rounded-full"
                    alt="여행 이미지"
                    width={700}
                    height={700}
                  />
                </label>
                <div className="block">
                  <div
                    className={`text-sm text-center font-semibold w-[60px] mt-2 ${
                      keywords.includes("여행") ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    여행
                  </div>
                </div>
              </li>
              <li className="w-[100px] flex flex-col items-center">
                <input
                  type="checkbox"
                  id="출근"
                  value="출근"
                  className="hidden peer"
                  onChange={handleKeywordChange}
                  checked={keywords.includes("출근")}
                />
                <label
                  htmlFor="출근"
                  className="relative inline-flex w-full h-[100px] text-gray-500 bg-white border-[3px] border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Image
                    src="/images/keywordImages/출근룩.png"
                    className="absolute inset-0 object-cover w-full h-full rounded-full"
                    alt="출근 이미지"
                    width={700}
                    height={700}
                  />
                </label>
                <div className="block">
                  <div
                    className={`text-sm text-center font-semibold w-[70px] pl-1 mt-2 ${
                      keywords.includes("출근") ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    출근
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <button type="button" className="btn-neutral p-3 w-[150px] rounded-3xl my-5" onClick={handleConfirm}>
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
  justify-content: start;
  align-items: center;
  position: fixed;
  width: 600px;
  min-width: 600px;
  max-height: 90vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background-color: white;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
`;

export default KeywordModal;
