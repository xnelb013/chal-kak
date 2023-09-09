import React, { useEffect, useState, useRef } from "react";
// import Carousel from "../components/Carousel";
import Weather from "../components/Weather";
// import { seasonState, weatherState } from "@/utils/atoms";
// import Image from 'next/image'
import ScrollTopButton from "../components/ScrollTopButton";
import GoToPostEditorButton from "./GoToPostEditorButton";
import BodyShapeModal from "./BodyShapeModal";
import { apiInstance } from "../api/api";
import { useRecoilValue } from "recoil";
import { styleTagsState } from "@/utils/atoms";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { userState } from "@/utils/atoms";
import { useRouter } from "next/router";

interface User {
  height: number;
  weight: number;
  styleTagIds: number[];
}

type Writer = {
  id: number;
  nickname: string;
  profileImg?: string;
};

type Post = {
  currentPage: number;
  totalPage: number;
  totalElements: number;
  id: number;
  content: string;
  location: string;
  viewCount: number;
  likeCount: number;
  liked: boolean;
  styleTags: string[];
  hashTags: string[];
  writer: Writer;
  thumbnail: string;
};

// 날씨 기반 스타일 추천 캐러셀
// const CarouselContent: React.FC<{ imageUrl: string }> = ({ imageUrl }) => (
//     <div className="bg-white flex flex-direction-row cursor-pointer overflow-hidden">
//         <Image src={imageUrl} alt="sample" className="w-full h-64 object-cover" width={768} height={1024}/>
//     </div>
// );

