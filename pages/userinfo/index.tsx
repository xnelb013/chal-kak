import { Post } from "@/utils/type";
import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import { LiaUserCircleSolid } from "react-icons/lia";

const tempPosts: Post[] = [
  {
    email: "seoul@test.com",
    images: [
      {
        url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
      },
    ],
    seasonKeywords: ["가을"],
    weatherKeywords: ["맑음"],
    staticKeywords: ["#스트릿"],
    dynamicKeywords: ["#테테테스트"],
    content: ["블라블라블라"],
  },
  {
    email: "seoul@test.com",
    images: [
      {
        url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
      },
    ],
    seasonKeywords: ["여름"],
    weatherKeywords: ["맑음"],
    staticKeywords: ["#데이트"],
    dynamicKeywords: ["#테테테스트"],
    content: ["블라블라블라"],
  },
  {
    email: "seoul@test.com",
    images: [{ url: "https://blog.kakaocdn.net/dn/CaS0a/btrVpEm6Z0o/4ugD1Sw1j1Bcx3DnG085RK/img.jpg" }],
    seasonKeywords: ["여름"],
    weatherKeywords: ["맑음"],
    staticKeywords: ["#데이트"],
    dynamicKeywords: ["#엇"],
    content: ["블라블라블라"],
  },
  {
    email: "seoul@test.com",
    images: [{ url: "https://blog.kakaocdn.net/dn/CaS0a/btrVpEm6Z0o/4ugD1Sw1j1Bcx3DnG085RK/img.jpg" }],
    seasonKeywords: ["여름"],
    weatherKeywords: ["맑음"],
    staticKeywords: ["#데이트"],
    dynamicKeywords: ["#가나다라마바사"],
    content: ["블라블라블라"],
  },
  {
    email: "seoul@test.com",
    images: [{ url: "https://blog.kakaocdn.net/dn/CaS0a/btrVpEm6Z0o/4ugD1Sw1j1Bcx3DnG085RK/img.jpg" }],
    seasonKeywords: ["여름"],
    weatherKeywords: ["맑음"],
    staticKeywords: ["#데이트"],
    dynamicKeywords: ["#긴글도되나여어로로로로로롤"],
    content: ["긴글테스트트트트트트트트트트긴글긴그ㅡ트트트트트트"],
  },
  {
    email: "seoul@test.com",
    images: [{ url: "https://blog.kakaocdn.net/dn/CaS0a/btrVpEm6Z0o/4ugD1Sw1j1Bcx3DnG085RK/img.jpg" }],
    seasonKeywords: ["여름"],
    weatherKeywords: ["맑음"],
    staticKeywords: ["#데이트"],
    dynamicKeywords: ["#내맘대로"],
    content: ["블라블라블라"],
  },
  {
    email: "seoul@test.com",
    images: [
      {
        url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
      },
    ],
    seasonKeywords: ["여름"],
    weatherKeywords: ["맑음"],
    staticKeywords: ["#여행"],
    dynamicKeywords: ["#내맘대로"],
    content: ["블라블라블라"],
  },
  {
    email: "seoul@test.com",
    images: [
      {
        url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
      },
    ],
    seasonKeywords: ["여름"],
    weatherKeywords: ["맑음"],
    staticKeywords: ["#빈티지"],
    dynamicKeywords: ["#내맘대로"],
    content: ["블라블라블라"],
  },
  {
    email: "seoul@test.com",
    images: [
      {
        url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
      },
    ],
    seasonKeywords: ["여름"],
    weatherKeywords: ["맑음"],
    staticKeywords: ["#미니멀"],
    dynamicKeywords: ["#내맘대로"],
    content: ["블라블라블라"],
  },
  {
    email: "seoul@test.com",
    images: [
      {
        url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
      },
    ],
    seasonKeywords: ["여름"],
    weatherKeywords: ["맑음"],
    staticKeywords: ["#스포티"],
    dynamicKeywords: ["#내맘대로"],
    content: ["블라블라블라"],
  },
  {
    email: "seoul@test.com",
    images: [
      {
        url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
      },
    ],
    seasonKeywords: ["여름"],
    weatherKeywords: ["맑음"],
    staticKeywords: ["#데이트"],
    dynamicKeywords: ["#내맘대로"],
    content: ["블라블라블라"],
  },
  {
    email: "seoul@test.com",
    images: [
      {
        url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
      },
    ],
    seasonKeywords: ["여름"],
    weatherKeywords: ["맑음"],
    staticKeywords: ["#데이트"],
    dynamicKeywords: ["#내맘대로"],
    content: ["블라블라블라"],
  },
  {
    email: "seoul@test.com",
    images: [
      {
        url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
      },
    ],
    seasonKeywords: ["여름"],
    weatherKeywords: ["맑음"],
    staticKeywords: ["#데이트"],
    dynamicKeywords: ["#내맘대로"],
    content: ["블라블라블라"],
  },
  {
    email: "seoul@test.com",
    images: [
      {
        url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
      },
    ],
    seasonKeywords: ["여름"],
    weatherKeywords: ["맑음"],
    staticKeywords: ["#데이트"],
    dynamicKeywords: ["#내맘대로"],
    content: ["블라블라블라"],
  },
  {
    email: "seoul@test.com",
    images: [
      {
        url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
      },
    ],
    seasonKeywords: ["여름"],
    weatherKeywords: ["맑음"],
    staticKeywords: ["#데이트"],
    dynamicKeywords: ["#내맘대로"],
    content: ["블라블라블라"],
  },
  {
    email: "seoul@test.com",
    images: [
      {
        url: "https://mblogthumb-phinf.pstatic.net/MjAyMTA1MjlfMzYg/MDAxNjIyMjE1MDQ3OTM5.Sb1a-fd_f4-G1jEKYkFT1jwKwKccor428hKbg6HAFNkg.yJD7Ww1_Jb0N1X7kO5pI5aKDxdNvnkTrHCvfMBCjwJkg.JPEG.acttosun08/IMG%EF%BC%BF2705.JPG?type=w800",
      },
    ],
    seasonKeywords: ["여름"],
    weatherKeywords: ["맑음"],
    staticKeywords: ["#데이트"],
    dynamicKeywords: ["#내맘대로"],
    content: ["블라블라블라"],
  },
  {
    email: "seoul@test.com",
    images: [{ url: "https://blog.kakaocdn.net/dn/CaS0a/btrVpEm6Z0o/4ugD1Sw1j1Bcx3DnG085RK/img.jpg" }],
    seasonKeywords: ["여름"],
    weatherKeywords: ["맑음"],
    staticKeywords: ["#데이트"],
    dynamicKeywords: ["#내맘대로"],
    content: ["블라블라블라"],
  },
  {
    email: "seoul@test.com",
    images: [{ url: "https://blog.kakaocdn.net/dn/CaS0a/btrVpEm6Z0o/4ugD1Sw1j1Bcx3DnG085RK/img.jpg" }],
    seasonKeywords: ["여름"],
    weatherKeywords: ["맑음"],
    staticKeywords: ["#데이트"],
    dynamicKeywords: ["#내맘대로"],
    content: ["블라블라블라"],
  },
];

