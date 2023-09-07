import React, { useEffect, useState } from "react";
// import Carousel from "../components/Carousel";
import Weather from "../components/Weather";
// import { seasonState, weatherState } from "@/utils/atoms";
// import Image from 'next/image'
// import { useInfiniteQuery } from "react-query";
import ScrollTopButton from "../components/ScrollTopButton";
import GoToPostEditorButton from "./GoToPostEditorButton";
import BodyShapeModal from "./BodyShapeModal";
import { apiInstance } from "../api/api";
import { useRecoilValue } from "recoil";
import { styleTagsState } from "@/utils/atoms";
import { AiOutlineHeart } from "react-icons/ai";
import { userState } from "@/utils/atoms";

interface User {
  height: number;
  weight: number;
  styleTagIds: number[];
}

type Writer = {
  id: number;
  nickname: string;
  profileImg: string;
};

type Post = {
  pageParam?: number;
  id: number;
  content: string;
  location: string;
  viewCount: number;
  likeCount: number;
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
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const styleTags = useRecoilValue(styleTagsState); // recoil 에서 가져온 전체 스타일 태그 목록
  const [isModalOpen, setIsModalOpen] = useState(false);
  const loggedInUser = useRecoilValue(userState);
  const [user, setUser] = useState<User>({
    height: loggedInUser.height,
    weight: loggedInUser.weight,
    styleTagIds: loggedInUser.styleTags,
  });
  const [selectedStyleTags, setSelectedStyleTags] = useState<number[]>(user.styleTagIds || []);

  // 페이지에 들어오자마자 데이터가 다 보여짐
  useEffect(() => {
    fetchPosts({ pageParam: 0 });
  }, []);

  // 키워드 나열 계절과 날씨 제외
  const styleTagsList = styleTags.filter((tag) => tag.category !== "SEASON" && tag.category !== "WEATHER");

  // 게시글 api
  const fetchPosts = async ({ pageParam = 0 }) => {
    try {
      const response = await apiInstance.post(`filter?page=${pageParam}&size=4`, {
        height: user.height,
        weight: user.weight,
        styleTagIds: selectedStyleTags,
      });
      setFilteredPosts(response.data.data.posts);
      return response.data.data;
      // return response.data.data.posts;
    } catch (error) {
      console.error(error);
    }
  };

  // user 상태 업데이트
  useEffect(() => {
    setUser({
      height: loggedInUser.height,
      weight: loggedInUser.weight,
      styleTagIds: loggedInUser.styleTags,
    });
  }, [loggedInUser]);

  useEffect(() => {
    setSelectedStyleTags(user.styleTagIds);
    console.log(selectedStyleTags);
  }, [user]);

  // 키워드 버튼 선택 해제
  const handleDeleteTag = (tagId: number) => {
    setSelectedStyleTags(selectedStyleTags.filter((id) => id !== tagId));
    fetchPosts({ pageParam: 0 });
  };

  // 키워드 버튼 추가 선택
  const handleAddTag = (tagId: number) => {
    if (!selectedStyleTags.includes(tagId)) {
      setSelectedStyleTags([...selectedStyleTags, tagId]);
      fetchPosts({ pageParam: 0 });
    }
  };

  // 전체 키워드 버튼 클릭
  const handleAllTag = () => {
    setSelectedStyleTags([]); // 모든 선택된 태그 해제
    fetchPosts({ pageParam: 0 });
  };

  const handleBodyClick = () => {
    setIsModalOpen(true);
  };

  // // useInfiniteQuery 훅을 사용하여 무한 스크롤 구현
  // const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(
  //   ["posts", selectedStyleTags],
  //   ({ pageParam = 0 }) => fetchPosts({ pageParam }),
  //   {
  //     getNextPageParam: (lastPage) => {
  //       console.log("Last page data: ", lastPage);
  //       return lastPage.currentPage < lastPage.totalPages - 1 ? lastPage.currentPage + 1 : undefined;
  //     },
  //   },
  // );

  // useEffect(() => {
  //   const onScroll = () => {
  //     if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50) {
  //       console.log("Reached bottom of the page");
  //       if (hasNextPage) {
  //         console.log("Fetching next page");
  //         fetchNextPage();
  //       }
  //     }
  //   };

  //   window.addEventListener("scroll", onScroll);

  //   return () => window.removeEventListener("scroll", onScroll);
  // }, [hasNextPage, fetchNextPage]);

  //   window.addEventListener("scroll", onScroll);
  //   document.addEventListener("visibilitychange", onVisibilityChange);

  //   // cleanup function
  //   return () => window.removeEventListener("scroll", onScroll);
  //   document.removeEventListener("visibilitychange", onVisibilityChange);
  // }, [hasNextPage]);

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
        <div className="flex items-center justify-start border-b pb-2">
          <button className="mr-4 text-lg ml-6">팔로잉</button>
          <button className="text-lg">추천</button>
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
          <div className="fixed top-[85%] right-[18rem] z-[1000]">
            <GoToPostEditorButton />
            <ScrollTopButton />
          </div>
          <div className="text-xl ml-6 font-bold">키워드 추천</div>
          <div className="mt-6 ml-6 flex flex-wrap justify-flex-start gap-3">
            <div
              className={`py-[4px] px-4 border rounded-full cursor-pointer text-xs ${
                !loggedInUser.isLoggedIn ? "bg-black text-white" : "bg-white text-black"
              }`}
              onClick={handleAllTag}
            >
              <p>전체</p>
            </div>
            <div
              className="py-[4px] px-4 border rounded-full cursor-pointer text-xs bg-white text-black"
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
        {/* {filteredPosts.map((post: Post) => ( */}
        {/* {data?.pages.map((pageData) =>
            pageData.posts.map((post: Post) => ( */}

        <div className="mt-5 h-auto grid grid-cols-2 gap-4 px-4">
          {filteredPosts.map((post: Post) => (
            <div key={post.id} className="flex flex-col bg-white rounded-lg overflow-hidden">
              <div className="mt-2 flex flex-wrap items-center justify-left">
                <img src={post.writer.profileImg} alt="profile" className="ml-1 w5 h5 rounded-full w-[32px] h-[32px]" />
                <p className="text-xs pl-2">{post.writer.nickname}</p>
              </div>
              <div className="mt-2">
                <img src={post.thumbnail} alt="content" className="object-cover" />
              </div>
              <div className="">
                <div className="mt-2 text-sm">{post.content}</div>
                <div className="mt-2 flex items-center justify-start">
                  <p className="text-xs">
                    {post.styleTags.join(" ")}
                    {post.hashTags.join(" ")}
                  </p>
                </div>
                <div className="flex items-center justify-end mt-4">
                  <AiOutlineHeart className="text-sm mr-2 cursor-pointer" />
                  <p className="text-sm">{post.likeCount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && <BodyShapeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
export default Main;
