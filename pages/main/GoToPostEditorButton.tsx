import React, { useState } from "react";
import { useRouter } from "next/router";
import { AiOutlinePlus } from "react-icons/ai";

const PostEditorButton = () => {
  const router = useRouter();
  const [isVisble] = useState(true);

  const handleNavigation = () => {
    router.push("/postEditor");
  };
  // 게시글이 없는 경우, 게시글 작성 버튼이 보이지 않는 문제
  // 스크롤 이벤트 핸들러
  // const toggleVisibility = () => {
  //   if(window.scrollY > 300) { // 원하는 스크롤 위치에 도달했을 때 버튼이 보이도록 설정
  //       setIsVisible(true);
  //   } else {
  //       setIsVisible(false);
  //   }
  //   setIsVisible(true);
  // };

  // useEffect(() => {
  //   window.addEventListener("scroll", toggleVisibility);

  //   return () => window.removeEventListener("scroll", toggleVisibility);
  // }, []);

  return (
    isVisble && (
      <button
        onClick={handleNavigation}
        className="border rounded-full border-gray-800 text-white bg-gray-800 w-[42px] h-[42px] flex items-center justify-center"
      >
        <AiOutlinePlus className="w-[24px] h-[24px]" />
      </button>
    )
  );
};

export default PostEditorButton;
