import Image from "next/image";
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
import Head from "next/head";
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

const HomePage = () => {
  const [postData, setPostData] = useState<Post | null>(null);
  const [commentsModalIsOpen, setcommentsModalIsOpen] = useState(false);
  const [heartsModalIsOpen, setHeartsModalIsOpen] = useState(false);
  const [shareModalIsOpen, setShareModalIsOpen] = useState(false);
  const [isWriter, setIsWriter] = useState(false);
  const [isLike, setIsLike] = useState(postData?.liked || false);
  const [isFollow, setIsFollow] = useState(postData?.liked || false);
  const [likeCount, setLikeCount] = useState(postData?.likeCount || 0);
  const [loading, setLoading] = useState(true);
  const [isLogined, setIsLogined] = useState(true);
  const [alertOepn, setAlertOpen] = useState(false);
  const [deleteAlertModal, setDeleteAlertOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const [postImages, setPostImages] = useState<string[] | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const accessToken = Cookies.get("accessToken");
  const userId = Cookies.get("userId");
  const writerSrc = postData?.writer.profileImg || "/images/defaultImg.jpg";
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
          alert("There was an error!" + error);
          if (error.response.data.message === "존재하지 않는 게시글 번호입니다.") router.push("/404");
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
    if (!postId || isProcessing) return;

    setIsProcessing(true);

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
      })
      .finally(() => setIsProcessing(false));
  };

  // 좋아요 취소 클릭
  const handleClickUnlike = () => {
    if (!postId || isProcessing) return;

    setIsProcessing(true);

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
      })
      .finally(() => setIsProcessing(false));
  };

  // 팔로우 버튼 클릭
  const handleClickFollowBtn = () => {
    if (postData?.writer.id === Number(userId)) {
      setAlertMessage("자신을 팔로우할 수 없습니다!");
      setAlertOpen(true);
      return;
    }

    if (!postId || isProcessing) return;

    setIsProcessing(true);

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
          console.error("There was an error!" + error);

          redirectToLogin();
        })
        .finally(() => setIsProcessing(false));
    }
  };
  // 언팔로우 버튼 클릭
  const handleClickUnfollowBtn = () => {
    if (!postId || isProcessing) return;

    setIsProcessing(true);
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
          alert("There was an error!" + error);
          redirectToLogin();
        })
        .finally(() => setIsProcessing(false));
    }
  };

  const handleDeletePost = (postId: number) => {
    apiInstance({
      method: "patch",
      url: `posts/${postId}/delete`,
    })
      .then(() => {
        setAlert({ open: true, message: "게시물 삭제가 완료되었습니다!" });
        router.push("/main");
      })
      .catch((error) => {
        alert("There was an error!" + error);
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
        <div className="relative" onClick={isProcessing ? undefined : handleClickUnlike}>
          <AiFillHeart className="md:text-4xl text-3xl mr-2 cursor-pointer text-red-600" />
        </div>
      );
    } else {
      // isLike가 false일 때
      return (
        <div className="relative" onClick={isProcessing ? undefined : handleClickLike}>
          <AiOutlineHeart className="md:text-4xl text-3xl mr-2 cursor-pointer" />
        </div>
      );
    }
  };

  // 팔로우 버튼을 보여주는 함수
  const renderFollowButton = () => {
    if (isFollow) {
      // isFollow가 true일 때
      return (
        <button
          className="btn btn-neutral md:btn-sm btn-xs md:h-10 h-8"
          onClick={isProcessing ? undefined : handleClickUnfollowBtn}
        >
          언팔로우
        </button>
      );
    } else {
      // isFollow가 false일 때
      return (
        <button className="btn btn-sm h-10" onClick={isProcessing ? undefined : handleClickFollowBtn}>
          팔로우
        </button>
      );
    }
  };

  const moveToProfilePage = () => {
    router.push(`/userinfo/${postData?.writer.id}`);
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
      <Head>
        <title>게시글 - {postId}</title>
        <meta name="description" content="게시글 페이지입니다." />
      </Head>
      <Alert open={alertOepn} setOpen={setAlertOpen} message={alertMessage} />
      <div className=" flex flex-col mt-6">
        <div className=" flex items-center w-full mx-auto">
          <div className="flex items-center">
            <div className="relative md:w-12 md:h-12 w-10 h-10 cursor-pointer" onClick={moveToProfilePage}>
              <Image src={writerSrc} alt="프로필 사진" layout="fill" className="rounded-full object-cover" />
            </div>
            <div className="ml-3">
              <div className="flex">
                <div className="font-semibold cursor-pointer text-sm md:text-base" onClick={moveToProfilePage}>
                  {postData?.writer.nickname}
                </div>
                <div className="ml-3">
                  {postData?.privacyHeight && (
                    <div className="flex items-center">
                      <div className="border w-20 text-center py-[2px] mt-[1.6px] rounded-full bg-slate-100 text-[10px] text-gray-500">
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
                className="dropdown-content z-[5] menu p-2 shadow bg-base-100 rounded-box w-20 absolute top-7 left-[-44px] text-center"
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
            <div className="text-center ml-auto"> {renderFollowButton()}</div>
          )}
        </div>
        <div className="h-[960px]">
          <Carousel
            settings={{
              slidesToShow: 1,
              speed: 300,
              arrows: true,
              dots: true,
              infinite: false,
              centerMode: true,
              centerPadding: "0px", // Add this line
              lazyLoad: "ondemand",
            }}
          >
            {postImages &&
              postImages.map((image, index) => (
                <div
                  key={index}
                  className="w-full md:h-[960px]  sm:h-[700px] h-[500px] max-w-[720px] bg-gray-100 mt-4 flex items-center justify-center relative overflow-hidden"
                >
                  <Image
                    src={image}
                    alt={`Post Image ${index}`}
                    width={720}
                    height={960}
                    priority={index === 0}
                    quality={80}
                    layout="responsive"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
                  />
                </div>
              ))}
          </Carousel>
        </div>
        <div className="flex items-center justify-between w-full mx-auto mt-1-">
          <div className="flex flex-1">
            {renderLikeIcon()}
            <div onClick={openCommentsModal} className="relative cursor-pointer">
              <AiOutlineComment className="md:text-4xl text-3xl" />
            </div>
            <CommentsModal isOpen={commentsModalIsOpen} closeModal={closeCommentsModal} postId={postId} />
          </div>
          <div onClick={openShareModal} className=" w-7 h-7 cursor-pointer relative">
            <BiLinkExternal className="md:text-3xl text-2xl cursor-pointer" />
          </div>
          <ShareModal isOpen={shareModalIsOpen} closeModal={closeShareModal} />
        </div>
        <div>
          <div className=" w-full">
            <div className="flex mt-2 cursor-pointer md:text-base text-sm" onClick={openHeartsModal}>
              좋아요 <div className="font-bold ml-1">{likeCount}</div>개
            </div>
            <div className="mt-2 w-full md:text-lg text-base">{postData?.content}</div>
            <div className="flex flex-wrap mt-4 md:text-sm text-xs cursor-pointer w-full text-gray-500">
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
          <div className="text-xs text-gray-500 mr-7 mt-2 text-end">
            {postData?.createdAt ? formatDateToRelativeTime(postData.createdAt) : ""}
          </div>
          <Divider width="11rem" />
        </div>
        <InfoAlert />
      </div>
    </>
  );
};

export default HomePage;
