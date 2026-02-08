/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
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
