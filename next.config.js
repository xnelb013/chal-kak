/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "mblogthumb-phinf.pstatic.net",
      "blog.kakaocdn.net",
      "spring-photo-bucket.s3.ap-south-1.amazonaws.com",
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
