import Image from "next/image";
import React from "react";
import styled from "styled-components";

interface StyleTag {
  id: number;
  category: string;
  keywordImg: string;
  keyword: string;
}

interface Props {
  styleTagsData: StyleTag[];
  isOpen: boolean;
  onClose: () => void;
  styleTags: number[];
  setStyleTags: (styleTags: number[]) => void;
  keywords: string[];
  setKeywords: (keywords: string[]) => void;
}

const KeywordModal = ({
  isOpen,
  onClose,
  keywords,
  setKeywords,
  styleTags,
  setStyleTags,
  styleTagsData,
}: Props): JSX.Element => {
  const handleConfirm = () => {
    onClose();
  };

  // 키워드 체인지
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;

    const keywordId = Number(e.target.dataset.id);

    if (e.target.checked) {
      // 개수제한
      if (keywords.length < 5) {
        setKeywords([...keywords, keyword]);
        setStyleTags([...styleTags, keywordId]);
      } else {
        e.target.checked = false;
      }
      // 키워드리스트에서 빼기
    } else {
      setKeywords(keywords.filter((kw) => kw !== keyword));
      setStyleTags(styleTags.filter((tagId) => tagId !== keywordId));
    }
  };

  // 키워드 리스트 보여주기
  const renderKeywordsList = () => {
    return keywords.map((keyword, index) => (
      <div key={`keyword_${index}`} className="inline-block mr-2">
        <div className="badge badge-outline h-7 mb-1 text-xs md:text-sm">{keyword}</div>
      </div>
    ));
  };

  return (
    <>
      {isOpen && (
        <ModalWrapper>
          <div className="text-xl font-bold mt-8">관심 키워드 선택</div>
          <div className="text-md mb-5">(최대 5개까지 선택 가능합니다)</div>
          <div className="flex flex-wrap justify-center">{renderKeywordsList()}</div>

          <div className="mt-4 mb-5">
            {["STYLE", "TPO"].map((category, index) => {
              if (!styleTagsData) return null;
              const filteredStyleTags = styleTagsData.filter((tag) => tag.category === category);
              if (filteredStyleTags.length === 0) return null;

              return (
                <React.Fragment key={index}>
                  <div className="text-2xl font-bold mb-5 text-center">{category}</div>
                  <ul className="grid gap-6 grid-cols-4">
                    {filteredStyleTags.map(({ id, keywordImg, keyword }) => (
                      <li key={id} className=" flex flex-col items-center">
                        <input
                          type="checkbox"
                          id={keyword}
                          value={keyword}
                          data-id={id}
                          className="hidden peer"
                          onChange={handleKeywordChange}
                          checked={keywords.includes(keyword)}
                        />
                        <label
                          htmlFor={keyword}
                          className="relative inline-flex w-full aspect-content bg-gray-200 text-gray-500 border-[3px] border-gray-200 rounded-full cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600"
                        >
                          <AspectContent>
                            {keywordImg && (
                              <Image
                                src={keywordImg}
                                alt={`${keyword} 이미지`}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-full"
                              />
                            )}
                          </AspectContent>
                        </label>
                        <div
                          className={`text-sm text-center font-semibold w-full mt-2 ${
                            keywords.includes(keyword) ? "text-blue-600" : "text-gray-500"
                          }`}
                        >
                          {keyword}
                        </div>
                      </li>
                    ))}
                  </ul>
                </React.Fragment>
              );
            })}
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
  width: calc(100% - 2rem);
  max-width: 600px;
  min-height: min-content;
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

const AspectContent = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
`;

export default KeywordModal;
