import React, { useEffect, useState, useRef } from "react";
import Weather from "../components/Weather";
import Image from "next/image";
import ScrollTopButton from "../components/ScrollTopButton";
import GoToPostEditorButton from "./GoToPostEditorButton";
import BodyShapeModal from "./BodyShapeModal";
import { apiInstance } from "../api/api";
import { useRecoilValue } from "recoil";
import { weatherLocationState, styleTagsState } from "@/utils/atoms";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { userState } from "@/utils/atoms";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

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

const Main = () => {
  const router = useRouter();
  const [filteredWeatherPosts, setFilteredWeatherPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [pageParam, setPageParam] = useState(-1);
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

  // 오늘 날씨에 어울리는 스타일 추천 api
  const fetchWeatherPosts = async (lat: number, lon: number, page = 0, size = 10) => {
    try {
      const response = await apiInstance.get("/weather/posts", {
        params: {
          lat,
          lon,
          page,
          size,
        },
      });
      setFilteredWeatherPosts(response.data.data.posts);
      console.log(response.data.data.posts);
    } catch (error) {
      console.error(error);
    }
  };

  const location = useRecoilValue(weatherLocationState);

  useEffect(() => {
    fetchWeatherPosts(location.latitude, location.longitude);
  }, [location]);

  // 키워드 추천 게시글 api
  const fetchPosts = async ({ pageParam = 0 }) => {
    try {
      const response = await apiInstance.post(`filter?page=${pageParam}&size=4`, {
        height: user.height,
        weight: user.weight,
        styleTagIds: selectedStyleTags,
      });

      if (pageParam === 0) {
        // 첫 페이지일 경우
        setFilteredPosts(response.data.data.posts);
      } else {
        // 첫 페이지가 아닐 경우
        setFilteredPosts((prevPosts) => [...prevPosts, ...response.data.data.posts]);
      }
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

  // 선택된 스타일 태그나 입력된 키/몸무게 등 필터링 조건이 변경될 때마다 실행, 페이지 번호와 게시물 목록 초기화
  useEffect(() => {
    setPageParam(0);
    setFilteredPosts([]);
  }, [selectedStyleTags, inputHeight, inputWeight]);

  // 초기값 -1, pageParam이 0 이상의 값을 가질 때까지 실제 게시물 데이터를 요청하지 않음
  useEffect(() => {
    if (pageParam === -1) return;
    fetchPosts({ pageParam });
  }, [pageParam]);

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
    setPageParam(0);
    setFilteredPosts([]);
  };

  const handleBodyClick = () => {
    setIsModalOpen(true);
    setIsMySizeApplied(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    if (isMySizeApplied) {
      // '적용하기' 버튼을 누른 후 x버튼을 누르면 isMySizeApplied를 false로 설정
      setIsMySizeApplied(false);
      setInputHeight(null);
      setInputWeight(null);
    }
  };

  // 체형 모달 적용하기
  const handleApply = (height: number, weight: number) => {
    setInputHeight(height);
    setInputWeight(weight);

    // 로그인 여부와 관계없이 isMySizeApplied를 true로 설정
    setIsMySizeApplied(true);
    // 적용하기 버튼을 누른 후 모달 닫기
    setIsModalOpen(false);
  };

  // 좋아요 클릭
  const handleClickLike = (postId: number, likeCount: number, liked: boolean) => {
    if (!loggedInUser.isLoggedIn) {
      // 만약 로그인하지 않은 유저라면
      router.push("/login"); // 로그인 페이지로 이동
      return;
    }
    if (postId) {
      apiInstance({
        method: "get",
        url: `like/posts/${postId}`,
      })
        .then(() => {
          const updatePosts = filteredPosts.map((post: Post) => {
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

          const updateWeatherPosts = filteredWeatherPosts.map((post: Post) => {
            if (post.id === postId) {
              return { ...post, likeCount: likeCount + 1, liked: !liked };
            }
            return post;
          });
          setFilteredWeatherPosts(updateWeatherPosts);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // 좋아요 취소
  const handleClickUnlike = (postId: number, likeCount: number, liked: boolean) => {
    if (!loggedInUser.isLoggedIn) {
      // 만약 로그인하지 않은 유저라면
      router.push("/login"); // 로그인 페이지로 이동
      return;
    }
    if (postId) {
      apiInstance({
        method: "delete",
        url: `like/posts/${postId}`,
      })
        .then(() => {
          const updatePosts = filteredPosts.map((post: Post) => {
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

          const updateWeatherPosts = filteredWeatherPosts.map((post: Post) => {
            if (post.id === postId) {
              return { ...post, likeCount: likeCount - 1, liked: !liked };
            }
            return post;
          });
          setFilteredWeatherPosts(updateWeatherPosts);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // 좋아요 아이콘을 보여주는 함수
  const renderLikeIcon = (post: Post) => {
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

  return (
    <div className="w-full h-full bg-white">
      <div className="max-auto">
        <div className="cursor-pointer flex items-center justify-start border-b pb-2">
          <button className="mr-4 text-lg font-semibold">추천</button>
          <button onClick={handleNavigation} className="text-lg text-gray-400">
            팔로잉
          </button>
        </div>
        <div className="mt-6 text-m text-gray-400">
          <Weather />
        </div>
        <div className="mt-2 text-xl font-bold">오늘 날씨와 어울리는 스타일</div>
        <div style={{ width: "100%", height: "auto" }}>
          <Swiper
            // spaceBetween={1} // 슬라이드 간의 간격 조정
            slidesPerView="auto" /* 한번에 보여줄 슬라이드 수 설정 (1.5) */
          >
            {filteredWeatherPosts.map((post: Post, index) => (
              <SwiperSlide key={index} style={{ width: "300px", height: "540px" }}>
                <div className="mt-4 cursor-pointer overflow-hidden flex flex-col bg-white mr-2">
                  <div className="flex justify-between items-center pb-2">
                    <div className="flex items-center" onClick={() => router.push(`/userinfo/${post.writer.id}`)}>
                      <div className=" w-8 h-8 relative">
                        <Image
                          src={post.writer.profileImg || "/images/defaultImg.jpg"}
                          layout="fill"
                          alt="profile-img"
                          className="border rounded-full object-cover"
                        />
                      </div>
                      <p className="text-xs pl-2">{post.writer.nickname}</p>
                    </div>
                  </div>

                  <div
                    style={{ width: "300px", height: "400px" }}
                    className="relative mt-1"
                    onClick={() => router.push(`/posts/${post.id}`)}
                  >
                    <Image
                      src={post.thumbnail}
                      width={300}
                      height={400}
                      alt="content"
                      style={{ objectFit: "cover", aspectRatio: "3/4" }}
                      className="cursor-pointer absolute top-0 left-0 w-full h-full"
                    />
                  </div>

                  <div className="ml-1 flex justify-between items-stretch relative">
                    <div>
                      <p className="text-sm block">
                        {post.content ||
                          post.styleTags
                            .map((tag, index) => (
                              <span key={"style" + index} className="text-xs">
                                #{tag}{" "}
                              </span>
                            ))
                            .concat(
                              post.hashTags.map((tag, index) => (
                                <span key={"hash" + index} className="text-xs">
                                  #{tag}{" "}
                                </span>
                              )),
                            )}
                      </p>
                      {post.content && (
                        <div className="flex items-center justify-start">
                          {post.styleTags.map((tag, index) => (
                            <span key={index} className="text-xs mr-1">
                              #{tag}{" "}
                            </span>
                          ))}
                          {post.hashTags.map((tag, index) => (
                            <span key={index} className="text-xs mr-1">
                              #{tag}{" "}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-end justify-end absolute top-0 right-0">
                      {renderLikeIcon(post)}
                      <p className="mr-2 mb-[8px] text-sm text-gray-500">{post.likeCount}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-6 relative">
          <div className="fixed top-[85%] right-[30px] z-[1000]">
            <div className="flex flex-col justify-end">
              <ScrollTopButton />
              <GoToPostEditorButton />
            </div>
          </div>
          <div className="text-xl font-bold">키워드 추천</div>
          <div className="mt-6 flex flex-wrap justify-flex-start gap-3">
            <div
              className={`py-[6px] px-4 text-center border rounded-full cursor-pointer text-xs ${
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
              className={`py-[6px] px-4 text-center border rounded-full cursor-pointer text-xs ${
                isMySizeApplied ? "bg-black text-white" : "bg-white text-black"
              }`}
              onClick={handleBodyClick}
            >
              <p>체형</p>
            </div>
            {isModalOpen && <BodyShapeModal isOpen={isModalOpen} onClose={handleClose} onApply={handleApply} />}

            {styleTagsList.map((tag) =>
              selectedStyleTags.includes(tag.id) ? (
                <div
                  key={tag.id}
                  className={`py-[6px] px-4 text-center border rounded-full cursor-pointer text-xs bg-black text-white`}
                  onClick={() => handleDeleteTag(tag.id)} // 태그 리스트에서 제외
                >
                  <p>{tag.keyword}</p>
                </div>
              ) : (
                <div
                  key={tag.id}
                  className={`py-[6px] px-4 text-center border rounded-full cursor-pointer text-xs`}
                  onClick={() => handleAddTag(tag.id)}
                >
                  <p>{tag.keyword}</p>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="mt-5 h-auto grid grid-cols-2 gap-2">
          {filteredPosts.map((post: Post, index) => (
            <div key={index} className="flex flex-col mb-2 bg-white overflow-hidden">
              <div
                className="mt-2 flex flex-wrap items-center justify-left cursor-pointer"
                onClick={() => router.push(`/userinfo/${post.writer.id}`)}
              >
                <div className="w-[32px] h-[32px] relative">
                  <Image
                    src={post.writer.profileImg || "/images/defaultImg.jpg"}
                    layout="fill"
                    alt="profile-img"
                    className="border rounded-full object-cover"
                  />
                </div>
                <p className="text-xs ml-2">{post.writer.nickname}</p>
              </div>
              <div
                style={{ width: "342px", height: "455px" }}
                className="relative mt-2 mb-2"
                onClick={() => router.push(`/posts/${post.id}`)}
              >
                <Image
                  src={post.thumbnail}
                  width={342}
                  height={455}
                  alt="content"
                  style={{ objectFit: "cover", aspectRatio: "3/4" }}
                  className="cursor-pointer absolute top-0 left-0"
                />
              </div>

              <div className="flex justify-between items-stretch relative">
                <div>
                  <p className="ml-1 text-sm block">
                    {post.content ||
                      post.styleTags
                        .map((tag, index) => (
                          <span key={"style" + index} className="text-xs">
                            #{tag}{" "}
                          </span>
                        ))
                        .concat(
                          post.hashTags.map((tag, index) => (
                            <span key={"hash" + index} className="text-xs">
                              #{tag}{" "}
                            </span>
                          )),
                        )}
                  </p>
                  {post.content && (
                    <div className="ml-1 flex items-center justify-start">
                      {post.styleTags.map((tag, index) => (
                        <span key={index} className="text-xs mr-1">
                          #{tag}{" "}
                        </span>
                      ))}
                      {post.hashTags.map((tag, index) => (
                        <span key={index} className="text-xs mr-1">
                          #{tag}{" "}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-end justify-end absolute top-0 right-0">
                  {renderLikeIcon(post)}
                  <p className="mr-2 mb-2 text-sm text-gray-500">{post.likeCount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div ref={loadingRef} className="invisible" />
      </div>
    </div>
  );
};
export default Main;
