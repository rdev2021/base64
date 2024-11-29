import type { NextConfig } from "next";
const { execSync } = require('child_process');
const getGitHash = () => {
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch (e) {
    return 'no-git-hash';
  }
};

const nextConfig: NextConfig = {
  output: 'export',
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_GIT_HASH: getGitHash(),
  },
};

export default nextConfig;
