import React, { useCallback, useEffect, useState } from "react";
import { TfiArrowLeft } from "react-icons/tfi";
import { VscClose } from "react-icons/vsc";
import { apiInstance } from "../api/api";
import { FaHashtag } from "react-icons/fa";
import { useRouter } from "next/router";
import debounce from "lodash.debounce";
import Image from "next/image";

type User = {
  memberId: number;
  nickname: string;
  profileImgUrl: string;
};

type Post = {
  postId: number;
  content: string;
  previewContent: string;
};

type Tag = {
  tagId: number;
  keyword: string;
};

type HighlightProps = {
  text: string;
  highlight: string;
};

const Search = () => {
  const router = useRouter();
  const [tab, setTab] = useState("전체");
  const [keyword, setKeyword] = useState("");
  const [searchResult, setSearchResult] = useState<{ users: User[]; posts: Post[]; tags: Tag[] }>({
    users: [],
    posts: [],
    tags: [],
  });

  const fetchSearchResult = useCallback(
    debounce(async (keyword) => {
      if (keyword !== "") {
        try {
          const [usersRes, postsRes, styleTagsRes, hashTagsRes] = await Promise.all([
            // Promise.all 4개의 api가 동시에 수행되며 모든 요청이 완료될 때까지 기다림
            apiInstance.get(`/filter/users/${keyword}?page=0&size=10`),
            apiInstance.get(`/filter/posts?keyword=${keyword}&max-length=10&page=0&size=10`),
            apiInstance.get(`/filter/hash-tags/${keyword}?page=0&size=10`),
            apiInstance.get(`/filter/style-tags/${keyword}?page=0&size=10`),
          ]);

          setSearchResult({
            users: usersRes.data.data,
            posts: postsRes.data.data,
            tags: [...styleTagsRes.data.data, ...hashTagsRes.data.data],
          });
        } catch (error) {
          console.error(error);
        }
      }
    }, 300),
    [],
  );

  useEffect(() => {
    fetchSearchResult(keyword);
  }, [fetchSearchResult, keyword]);

  const Highlight: React.FC<HighlightProps> = ({ text, highlight }) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} style={{ backgroundColor: "white", color: "#0078FF" }}>
              {part}{" "}
            </mark>
          ) : (
            part
          ),
        )}
      </span>
    );
  };

  return (
    <div className="absoulte top-0 mx-auto bg-white">
      <div className="flex flex-col p-6">
        <form className="flex items-center w-full" onSubmit={(e) => e.preventDefault()}>
          <div>
            <TfiArrowLeft className="w-[24px] h-[24px] mr-1 cursor-pointer" onClick={() => router.back()} />
          </div>
          <div className="relative border border-gray-100 bg-gray-100 ml-3 px-4 py-2 w-full mr-2">
            <input
              type="text"
              placeholder="검색어를 입력하세요."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-transparent"
            />
            {keyword !== "" && (
              <div onClick={() => setKeyword("")} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <VscClose className="w-[18px] h-[18px] text-gray-600 cursor-pointer" />
              </div>
            )}
          </div>
          <button type="submit"></button>
        </form>

        {/*Tab navigation*/}
        <nav className="mt-6 w-full h-[44px] flex justify-around items-center">
          {["전체", "계정", "피드", "태그"].map((name) => (
            <div
              key={name}
              className={`pb-2 text-center w-full ${
                tab === name ? "border-b-2 border-black text-gray-900" : "border-b border-gray-200 text-gray-400"
              }`}
            >
              <button onClick={() => setTab(name)} className="text-[16px] font-bold">
                {name}
              </button>
            </div>
          ))}
        </nav>

        {/* Tab content */}
        {tab === "전체" && (
          <section className="overflow-auto">
            {searchResult.users.length > 0 && (
              <>
                <div className="flex items-center justify-between h-[60px]">
                  <p className="text-sm text-gray-600">계정</p>
                  <div className="mt-2 flex items-center justify-end">
                    <button onClick={() => setTab("계정")} className="text-sm mr-2 text-gray-400 cursor-pointer">
                      더보기
                    </button>
                  </div>
                </div>
                {searchResult.users.slice(0, 4).map((users, index) => (
                  <div
                    key={index}
                    className="mb-4 flex items-center justify-start"
                    onClick={() => router.push(`/userinfo/${users.memberId}`)}
                  >
                    <div className=" w-10 h-10 relative">
                      <Image
                        src={users.profileImgUrl || "/images/defaultImg.jpg"}
                        layout="fill"
                        alt="profile-img"
                        className="border rounded-full object-cover"
                      />
                    </div>
                    <p className="p-2 text-sm">
                      <Highlight text={users.nickname} highlight={keyword} />
                    </p>
                  </div>
                ))}
              </>
            )}

            {searchResult.posts.length > 0 && (
              <>
                <div className="mt-6 flex items-center justify-between h-[60px]">
                  <p className="text-sm text-gray-600">피드</p>
                  <div className="mt-2 flex items-center justify-end">
                    <button onClick={() => setTab("피드")} className="text-sm mr-2 text-gray-400 cursor-pointer">
                      더보기
                    </button>
                  </div>
                </div>
                {searchResult.posts.slice(0, 4).map((posts, index) => (
                  <div
                    key={index}
                    className="mb-4 flex items-center justify-start"
                    onClick={() => router.push(`/posts/${posts.postId}`)}
                  >
                    <p className="p-2 text-sm">
                      <Highlight text={posts.content} highlight={keyword} />
                    </p>
                  </div>
                ))}
              </>
            )}

            {searchResult.tags.length > 0 && (
              <>
                <div className="mt-6 flex items-center justify-between h-[60px]">
                  <p className="text-sm text-gray-600">태그</p>
                  <div className="mt-2 flex items-center justify-end">
                    <button onClick={() => setTab("태그")} className="text-sm mr-2 text-gray-400 cursor-pointer">
                      더보기
                    </button>
                  </div>
                </div>
                {searchResult.tags.slice(0, 4).map((tags, index) => (
                  <div key={index} className="mb-4 flex items-center justify-start">
                    <div className="border rounded-full w-[40px] h-[40px] flex items-center justify-center">
                      <FaHashtag className="w-[22px] h-[22px]" />
                    </div>
                    <p className="pl-4 p-2 text-sm">
                      <Highlight text={tags.keyword} highlight={keyword} />
                    </p>
                  </div>
                ))}
              </>
            )}
          </section>
        )}

        {tab === "계정" && (
          <section className="overflow-auto">
            {searchResult.users.map((users, index) => (
              <div
                key={index}
                className="mt-4 mb-4 flex items-center justify-start"
                onClick={() => router.push(`/userinfo/${users.memberId}`)}
              >
                <div className=" w-10 h-10 relative">
                  <Image
                    src={users.profileImgUrl || "/images/defaultImg.jpg"}
                    layout="fill"
                    alt="profile-img"
                    className="border rounded-full object-cover"
                  />
                </div>
                <p className="pl-4 p-2 text-sm">
                  <Highlight text={users.nickname} highlight={keyword} />
                </p>
              </div>
            ))}
          </section>
        )}
        {tab === "피드" && (
          <section className="overflow-auto">
            {searchResult.posts.map((posts, index) => (
              <div
                key={index}
                className="mb-4 flex items-center justify-start"
                onClick={() => router.push(`/posts/${posts.postId}`)}
              >
                <p className="p-2 text-sm">
                  <Highlight text={posts.content} highlight={keyword} />
                </p>
              </div>
            ))}
          </section>
        )}
        {tab === "태그" && (
          <section className="overflow-auto">
            {searchResult.tags.map((tags, index) => (
              <div key={index} className="mt-4 mb-4 flex items-center justify-start">
                <div className="border rounded-full w-[40px] h-[40px] flex items-center justify-center">
                  <FaHashtag className="w-[22px] h-[22px]" />
                </div>
                <p className="pl-4 p-2 text-sm">
                  <Highlight text={tags.keyword} highlight={keyword} />
                </p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

Search.getLayout = function getNoNavPage(page: React.ReactNode) {
  return (
    <div className="wrap">
      <div className="container">{page}</div>
    </div>
  );
};

export default Search;
