import type { NextConfig } from "next";
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

const nextConfig: NextConfig = {
    /* config options here */
};

// Move the async setup into a function that can be conditionally called
const setupCloudflareDevPlatform = async () => {
    if (process.env.NODE_ENV === 'development') {
        await setupDevPlatform();
    }
};

// Call the setup function if you need to
setupCloudflareDevPlatform().catch(console.error);

export default nextConfig;