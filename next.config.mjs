/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ulnqrrdyucccuuzwyhzd.supabase.co',
      },
    ],
  },
};

export default nextConfig;
