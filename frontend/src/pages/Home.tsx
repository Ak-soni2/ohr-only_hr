
import React from 'react';
import { Hero } from '../components/Hero';
import { Mission } from '../components/Mission';
import { FeaturedEvents } from '../components/FeaturedEvents';
import { BackToTop } from '../components/BackToTop';

export const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Mission />
      <FeaturedEvents />
      <BackToTop />
    </>
  );
};
