import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { apiInstance } from "../api/api";
import Cookies from "js-cookie";
import { useRecoilState } from "recoil";
import { userPostsState } from "@/utils/atoms";
import { LiaUserCircleSolid } from "react-icons/lia";
import dynamic from "next/dynamic";
import FollowerModal from "./FollowerModal";
import FollowingModal from "./FollowingModal";
import { GetServerSidePropsContext } from "next";
import { followerResType, followingResType, userDetailType } from "@/utils/type";

interface UserInfoProps {
  followingListData: followingResType;
  followerListData: followerResType;
  userinfoData: userDetailType;
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const userId = context.params?.userId;
  const followingListRes = await apiInstance.get(`/follow/${userId}/pageFollowing`);
  const followerListRes = await apiInstance.get(`/follow/${userId}/pageFollower`);
  const userinfoRes = await apiInstance.get(`/users/details/${userId}`);

  return {
    props: {
      followerListData: followerListRes.data.data,
      followingListData: followingListRes.data.data,
      userinfoData: userinfoRes.data.data,
    },
  };
};

export default function UserInfo(props: UserInfoProps): JSX.Element {
  const [userPosts, setUserPosts] = useRecoilState(userPostsState);
  const [isOpenFollowerModal, setIsOpenFollowerModal] = useState<boolean>(false);
  const [isOpenFollowingModal, setIsOpenFollowingModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasPosts, setHasPosts] = useState<boolean>(false);
  const curUserId = Cookies.get("userId");
  const router = useRouter();
  const { userId } = router.query;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [, setIsFollow] = useState<boolean>(false);
  const isLogin = Cookies.get("isLoggedIn");
  console.log(typeof isLogin);

  // 사용자 작성 게시글 조회 api (initial)
  useEffect(() => {
    // const { userId } = router.query;
    const fetchUserPosts = async () => {
      try {
        const userPostsRes = await apiInstance.get(`/users/${userId}/posts?page=0&size=3`);
        setUserPosts(userPostsRes.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserPosts();
  }, [userId]);

  // 팔로잉 검증 api
  useEffect(() => {
    const fetchIsFollowing = async () => {
      try {
        const isFollowingRes = await apiInstance.get(`/follow/${userId}/validateFollow`);
        setIsFollowing(isFollowingRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchIsFollowing();
  }, [userId]);

  // 팔로우 요청 api
  const followUser = async () => {
    try {
      const followUserRes = await apiInstance.get(`/follow/${userId}`);
      if (followUserRes.data.data === true) {
        setIsFollow(true);
        setIsFollowing(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 언팔로우 요청 api
  const unfollowUser = async () => {
    try {
      const unfollowUserRes = await apiInstance.delete(`/follow/${userId}`);
      if (unfollowUserRes.data.data === true) {
        setIsFollow(false);
        setIsFollowing(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   const handleIntersection = async (entries: IntersectionObserverEntry[]) => {
  //     const entry = entries[0];
  //     if (entry.isIntersecting && hasPosts && !isLoading) {
  //       try {
  //         setIsLoading(true);
  //         const nextPage = userPosts.currentPage + 1;
  //         const userPostsRes = await apiInstance.get(`/users/${userId}/posts?page=${nextPage}&size=6`);
  //         const newPosts = userPostsRes.data.data.posts;
  //         if (newPosts.length > 0) {
  //           setUserPosts((prev) => ({
  //             ...prev,
  //             posts: [...prev.posts, ...userPostsRes.data.data.posts],
  //           }));
  //         } else {
  //           setHasPosts(false);
  //         }
  //       } catch (err) {
  //         console.log(err);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }
  //   };

  //   observerRef.current = new IntersectionObserver(handleIntersection, { threshold: 0.5 });

  //   if (observerRef.current && props.userinfoData.postsCount > 0) {
  //     observerRef.current.observe(document.getElementById("scroll-trigger") as Element);
  //   }

  //   return () => {
  //     if (observerRef.current) observerRef.current.disconnect();
  //   };
  // }, [props.userinfoData.postsCount, hasPosts, isLoading, userPosts.currentPage]);

  useEffect(() => {
    const handleIntersection = async (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasPosts && !isLoading) {
        try {
          setIsLoading(true);
          const nextPage = userPosts.currentPage + 1;
          const userPostsRes = await apiInstance.get(`/users/${userId}/posts?page=${nextPage}&size=6`);
          const newPosts = userPostsRes.data.data.posts;
          if (newPosts.length > 0) {
            setUserPosts((prev) => ({
              ...prev,
              currentPage: nextPage,
              posts: [...prev.posts, ...userPostsRes.data.data.posts],
            }));
          } else {
            setHasPosts(false);
          }
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, { threshold: 0.5 });

    if (observerRef.current && props.userinfoData.postsCount > 0) {
      observerRef.current.observe(document.getElementById("scroll-trigger") as Element);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [props.userinfoData.postsCount, hasPosts, isLoading, userPosts.currentPage]);

  // follower 모달 handler
  const openFollowerModal = () => {
    setIsOpenFollowerModal(true);
  };
  const closeFollowerModal = () => {
    setIsOpenFollowerModal(false);
  };

  // following 모달 handler
  const openFollowingModal = () => {
    setIsOpenFollowingModal(true);
  };
  const closeFollowingModal = () => {
    setIsOpenFollowingModal(false);
  };

  // 사용자 정보 수정 페이지로 이동
  const moveToModifyPage = () => {
    router.push(`/modify-userinfo/${userId}`);
  };
  const DynamicBtn = dynamic(() => import("../modify-userinfo/ModifyButton"), { ssr: false });
  const { posts } = userPosts;

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="flex flex-col w-full items-center mt-[10px]">
        <div className="flex flex-col items-center gap-2 w-full h-[250px]  rounded-lg">
          <div className="flex flex-row items-center justify-around w-auto h-[200px] gap-10 mt-2">
            <div className="avatar">
              <div className="w-32 rounded-full">
                {!props.userinfoData.profileImg && <LiaUserCircleSolid className="w-32 h-32" />}
                {props.userinfoData.profileImg && <img src={props.userinfoData.profileImg} alt="profile-img" />}
              </div>
            </div>
            <div className="flex flex-col gap-10 items-center p-5">
              <div className="flex flex-row items-center justify-center">
                <div className="text-lg font-semibold ml-3 text-black">@{props.userinfoData.nickname}</div>
                {curUserId === userId && <DynamicBtn moveToModifyPage={moveToModifyPage} />}
              </div>
              <div className="flex flex-row justify-between items-center gap-10 ">
                <div className="flex flex-col items-center text-sm text-black">
                  <p>게시글</p>
                  {props.userinfoData.postsCount}
                </div>
                <div
                  className="flex flex-col items-center cursor-pointer text-sm text-black"
                  onClick={openFollowerModal}
                >
                  <p>팔로워</p>
                  {props.userinfoData.followerCount}
                </div>
                {isOpenFollowerModal && (
                  <FollowerModal
                    initialFollowerData={props.followerListData}
                    isOpen={isOpenFollowerModal}
                    handleCloseModal={closeFollowerModal}
                  />
                )}
                <div
                  className="flex flex-col items-center cursor-pointer text-sm text-black"
                  onClick={openFollowingModal}
                >
                  <p>팔로잉</p>
                  {props.userinfoData.followingCount}
                </div>
                {isOpenFollowingModal && (
                  <FollowingModal
                    initialFollowingData={props.followingListData}
                    isOpen={isOpenFollowingModal}
                    handleCloseModal={closeFollowingModal}
                  />
                )}
              </div>
            </div>
          </div>
          {isLogin === "true" && curUserId !== userId && (
            <div className="flex items-center justify-center mb-6">
              {isFollowing ? (
                <button
                  className="btn btn-sm ml-4 bg-[#efefef] w-[125px] font-medium rounded-lg text-black"
                  onClick={unfollowUser}
                >
                  언팔로우
                </button>
              ) : (
                <button
                  className="btn btn-sm ml-4 bg-[#efefef] w-[125px] font-medium rounded-lg text-black"
                  onClick={followUser}
                >
                  팔로우
                </button>
              )}
            </div>
          )}
        </div>
        <div className="mt-[10px] pt-2 border-t-2 w-full">
          <div className="w-3/4 h-[600px] overflow-y-auto mx-auto">
            <div className="flex flex-row flex-wrap justify-start gap-x-2 gap-y-2">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="w-40 h-40 cursor-pointer"
                  onClick={() => router.push(`/posts/${post.id}`)}
                >
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <img
                      src={post.thumbnail}
                      alt="post.img"
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
              ))}
            </div>{" "}
            <div id="scroll-trigger" style={{ position: "fixed", bottom: 0, height: 1 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
