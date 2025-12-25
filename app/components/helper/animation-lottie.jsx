"use client"

import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const AnimationLottie = ({ animationPath, width = '95%' }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationPath,
    style: { width },
  };

  return <Lottie {...defaultOptions} />;
};

export default AnimationLottie;
