// import Image from "next/image";
// import React from "react";
// import styled from "styled-components";
// import { UserinfoType } from "./modify-userinfo";
// import { AiOutlineClose } from "react-icons/ai";

// interface StyleTag {
//   id: number;
//   category: string;
//   keywordImg: string;
//   keyword: string;
// }

// interface Props {
//   isOpen: boolean;
//   handleCloseModal: () => void;
//   setUserinfo: (userInfo: UserinfoType) => void;
//   userinfo: UserinfoType;
//   tpoTagList: StyleTag[];
//   styleTagList: StyleTag[];
// }

// const ChangeKeywordModal = ({
//   isOpen,
//   handleCloseModal,
//   setUserinfo,
//   userinfo,
//   tpoTagList,
//   styleTagList,
// }: Props): JSX.Element => {
//   const handleConfirm = () => {
//     handleCloseModal();
//   };

//   // 키워드 체인지
//   const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const keyword = e.target.value;

//     const keywordId = Number(e.target.dataset.id);

//     if (e.target.checked) {
//       // 개수제한
//       if (userinfo.styleTags.length < 5) {
//         setUserinfo({ ...userinfo, styleTags: [...userinfo.styleTags, keywordId] });
//       } else {
//         e.target.checked = false;
//       }
//       // 키워드리스트에서 빼기
//     } else {
//       setUserinfo({ ...userinfo, styleTags: userinfo.styleTags.filter((id) => id !== keywordId) });
//     }
//   };

//   // 키워드 리스트 보여주기
//   const renderKeywordsList = () => {
//     return keywords.map((keyword, index) => (
//       <div key={`keyword_${index}`} className="inline-block mr-2">
//         <div className="badge badge-outline h-7 mb-5">{keyword}</div>
//       </div>
//     ));
//   };

//   return (
//     <>
//       {isOpen && (
//         <ModalWrapper>
//           <div className="mt-[60px] mx-4 w-[450px]">
//             <button className="absolute left-[33rem] top-[5.2rem]" onClick={handleCloseModal}>
//               <AiOutlineClose size={24} />
//             </button>
//           </div>
//         </ModalWrapper>
//       )}
//     </>
//   );
// };

// const ModalWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: start;
//   align-items: center;
//   position: fixed;
//   width: 600px;
//   min-width: 600px;
//   max-height: 90vh;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   z-index: 1000;
//   background-color: white;
//   padding: 1rem;
//   border-radius: 5px;
//   box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
//   overflow-y: auto;
// `;

// export default ChangeKeywordModal;

// {isKeywordModalOpen && (
//   <ChangeKeywordModal
//     isOpen={isKeywordModalOpen}
//     handleCloseModal={handleCloseKeywordModal}
//     setUserinfo={setUserInfo}
//     userinfo={userinfo}
//     styleTagList={styleTagList}
//     tpoTagList={tpoTagList}
//   />
// )}
