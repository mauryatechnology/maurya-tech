import React from 'react';
import { AboutPage } from '@/components/pages/about/AboutPage';
import { about as aboutData } from '@/data/about';

// Use all typo and brand permutations for About page
export const metadata = {
    title: 'About Us',
    description: 'Learn about Maurya Technologies, our mission, vision, Pilot Model, and the team driving innovation in software development.',
    alternates: {
        canonical: '/about',
    },
}

export default function About() {
    return <AboutPage aboutData={aboutData} />;
}
