import Image from "next/image";
import profileImg from "./img/프로필사진.jpg";
import Carousel from "../components/Carousel";
import { AiOutlineHeart, AiOutlineComment, AiFillHeart } from "react-icons/ai";
import { GrMore } from "react-icons/gr";
import { BiLinkExternal } from "react-icons/bi";
import Divider from "../components/Divider";
import { useEffect, useState } from "react";
import HeartsModal from "./HeartsModal";
import ShareModal from "./ShareModal";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import CommentsSection from "./CommentSection";
import { apiInstance } from "../api/api";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import CommentsModal from "./CommentsModal";
import Alert from "../components/Alert";
import WarningAlert from "../components/WarningAlert";
import { useSetRecoilState } from "recoil";
import { alertState } from "@/utils/atoms";
import InfoAlert from "../components/InfoAlert";
import SkeletonPost from "../components/SkeletonPost";
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
  seasonTags: string[];
  weatherTags: string[];
  postPhotos?: PostPhoto[];
  liked: boolean;
  following: boolean;
  viewCount: number;
  createdAt: string;
  writer: Writer;
}

interface PostPhoto {
  id: number;
  name: string;
  order: number;
  url: string;
}

const img = profileImg;
const HomePage = () => {
  const [postData, setPostData] = useState<Post | null>(null);
  const [commentsModalIsOpen, setcommentsModalIsOpen] = useState(false);
  const [heartsModalIsOpen, setHeartsModalIsOpen] = useState(false);
  const [shareModalIsOpen, setShareModalIsOpen] = useState(false);
  const [isWriter, setIsWriter] = useState(false);
  const [isLike, setIsLike] = useState(postData?.liked || false);
  const [isFollow, setIsFollow] = useState(postData?.liked || false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLogined, setIsLogined] = useState(true);
  const [alertOepn, setAlertOpen] = useState(false);
  const [deleteAlertModal, setDeleteAlertOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const [postImages, setPostImages] = useState<string[] | undefined>(undefined);
  const accessToken = Cookies.get("accessToken");
  const userId = Cookies.get("userId");
  const writerSrc = postData?.writer.profileImg || img;
  const router = useRouter();
  const { postId } = router.query;
  const setAlert = useSetRecoilState(alertState);

  useEffect(() => {
    if (typeof postId === "string") {
      setCurrentPostId(parseInt(postId));
    }
  }, [postId]);

  const openCommentsModal = () => {
    setcommentsModalIsOpen(true);
  };

  const closeCommentsModal = () => {
    setcommentsModalIsOpen(false);
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
    if (accessToken && userId) {
      setIsLogined(true);
    } else {
      setIsLogined(false);
    }
  }, [accessToken, userId]);

  // 데이터 받아오기
  useEffect(() => {
    if (postId) {
      apiInstance({
        method: "get",
        url: `posts/${postId}`,
      })
        .then((response) => {
          setPostData(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("There was an error!", error);
          setLoading(false);
        });
    }
  }, [postId]);

  // 초기값 설정
  useEffect(() => {
    setIsLike(postData?.liked || false);
    setIsFollow(postData?.following || false);
    setLikeCount(postData?.likeCount || 0);
    if (userId == postData?.writer.id) {
      setIsWriter(true);
    }
    if (postData?.postPhotos) {
      setPostImages(postData.postPhotos.map((photo: PostPhoto) => photo.url));
    }
  }, [postData]);

  //로그인 페이지로 이동
  const redirectToLogin = () => {
    router.push("/login");
  };

  // 좋아요 클릭
  const handleClickLike = () => {
    if (postId) {
      apiInstance({
        method: "get",
        url: `like/posts/${postId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(() => {
          setIsLike(true);
          setLikeCount(likeCount + 1);
        })
        .catch((error) => {
          console.error("There was an error!", error);
          redirectToLogin();
        });
    }
  };

  // 좋아요 취소 클릭
  const handleClickUnlike = () => {
    if (postId) {
      apiInstance({
        method: "delete",
        url: `like/posts/${postId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(() => {
          setIsLike(false);
          setLikeCount(likeCount - 1);
        })
        .catch((error) => {
          console.error("There was an error!", error);
          redirectToLogin();
        });
    }
  };

  // 팔로우 버튼 클릭
  const handleClickFollowBtn = () => {
    if (postData?.writer.id === Number(userId)) {
      setAlertMessage("자신을 팔로우할 수 없습니다!");
      setAlertOpen(true);
      return;
    }
    if (postId) {
      apiInstance({
        method: "get",
        url: `follow/${postData?.writer.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(() => {
          // API 호출이 성공했을 때 setIsFollow(true) 실행
          setIsFollow(true);
        })
        .catch((error) => {
          console.error("There was an error!", error);

          redirectToLogin();
        });
    }
  };
  // 언팔로우 버튼 클릭
  const handleClickUnfollowBtn = () => {
    if (postId) {
      apiInstance({
        method: "delete",
        url: `follow/${postData?.writer.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(() => {
          setIsFollow(false);
        })
        .catch((error) => {
          console.error("There was an error!", error);
          redirectToLogin();
        });
    }
  };

  const handleDeletePost = (postId: number) => {
    apiInstance({
      method: "patch",
      url: `posts/${postId}/delete`,
    })
      .then(() => {
        setAlert({ open: true, message: "게시물 작성이 완료되었습니다!" });
        router.push("/main");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const openDeleteAlert = () => {
    setDeleteAlertOpen(true); // 알림창 열기
  };

  // 좋아요 아이콘을 보여주는 함수
  const renderLikeIcon = () => {
    if (isLike) {
      // isLike가 true일 때
      return (
        <div className="relative" onClick={handleClickUnlike}>
          <AiFillHeart className="text-4xl mr-2 cursor-pointer text-red-600" />
        </div>
      );
    } else {
      // isLike가 false일 때
      return (
        <div className="relative" onClick={handleClickLike}>
          <AiOutlineHeart className="text-4xl mr-2 cursor-pointer" />
        </div>
      );
    }
  };

  // 팔로우 버튼을 보여주는 함수
  const renderFollowButton = () => {
    if (isFollow) {
      // isFollow가 true일 때
      return (
        <button className="btn btn-neutral btn-sm h-[40px]" onClick={handleClickUnfollowBtn}>
          언팔로우
        </button>
      );
    } else {
      // isFollow가 false일 때
      return (
        <button className="btn btn-sm h-[40px]" onClick={handleClickFollowBtn}>
          팔로우
        </button>
      );
    }
  };

  function formatDateToRelativeTime(dateString: string | number | Date) {
    const date = new Date(dateString);

    return formatDistanceToNow(date, { addSuffix: true, locale: ko });
  }

  if (loading)
    return (
      <div>
        <SkeletonPost />
      </div>
    );

  return (
    <>
      <Alert open={alertOepn} setOpen={setAlertOpen} message={alertMessage} />
      <div className=" flex flex-col mt-6">
        <div className=" flex items-center w-[680px] mx-auto">
          <div className="flex items-center">
            <div className="relative w-12 h-12">
              <Image src={writerSrc} alt="프로필 사진" layout="fill" className="rounded-full object-cover" />
            </div>
            <div className="ml-3">
              <div className="flex">
                <div className=" font-semibold">{postData?.writer.nickname}</div>
                <div className="ml-3">
                  {postData?.privacyHeight && (
                    <div className="flex items-center">
                      <div className="border w-[90px] text-center py-[2px] mt-[1.6px] rounded-full bg-slate-100 text-[10px] text-gray-500">
                        {postData?.writer.height}cm · {postData?.writer.weight}kg
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-gray-500 text-sm">
                {postData?.location && <div className="text-[12px]">{postData?.location}</div>}
              </div>
            </div>
          </div>

          {isWriter && isLogined ? (
            <div className="dropdown dropdown-end relative ml-auto">
              <label tabIndex={0} className="cursor-pointer ">
                <GrMore />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[5] menu p-2 shadow bg-base-100 rounded-box w-[80px] absolute top-7 left-[-44px] text-center"
              >
                <li onClick={() => router.push(`/postEditor/${postId}`)}>
                  <a>수정</a>
                </li>
                <li onClick={openDeleteAlert}>
                  <a className="text-red-600 hover:text-red-600">삭제</a>
                </li>
              </ul>
            </div>
          ) : (
            <div className="w-[80px] text-center ml-auto"> {renderFollowButton()}</div>
          )}
        </div>

        <Carousel
          settings={{
            slidesToShow: 1,
            speed: 300,
            arrows: true,
            dots: true,
            infinite: false,
            centerMode: true,
            centerPadding: "0px",
          }}
        >
          {postImages &&
            postImages.map((image, index) => (
              <div
                key={index}
                className="w-[720px] h-[960px] min-w-[720px] bg-gray-200 mt-4 flex items-center justify-center relative overflow-hidden"
              >
                <Image
                  src={image}
                  alt={`Post Image ${index}`}
                  width={720}
                  height={960}
                  quality={100}
                  layout="responsive"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                />
              </div>
            ))}
        </Carousel>
        <div className="flex items-center justify-between w-[680px] mx-auto mt-1-">
          <div className="flex flex-1">
            {renderLikeIcon()}
            <div onClick={openCommentsModal} className="relative cursor-pointer">
              <AiOutlineComment className="text-4xl" />
            </div>
            <CommentsModal isOpen={commentsModalIsOpen} closeModal={closeCommentsModal} postId={postId} />
          </div>
          <div onClick={openShareModal} className=" w-7 h-7 cursor-pointer relative">
            <BiLinkExternal className="text-3xl cursor-pointer" />
          </div>
          <ShareModal isOpen={shareModalIsOpen} closeModal={closeShareModal} />
        </div>
        <div>
          <div className="w-[120px]" onClick={openHeartsModal}>
            <div className="flex ml-5 mt-2 cursor-pointer">
              좋아요 <div className="font-bold ml-1">{likeCount}</div>개
            </div>
            <div className="mt-5 ml-5 w-[660px] text-lg">{postData?.content}</div>
            <div className="flex ml-5 mt-2 cursor-pointer w-[600px] text-gray-500">
              {postData?.styleTags.map((tag, index) => (
                <div className="mr-1" key={index}>
                  #{tag}
                </div>
              ))}
              {postData?.hashTags.map((tag, index) => (
                <div className="mr-1" key={index}>
                  #{tag}
                </div>
              ))}
              <div className="mr-1">#{postData?.seasonTags}</div>
              <div className="mr-1">#{postData?.weatherTags}</div>
            </div>
          </div>
        </div>
        <WarningAlert
          open={deleteAlertModal}
          setOpen={setDeleteAlertOpen}
          message="정말로 삭제하시겠습니까?"
          onConfirm={handleDeletePost}
          id={currentPostId}
        />
        <HeartsModal isOpen={heartsModalIsOpen} closeModal={closeHeartsModal} postId={postId} />
        <div className=" mb-36">
          <CommentsSection postId={postId} />
          <div className="text-xs text-gray-400 mr-7 mt-[10px] text-end">
            {postData?.createdAt ? formatDateToRelativeTime(postData.createdAt) : ""}
          </div>
          <Divider width="200px" />
        </div>
        <InfoAlert />
      </div>
    </>
  );
};

export default HomePage;