const Main = () => {
  // const season = useRecoilValue(seasonState);
  // const weather = useRecoilValue(weatherState);
  const router = useRouter();
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [pageParam, setPageParam] = useState(0);
  const styleTags = useRecoilValue(styleTagsState); // recoil 에서 가져온 전체 스타일 태그 목록
  const [isModalOpen, setIsModalOpen] = useState(false);
  const loggedInUser = useRecoilValue(userState);

  const [user, setUser] = useState<User>({
    height: loggedInUser.height,
    weight: loggedInUser.weight,
    styleTagIds: loggedInUser.styleTags,
  });
  const [selectedStyleTags, setSelectedStyleTags] = useState<number[]>(user.styleTagIds || []);
  const [inputHeight, setInputHeight] = useState<number | null>(null);
  const [inputWeight, setInputWeight] = useState<number | null>(null);
  const [isMySizeApplied, setIsMySizeApplied] = useState(false);

  // 키워드 나열 계절과 날씨 제외
  const styleTagsList = styleTags.filter((tag) => tag.category !== "SEASON" && tag.category !== "WEATHER");

  const handleNavigation = () => {
    router.push("/following");
  };

  // 게시글 api
  const fetchPosts = async ({ pageParam = 0 }) => {
    try {
      const response = await apiInstance.post(`filter?page=${pageParam}&size=4`, {
        height: user.height,
        weight: user.weight,
        styleTagIds: selectedStyleTags,
      });
      setFilteredPosts((prevPosts) => [...prevPosts, ...response.data.data.posts]);
    } catch (error) {
      console.error(error);
    }
  };

  // 특정 DOM 요소의 (loading) 페이지의 마지막 부분을 참조
  const loadingRef = useRef<HTMLDivElement | null>(null);

  // 특정 요소가 화면에 보이는지 감시, 페이지 마지막 부분이 보이면 새로운 데이터 렌더링
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPageParam((prevPageParam) => prevPageParam + 1);
        }
      },
      { threshold: 1 }, //페이지 하단에 있는 로딩 컴포넌트(loadingRef.current) 전체가 화면에 보일 때 새로운 페이지 데이터를 불러오도록 설정
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      // cleanup 현재 관찰 중인 요소에 대한 관찰을 중지
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [loadingRef]);

  // user 상태 업데이트
  useEffect(() => {
    setUser({
      height: loggedInUser.height,
      weight: loggedInUser.weight,
      styleTagIds: loggedInUser.styleTags,
    });
  }, [loggedInUser]);

  // 페이지에 들어오자마자 데이터가 다 보여짐
  useEffect(() => {
    fetchPosts({ pageParam });
  }, [pageParam]);

  // 필터링 조건이 변경될 때는 게시물 목록을 초기화
  useEffect(() => {
    setPageParam(0);
    setFilteredPosts([]);
    fetchPosts({ pageParam: 0 });
  }, [selectedStyleTags, inputHeight, inputWeight]);

  useEffect(() => {
    setSelectedStyleTags(user.styleTagIds);
    console.log(selectedStyleTags);
  }, [user]);

  // // 로그인 유저의 마이사이즈 불러오기, 사용자가 커스텀으로 설정할때
  // useEffect(() => {
  //   if (loggedInUser.isLoggedIn) {
  //     if (isMySizeApplied) {
  //       // '마이사이즈 적용' 버튼을 클릭한 경우
  //       setUser({
  //         height: loggedInUser.height,
  //         weight: loggedInUser.weight,
  //         styleTagIds: loggedInUser.styleTags,
  //       });
  //     } else if (inputHeight !== null && inputWeight !== null) {
  //       // 사용자가 직접 키와 몸무게 값을 입력한 경우
  //       setUser({
  //         ...user,
  //         height: inputHeight,
  //         weight: inputWeight,
  //       });
  //     }
  //   } else {
  //     if (inputHeight !== null && inputWeight !== null) {
  //       // 비로그인 상태에서 사용자가 직접 키와 몸무게 값을 입력한 경우
  //       setUser({
  //         ...user,
  //         height: inputHeight,
  //         weight: inputWeight,
  //       });
  //     }
  //   }
  // }, [loggedInUser, isMySizeApplied, inputHeight, inputWeight]);

  useEffect(() => {
    if (loggedInUser.isLoggedIn && isMySizeApplied) {
      // '마이사이즈 적용' 버튼을 클릭한 경우
      setUser({
        height: loggedInUser.height,
        weight: loggedInUser.weight,
        styleTagIds: loggedInUser.styleTags,
      });
    }

    if (inputHeight !== null && inputWeight !== null) {
      // 사용자(로그인 유저 또는 비로그인 유저)가 직접 키와 몸무게 값을 입력한 경우
      setUser({
        ...user,
        height: inputHeight,
        weight: inputWeight,
      });
    }
  }, [loggedInUser, isMySizeApplied, inputHeight, inputWeight]);

  // 키워드 버튼 선택 해제
  const handleDeleteTag = (tagId: number) => {
    setSelectedStyleTags(selectedStyleTags.filter((id) => id !== tagId));
  };

  // 키워드 버튼 추가 선택
  const handleAddTag = (tagId: number) => {
    if (!selectedStyleTags.includes(tagId)) {
      setSelectedStyleTags([...selectedStyleTags, tagId]);
    }
  };

  // 전체 키워드 버튼 클릭
  const handleAllTag = () => {
    setSelectedStyleTags([]); // 모든 선택된 태그 해제
    fetchPosts({ pageParam: 0 });
  };

  const handleBodyClick = () => {
    setIsModalOpen(true);
    setIsMySizeApplied(true);
  };

  // 체형 모달 적용하기
  const handleApply = (height: number, weight: number) => {
    setInputHeight(height);
    setInputWeight(weight);

    // 로그인 여부와 관계없이 isMySizeApplied를 true로 설정
    setIsMySizeApplied(true);
  };

  const handleClickLike = (postId: number, likeCount: number, liked: boolean) => {
    if (postId) {
      apiInstance({
        method: "get",
        url: `like/posts/${postId}`,
      })
        .then(() => {
          const updatePosts = filteredPosts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                likeCount: likeCount + 1,
                liked: !liked,
              };
            }
            return post;
          });
          setFilteredPosts(updatePosts);
        })
        .catch((err) => {
          console.log(err);
          // router.push("/login");
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
          const updatePosts = filteredPosts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                likeCount: likeCount - 1,
                liked: !liked,
              };
            }
            return post;
          });
          setFilteredPosts(updatePosts);
        })
        .catch((err) => {
          console.log(err);
          // router.push("/login");
        });
    }
  };

  // 좋아요 아이콘을 보여주는 함수
  const renderLikeIcon = (post: Post) => {
    console.log(post);
    if (post.liked) {
      // isLike가 true일 때
      return (
        <button className="mb-2" onClick={() => handleClickUnlike(post.id, post.likeCount, post.liked)}>
          <AiFillHeart className="text-lg mr-1 cursor-pointer text-red-600" />
        </button>
      );
    } else {
      // isLike가 false일 때
      return (
        <button className="mb-2" onClick={() => handleClickLike(post.id, post.likeCount, post.liked)}>
          <AiOutlineHeart className="text-lg mr-1 cursor-pointer" />
        </button>
      );
    }
  };

  // 날씨 추천 API
  // useEffect(() => {
  //     axios
  //     .get(`/posts`, {
  //         params: {
  //         seasonKeywords: season,
  //         weatherKeywords: weather,
  //         },
  //     })
  //     .then((response) => {
  //         setPosts(response.data.posts);
  //     })
  //     .catch((error) => {
  //         console.error("게시글을 불러오는데 실패하였습니다.", error);
  //     });
  // }, [season, weather]);

  // const fetchWeatherRecommendation = async (season: string, weather: string) => {
  //     try{
  //         const response = await apiInstance.get(`/posts`,{
  //             params:{
  //                 seasonKeywords: season,
  //                 weatherKeywords: weather,
  //             },
  //         });
  //         setPosts(response.data.posts);
  //     }
  //     catch(error){
  //         console.error("게시글을 불러오는데 실패하였습니다.", error);
  //     }
  // }

  // useEffect(() => {
  //     fetchWeatherRecommendation(season, weather);
  // }, [season,weather]);

  return (
    <div className="w-full h-full bg-white">
      <div className="max-auto">
        <div className="cursor-pointer flex items-center justify-start border-b pb-2">
          <button className="mr-4 text-lg ml-6 font-semibold">추천</button>
          <button onClick={handleNavigation} className="text-lg text-gray-400">
            팔로잉
          </button>
        </div>
        <div className="mt-6 ml-6 text-m text-gray-400">
          <Weather />
        </div>
        <div className="mt-2 text-xl ml-6 font-bold">오늘 날씨와 어울리는 스타일</div>
        <div className="mt-6 ml-4">
          {/* <Carousel>
                {posts && posts.map((post: Post, index) => (
                    <CarouselContent key={index} imageUrl={post.images && post.images.length > 0 ? post.images[0].url : ''} />
                ))}
                </Carousel> */}
        </div>

        <div className="mt-12 relative">
          <div className="fixed top-[85%] right-[30px] z-[1000]">
            <div className="flex flex-col justify-end">
              <ScrollTopButton />
              <GoToPostEditorButton />
            </div>
          </div>
          <div className="text-xl ml-6 font-bold">키워드 추천</div>
          <div className="mt-6 ml-6 flex flex-wrap justify-flex-start gap-3">
            <div
              className={`py-[4px] px-4 border rounded-full cursor-pointer text-xs ${
                selectedStyleTags.length > 0
                  ? "bg-white text-black" // 태그가 선택된 경우(로그인 상태에 관계 없이) 비활성화
                  : !loggedInUser.isLoggedIn || selectedStyleTags.length === 0
                  ? "bg-black text-white" // 로그인하지 않은 경우 활성화
                  : "bg-white text-black" // 로그인을 하면 비활성화
              }`}
              onClick={handleAllTag}
            >
              <p>전체</p>
            </div>
            <div
              className={`py-[4px] px-4 border rounded-full cursor-pointer text-xs ${
                isMySizeApplied ? "bg-black text-white" : "bg-white text-black"
              }`}
              onClick={handleBodyClick}
            >
              <p>체형</p>
            </div>

            {styleTagsList.map((tag) =>
              selectedStyleTags.includes(tag.id) ? (
                <div
                  key={tag.id}
                  className={`py-[4px] px-4 border rounded-full cursor-pointer text-xs bg-black text-white`}
                  onClick={() => handleDeleteTag(tag.id)} // 태그 리스트에서 제외
                >
                  <p>{tag.keyword}</p>
                </div>
              ) : (
                <div
                  key={tag.id}
                  className={`py-[4px] px-4 border rounded-full cursor-pointer text-xs`}
                  onClick={() => handleAddTag(tag.id)}
                >
                  <p>{tag.keyword}</p>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="mt-5 h-auto grid grid-cols-2 gap-4 px-4">
          {filteredPosts.map((post: Post, index) => (
            <div key={index} className="flex flex-col bg-white overflow-hidden">
              <div
                className="mt-2 flex flex-wrap items-center justify-left cursor-pointer"
                onClick={() => router.push(`/userinfo/${post.writer.id}`)}
              >
                <img src={post.writer.profileImg} alt="profile" className="ml-1 w5 h5 rounded-full w-[32px] h-[32px]" />
                <p className="text-xs pl-2">{post.writer.nickname}</p>
              </div>
              <div className="mt-2" onClick={() => router.push(`/posts/${post.id}`)}>
                <img src={post.thumbnail} alt="content" className="cursor-pointer object-cover w-[340px] h-[450px]" />
              </div>

              <div className="ml-2 flex justify-between items-center">
                <div>
                  <p className="inline mt-2 text-sm">{post.content}</p>
                  <div className="mt-1 flex items-center justify-start">
                    <p className="text-xs">
                      {post.styleTags.join(" ")}
                      {post.hashTags.join(" ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  {renderLikeIcon(post)}
                  <p className="mr-2 mb-2 text-sm text-gray-500">{post.likeCount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div ref={loadingRef} className="invisible" />
      </div>
      {isModalOpen && (
        <BodyShapeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onApply={handleApply} />
      )}
    </div>
  );
};
export default Main;
