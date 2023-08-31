import React, { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import Weather from "../components/Weather";
import { useRecoilValue } from "recoil";
import { seasonState, weatherState } from "@/utils/atoms";
import axios from "axios";
import Image from 'next/image'
import { useInfiniteQuery } from 'react-query';
import ScrollTopButton from "../components/ScrollTopButton";
import GoToPostEditorButton from "./GoToPostEditorButton";

interface Keyword {
    title: string;
}

const keywords: Keyword[] = [
    {
        title: "전체",
    },
    {
        title: "체형",
    },
    {
        title: "#미니멀",
    },
    {
        title: "#데이트",
    },
    {
        title: "#스트릿",
    },
    {
        title: "#아메카지",
    },
    {
        title: "#원마일웨어",
    },
    {
        title: "#비즈니스",
    },
    {
        title: "#댄디",
    },
    {
        title: "#캐주얼",
    },
    {
        title: "#빈티지",
    },
    {
        title: "#스포티",
    },
    {
        title: "#여행",
    },
    {
        title: "#출근",
    },
    {
        title: "#하객",
    },
];

type Post = {
    email: string;
    images: { url: string }[];
    seasonKeywords: string[];
    weatherKeywords: string[];
    staticKeywords: string[];
    dynamicKeywords: string[];
    content: string[];
};

type PostContentProps = {
    post: Post;
};

const tempPosts: Post[] = [
    {
        email: 'sohyun',
        images: [{url:'https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800'}],
        seasonKeywords: ['가을'],
        weatherKeywords: ['맑음'],
        staticKeywords: ['#스트릿'],
        dynamicKeywords:['#테테테스트'],
        content:['블라블라블라'],
    },
    {
        email: 'sohyun2',
        images: [{url:'https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800'}],
        seasonKeywords: ['여름'],
        weatherKeywords: ['맑음'],
        staticKeywords: ['#데이트'],
        dynamicKeywords: ['#테테테스트'],
        content:['블라블라블라'],
    },
    {
        email: 'sohyun2',
        images: [{url:'https://blog.kakaocdn.net/dn/CaS0a/btrVpEm6Z0o/4ugD1Sw1j1Bcx3DnG085RK/img.jpg'}],
        seasonKeywords: ['여름'],
        weatherKeywords: ['맑음'],
        staticKeywords: ['#데이트'],
        dynamicKeywords: ['#엇'],
        content:['블라블라블라'],
    },
    {
        email: 'sohyun2',
        images: [{url:'https://blog.kakaocdn.net/dn/CaS0a/btrVpEm6Z0o/4ugD1Sw1j1Bcx3DnG085RK/img.jpg'}],
        seasonKeywords: ['여름'],
        weatherKeywords: ['맑음'],
        staticKeywords: ['#데이트'],
        dynamicKeywords: ['#가나다라마바사'],
        content:['블라블라블라'],
    },
    {
        email: 'sohyun2',
        images: [{url:'https://blog.kakaocdn.net/dn/CaS0a/btrVpEm6Z0o/4ugD1Sw1j1Bcx3DnG085RK/img.jpg'}],
        seasonKeywords: ['여름'],
        weatherKeywords: ['맑음'],
        staticKeywords: ['#데이트'],
        dynamicKeywords: ['#긴글도되나여어로로로로로롤'],
        content:['긴글테스트트트트트트트트트트긴글긴그ㅡ트트트트트트'],
    },
    { 
        email: 'sohyun2',
        images: [{url:'https://blog.kakaocdn.net/dn/CaS0a/btrVpEm6Z0o/4ugD1Sw1j1Bcx3DnG085RK/img.jpg'}],
        seasonKeywords: ['여름'],
        weatherKeywords: ['맑음'],
        staticKeywords: ['#데이트'],
        dynamicKeywords: ['#내맘대로'],
        content:['블라블라블라'],
    },
    {
        email: 'sohyun2',
        images: [{url:'https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800'}],
        seasonKeywords: ['여름'],
        weatherKeywords: ['맑음'],
        staticKeywords: ['#여행'],
        dynamicKeywords: ['#내맘대로'],
        content:['블라블라블라'],
    },
    {
        email: 'sohyun2',
        images: [{url:'https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800'}],
        seasonKeywords: ['여름'],
        weatherKeywords: ['맑음'],
        staticKeywords: ['#빈티지'],
        dynamicKeywords: ['#내맘대로'],
        content:['블라블라블라'],
    },
    {
        email: 'sohyun2',
        images: [{url:'https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800'}],
        seasonKeywords: ['여름'],
        weatherKeywords: ['맑음'],
        staticKeywords: ['#미니멀'],
        dynamicKeywords: ['#내맘대로'],
        content:['블라블라블라'],
    },
    {
        email: 'sohyun2',
        images: [{url:'https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800'}],
        seasonKeywords: ['여름'],
        weatherKeywords: ['맑음'],
        staticKeywords: ['#스포티'],
        dynamicKeywords: ['#내맘대로'],
        content:['블라블라블라'],
    },
    {
        email: 'sohyun2',
        images: [{url:'https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800'}],
        seasonKeywords: ['여름'],
        weatherKeywords: ['맑음'],
        staticKeywords: ['#데이트'],
        dynamicKeywords: ['#내맘대로'],
        content:['블라블라블라'],
    },
    {
        email: 'sohyun2',
        images: [{url:'https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800'}],
        seasonKeywords: ['여름'],
        weatherKeywords: ['맑음'],
        staticKeywords: ['#데이트'],
        dynamicKeywords: ['#내맘대로'],
        content:['블라블라블라'],
    },
    {
        email: 'sohyun2',
        images: [{url:'https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800'}],
        seasonKeywords: ['여름'],
        weatherKeywords: ['맑음'],
        staticKeywords: ['#데이트'],
        dynamicKeywords: ['#내맘대로'],
        content:['블라블라블라'],
    },
    {
        email: 'sohyun2',
        images: [{url:'https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800'}],
        seasonKeywords: ['여름'],
        weatherKeywords: ['맑음'],
        staticKeywords: ['#데이트'],
        dynamicKeywords: ['#내맘대로'],
        content:['블라블라블라'],
    },
    {
        email: 'sohyun2',
        images: [{url:'https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800'}],
        seasonKeywords: ['여름'],
        weatherKeywords: ['맑음'],
        staticKeywords: ['#데이트'],
        dynamicKeywords: ['#내맘대로'],
        content:['블라블라블라'],
    }, {
        email: 'sohyun2',
        images: [{url:'https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800'}],
        seasonKeywords: ['여름'],
        weatherKeywords: ['맑음'],
        staticKeywords: ['#데이트'],
        dynamicKeywords: ['#내맘대로'],
        content:['블라블라블라'],
    },
    { 
        email: 'sohyun2',
        images: [{url:'https://blog.kakaocdn.net/dn/CaS0a/btrVpEm6Z0o/4ugD1Sw1j1Bcx3DnG085RK/img.jpg'}],
        seasonKeywords: ['여름'],
        weatherKeywords: ['맑음'],
        staticKeywords: ['#데이트'],
        dynamicKeywords: ['#내맘대로'],
        content:['블라블라블라'],
    },
    { 
        email: 'sohyun2',
        images: [{url:'https://blog.kakaocdn.net/dn/CaS0a/btrVpEm6Z0o/4ugD1Sw1j1Bcx3DnG085RK/img.jpg'}],
        seasonKeywords: ['여름'],
        weatherKeywords: ['맑음'],
        staticKeywords: ['#데이트'],
        dynamicKeywords: ['#내맘대로'],
        content:['블라블라블라'],
    }
];

// 날씨 기반 스타일 추천 캐러셀
const CarouselContent: React.FC<{ imageUrl: string }> = ({ imageUrl }) => (
    <div className="bg-white flex flex-direction-row cursor-pointer overflow-hidden">
        <Image src={imageUrl} alt="sample" className="w-full h-64 object-cover" width={768} height={1024}/>
    </div>
);

// 임시 데이터 게시물 추천
const PostContent: React.FC<PostContentProps> = ({ post }) => (
    <div className="bg-white rounded-lg overflow-hidden">
        <div className="p-2 text-xs font-medium">
            <p>{post.email}</p>
        </div>
        <Image src={post.images[0].url} alt="post image" className="object-cover" width={768} height={1024}/>
        <p className="text-sm text-gray-600 mt-2 pl-2">{post.content}</p>
        <div className="flex items-start p-2">
            <p className="text-xs">{post.staticKeywords}</p>
            <p className="text-xs">{post.dynamicKeywords}</p>
        </div>
    </div>
);

const Main = () => {
    const season = useRecoilValue(seasonState);
    const weather = useRecoilValue(weatherState);
    console.log("111", season, weather);
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedKeyword, setSelectedKeyword] = useState<string>('전체');

    const fetchPosts = async ({pageParam = 1}) => {
        // const response = await axios.get(`/posts?page=${pageParam}`,{});
        // return response.data;

        // 페이지당 6개의 게시글을 로드한다고 가정
        const newPosts = tempPosts.slice((pageParam - 1) * 6, pageParam * 6);
        return {
            posts: newPosts,
            nextCursor: pageParam+1 <= Math.ceil(tempPosts.length / 6) ? pageParam +1 : undefined
        };
    }

     //useInfiniteQuery 훅을 사용하여 무한 스크롤 구현
    const {
        data,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery('posts',fetchPosts,{getNextPageParam:(lastPage) => lastPage.nextCursor});

    useEffect(() => {
        const onScroll= () => {
            if(window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 500) return;
            if(hasNextPage) fetchNextPage();
        };

        window.addEventListener('scroll', onScroll);
        // cleanup function
        return () => window.removeEventListener('scroll', onScroll);
    }, [hasNextPage]);

    useEffect(() => {
        axios
        .get(`/posts`, {
            params: {
            seasonKeywords: season,
            weatherKeywords: weather,
            },
        })
        .then((response) => {
            setPosts(response.data.posts);
        })
        .catch((error) => {
            console.error("게시글을 불러오는데 실패하였습니다.", error);
        });
    }, [season, weather]);

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
            <Carousel>
                {posts.map((post, index) => (
                <CarouselContent key={index} imageUrl={post.images[0].url} />
                ))}
            </Carousel>
            </div>

            <div className="mt-12 relative">
                <div className="fixed top-[85%] right-[18rem] z-[1000]">
                    <GoToPostEditorButton />
                    <ScrollTopButton />
                </div>
                <div className="text-xl ml-6 font-bold">키워드 추천</div>
                <div className="mt-6 ml-6 flex flex-wrap justify-flex-start gap-4">
                {keywords.map((keyword) => {
                    const isActive = tempPosts.some(post => post.staticKeywords.includes(keyword.title));
                    return (
                    <div
                        key={keyword.title}
                        onClick={() => setSelectedKeyword(keyword.title)}
                        className={`py-[4px] px-4 border rounded-full cursor-pointer text-xs ${isActive ? 'bg-black text-white'  : 'bg-white text-black'}`}>
                        <p>{keyword.title}</p>
                    </div>
                    )
                })}
                </div>     
            </div>

            <div className="mt-5 h-auto grid grid-cols-2 gap-4 px-4">
            {(selectedKeyword === '전체' ? data?.pages.flatMap(page => page.posts) : data?.pages.flatMap(page => page.posts.filter(post => post.staticKeywords.includes(selectedKeyword))))?.map((post, index) =>
                <PostContent key={index} post={post} />
            )}
            </div>
        </div>
    </div>
    );
};

export default Main;