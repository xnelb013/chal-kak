import React from "react";
import { useRouter } from 'next/router';
import { AiOutlinePlus } from "react-icons/ai";

const PostEditorButton = () => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push("/postEditor");
  };

  return (
    <button 
      onClick={handleNavigation}
      className="border rounded-full border-gray-200 bg-white w-[42px] h-[42px] fixed bottom-8 right-1/3 z-[1000] transform -translate-x-1/2 flex items-center justify-center"
    >
      <AiOutlinePlus className="w-[24px] h-[24px]" />
    </button>
  );
};

export default PostEditorButton;