/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com','mblogthumb-phinf.pstatic.net','blog.kakaocdn.net'],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
