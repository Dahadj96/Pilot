/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.kiwi.com',
            },
            {
                protocol: 'https',
                hostname: '**.iata.org',
            },
        ],
    },
};

export default nextConfig;
