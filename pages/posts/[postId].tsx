import Image from "next/image";
import profileImg from "./img/프로필사진.jpg";
import postImage from "./img/여행룩.png";
import Carousel from "../components/Carousel";
import { AiOutlineHeart, AiOutlineComment } from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi";
import Divider from "../components/Divider";

const img = profileImg;
const postImages = [postImage, profileImg];
const heartCount = 96;
const commentsCount = 6;

const comments = [
  {
    name: "eunseok",
    content: "하하ggggggggggggggggggggggggggggg하하ggggggggggggggggggggggggggggg하하ggggggggggggggggggggggggggggg",
    day: "1일 전",
  },
  {
    name: "sohyun",
    content: "호호",
    day: "2일 전",
  },
  {
    name: "jongjin",
    content: "히히",
    day: "2일 전",
  },
];

const HomePage = () => {
  return (
    <div className=" flex flex-col mt-6">
      <div className=" flex items-center justify-between w-[680px] mx-auto">
        <div className="flex">
          <div className="relative w-12 h-12">
            <Image src={img} alt="프로필 사진" layout="fill" className="rounded-full object-cover" />
          </div>
          <div className="ml-2">
            <div className=" font-semibold">name</div>
            <div className="text-gray-500">날짜</div>
          </div>
        </div>
        <div>
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
        <div className="flex">
          <div>
            <AiOutlineHeart className="text-4xl" />
          </div>
          <div>
            <AiOutlineComment className="text-4xl" />
          </div>
        </div>
        <div>
          <BiLinkExternal className="text-4xl" />
        </div>
      </div>
      <div>
        <div className="flex ml-5 mt-2">
          좋아요 <p className="font-bold">{heartCount}</p>개
        </div>
      </div>
      <div className="mb-4">
        <div className="mt-3 ml-5 mb-2">댓글 {commentsCount}개</div>
        <div className="flex w-[680px] mx-auto">
          <div className="flex flex-col">
            {comments.map((comment, index) => (
              <div key={index} className="flex w-[680px] mb-4 justify-between">
                <div className="flex items-center">
                  <div className="relative w-9 h-9">
                    <Image src={img} alt="프로필 사진" layout="fill" className="rounded-full object-cover mt-[2px]" />
                  </div>
                  <div>
                    <div className="flex flex-col ml-2">
                      <div className="flex">
                        <div className="text-sm font-semibold ml-1">{comment.name}</div>
                        <div className="text-sm ml-2 col w-96 overflow-hidden overflow-ellipsis whitespace-nowrap">
                          {comment.content}
                        </div>
                      </div>

                      <div className="text-xs text-gray-400 ml-1 mt-1">{comment.day}</div>
                    </div>
                  </div>
                </div>

                {/* Move this to the end of the flex container */}
                <AiOutlineHeart className="text-2xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className=" mb-36">
        <Divider width="200px" />
      </div>
    </div>
  );
};

export default HomePage;
