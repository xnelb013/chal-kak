import { useEffect } from "react";
import { apiInstance } from "../api/api";
import { useRecoilState } from "recoil";
import { followingPostsState } from "@/utils/atoms";
import Cookies from "js-cookie";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useRouter } from "next/router";

const Following = () => {
  const [followingPosts, setFollowingPosts] = useRecoilState(followingPostsState);
  const accessToken = Cookies.get("accessToken");
  const router = useRouter();

  const handleClickLike = (postId: number, likeCount: number, liked: boolean) => {
    if (postId) {
      apiInstance({
        method: "get",
        url: `like/posts/${postId}`,
      })
        .then(() => {
          const updatePosts = followingPosts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                likeCount: likeCount + 1,
                liked: !liked,
              };
            }
            return post;
          });
          setFollowingPosts(updatePosts);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleClickUnlike = (postId: number, likeCount: number, liked: boolean) => {
    if (postId) {
      apiInstance({
        method: "delete",
        url: `like/posts/${postId}`,
      })
        .then(() => {
          const updatePosts = followingPosts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                likeCount: likeCount - 1,
                liked: !liked,
              };
            }
            return post;
          });
          setFollowingPosts(updatePosts);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    const isLogin = Cookies.get("isLoggedIn");
    if (!isLogin) {
      router.push("/login");
    } else {
      const fetchFollowingPosts = async () => {
        try {
          const followingPostsRes = await apiInstance.get("/filter/following");
          // 팔로우한 사람들이 작성한 게시글을 업데이트
          setFollowingPosts(followingPostsRes.data.data.posts);
        } catch (error) {
          alert("조회에 실패하였습니다." + error);
        }
      };
      fetchFollowingPosts();
    }
  }, [accessToken]);

  return (
    <div className="w-full h-full bg-white">
      <div className="mx-auto">
        <div className="flex items-center justify-start border-b pb-2">
          <button className="mr-4 ml-6 text-lg font-semibold">팔로잉</button>
          <button className="text-lg text-gray-400" onClick={() => router.push("/main")}>
            추천
          </button>
        </div>
        {followingPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10">
            <p className="text-gray-400 mt-2">팔로우한 사람이 없습니다.</p>
          </div>
        )}
        <div style={{ columnCount: 2, columnGap: "1rem", padding: "0 1rem" }} className="mt-4">
          {followingPosts.map((post) => (
            <div style={{ breakInside: "avoid", margin: "auto" }} key={post.id}>
              <div className="flex flex-col items-center justify-center">
                <img
                  src={post.thumbnail}
                  alt="post-img"
                  style={{ objectFit: "cover", height: "100%" }}
                  className="rounded-lg"
                  onClick={() => router.push(`/posts/${post.id}`)}
                />
                <div className="flex flex-row items-center justify-between w-full gap-1 mb-2 mt-2 ml-4">
                  <div className="flex flex-row items-center justify-start">
                    <div className="avatar">
                      <div className="w-8 h-8 rounded-full" onClick={() => router.push(`/userinfo/${post.writer.id}`)}>
                        <img src={post.writer.profileImg} alt="profile-img" />
                      </div>
                    </div>
                    <div className="ml-2">
                      <p className="text-xs text-slate-700">{post.writer.nickname}</p>
                    </div>
                  </div>
                  <div className="flex flex-row items-center mr-4">
                    {post.liked === false && (
                      <div className="relative" onClick={() => handleClickLike(post.id, post.likeCount, post.liked)}>
                        <AiOutlineHeart className="mr-1 cursor-pointer text-red-500" />
                      </div>
                    )}
                    {post.liked === true && (
                      <div className="relative" onClick={() => handleClickUnlike(post.id, post.likeCount, post.liked)}>
                        <AiFillHeart className="mr-1 cursor-pointer text-red-500" />
                      </div>
                    )}
                    {post.likeCount}
                  </div>
                </div>
                <div className="flex flex-col justify-start mb-10 w-full">
                  <div className="text-sm">{post.content}</div>
                  <div className="items-start mt-2 whitespace-pre-wrap break-all">
                    {post.hashTags.map((tag) => (
                      <span key={tag} className="text-xs inline-block mr-1">{`#${tag}`}</span>
                    ))}
                    {post.styleTags.map((tag) => (
                      <span key={tag} className="text-xs inline-block mr-1">{`#${tag}`}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Following;