export default function UserInfo(): JSX.Element {
  // const [userInfo, setUserInfo] = useState({
  //   postCount: 0,
  //   followers: [],
  //   following: [],
  //   nickname: "",
  //   profileUrl: "",
  // });
  const router = useRouter();

  // useEffect(() => {
  //   const fetchUserInfo = async () => {
  //     const userInfo = localStorage.getItem("userinfo");
  //     setUserInfo(JSON.parse(userInfo!));
  //   };
  //   fetchUserInfo();
  // }, []);

  const moveToModifyPage = () => {
    router.push("/userinfo/modify-userinfo");
  };

  // const { postCount, followers, following, nickname, profileUrl } = userInfo as userInfoType;

  const gridRowCount = Math.ceil(tempPosts.length / 3);
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col w-[550px] items-center mt-[10px]">
        <div className="flex flex-col items-center gap-6 w-[600px] h-[250px]  rounded-lg">
          <div className="flex flex-row items-center justify-around w-[480px] h-[200px] gap-10 mt-2">
            <div className="avatar">
              <div className="w-40 rounded-full">
                {/* {profileUrl !== "" ? (
                  <LiaUserCircleSolid className="w-40 h-40" />
                ) : (
                  <img src={profileUrl} alt="profile-img" />
                )} */}
              </div>
            </div>
            <div className="flex flex-col gap-10 items-center p-5">
              <div className="flex flex-row items-center justify-center">
                <div className="text-lg font-semibold ml-3 text-black">@</div>
                <button
                  className="btn-neutral ml-4 bg-[#efefef] w-[125px] font-medium rounded-lg text-black"
                  onClick={moveToModifyPage}
                >
                  프로필 관리
                </button>
              </div>
              <div className="flex flex-row justify-between items-center gap-10 ">
                <div className="flex flex-col items-center text-black">
                  <p>게시글</p>
                  {/* {postCount} */}
                </div>
                <div className="flex flex-col items-center text-black">
                  <p>팔로워</p>
                  {/* {followers.length} */}
                </div>
                <div className="flex flex-col items-center text-black">
                  <p>팔로잉</p>
                  {/* {following.length} */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[10px] pt-2 border-t-2">
          <div className="w-[500px] h-[600px]  overflow-y-auto">
            <div className="grid grid-cols-3">
              {Array.from({ length: gridRowCount }).map((_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-1 ml-1">
                  {tempPosts
                    .slice(rowIndex * 3, rowIndex * 3 + 3) // 현재 행에 해당하는 게시글 추출
                    .map((post, idx) => (
                      <div className="w-40 h-40 object-cover mt-1" key={idx}>
                        <img src={post.images[0].url} alt="post.img" className="" />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
