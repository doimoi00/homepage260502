/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'blog.kakaocdn.net' },
      { protocol: 'https', hostname: 't1.daumcdn.net' },
    ],
  },
}

export default nextConfig
