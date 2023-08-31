import Image from "next/image";
import profileImg from "./img/프로필사진.jpg";
import postImage from "./img/여행룩.png";
import Carousel from "../components/Carousel";
import { AiOutlineHeart, AiOutlineComment } from "react-icons/ai";
import { BiLinkExternal, BiLocationPlus } from "react-icons/bi";
import Divider from "../components/Divider";
import { useEffect, useState } from "react";
import HeartsModal from "./HeartsModal";
import ShareModal from "./ShareModal";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/router";
import CommentsSection from "./CommentSection";

interface Writer {
  height: number;
  id: number;
  nickname: string;
  profileImg: string;
  weight: number;
}

interface Post {
  content: string;
  hashTags: string[];
  id: number;
  likeCount: number;
  location: string;
  privacyHeight: boolean;
  privacyWeight: boolean;
  styleTags: string[];
  viewCount: number;
  writer: Writer;
}

const img = profileImg;
const postImages = [postImage, profileImg];

const HomePage = () => {
  const [postData, setPostData] = useState<Post | null>(null);
  const [, setcommentsModalIsOpen] = useState(false);
  const [heartsModalIsOpen, setHeartsModalIsOpen] = useState(false);
  const [shareModalIsOpen, setShareModalIsOpen] = useState(false);
  const accessToken = Cookies.get("accessToken");
  console.log(Cookies.get("userId"));

  const writerSrc = postData?.writer.profileImg || img;
  const router = useRouter();
  const { postId } = router.query;

  const openCommentsModal = () => {
    setcommentsModalIsOpen(true);
  };

  const openHeartsModal = () => {
    setHeartsModalIsOpen(true);
  };

  const closeHeartsModal = () => {
    setHeartsModalIsOpen(false);
  };

  const openShareModal = () => {
    setShareModalIsOpen(true);
  };

  const closeShareModal = () => {
    setShareModalIsOpen(false);
  };

  useEffect(() => {
    if (postId) {
      axios({
        method: "get",
        url: `http://49.142.69.201:8080/posts/${postId}`,
      })
        .then((response) => {
          setPostData(response.data.data);
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
  }, [postId, accessToken]);

  useEffect(() => {
    console.log(postData);
  }, [postData]);

  return (
    <div className=" flex flex-col mt-6">
      <div className=" flex items-center justify-between w-[680px] mx-auto">
        <div className="flex">
          <div className="relative w-12 h-12">
            <Image src={writerSrc} alt="프로필 사진" layout="fill" className="rounded-full object-cover" />
          </div>
          <div className="ml-2">
            <div className=" font-semibold">{postData?.writer.nickname}</div>
            <div className="text-gray-500">8월26일</div>
          </div>
        </div>
        <div className="badge badge-outline h-7 border-gray-300 mr-40">
          <BiLocationPlus className="text-lg mt-[1px]" />
          <div className="ml-2">{postData?.location}</div>
        </div>
        <div className="flex items-center">
          <div className="border w-[110px] text-center py-2 rounded-full mr-2 bg-gray-100 text-xs">
            {postData?.writer.height} / {postData?.writer.weight}
          </div>
          <div className="btn">팔로우</div>
        </div>
      </div>
      <Carousel settings={{ slidesToShow: 1, arrows: true, dots: true, centerMode: false, infinite: false }}>
        {postImages.map((image, index) => (
          <div key={index} className="w-[720px] h-[960px] bg-gray-300 flex items-center justify-center mt-4">
            <Image src={image} alt={`Post Image ${index}`} className="object-cover w-full h-full" />
          </div>
        ))}
      </Carousel>
      <div className="flex items-center justify-between w-[680px] mx-auto mt-1-">
        <div className="flex flex-1">
          <div>
            <AiOutlineHeart className="text-4xl mr-2 cursor-pointer" />
          </div>
          <div onClick={openCommentsModal} className="relative cursor-pointer">
            <AiOutlineComment className="text-4xl" />
          </div>
        </div>
        <div onClick={openShareModal} className=" w-7 h-7 cursor-pointer relative">
          <BiLinkExternal className="text-3xl cursor-pointer" />
        </div>
        <ShareModal isOpen={shareModalIsOpen} closeModal={closeShareModal} />
      </div>
      <div>
        <div className="w-[120px]" onClick={openHeartsModal}>
          <div className="flex ml-5 mt-2 cursor-pointer">
            좋아요 <div className="font-bold ml-1">{postData?.likeCount}</div>개
          </div>
          <div className="flex ml-5 mt-2 cursor-pointer w-[600px] text-gray-500">
            #
            {postData?.styleTags.map((tag, index) => (
              <div className="mr-1" key={index}>
                {tag}
              </div>
            ))}
            #
            {postData?.hashTags.map((tag, index) => (
              <div className="mr-1" key={index}>
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
      <HeartsModal isOpen={heartsModalIsOpen} closeModal={closeHeartsModal} />
      <div className=" mb-36">
        <CommentsSection postId={postId} />
        <Divider width="200px" />
      </div>
    </div>
  );
};

export default HomePage;
