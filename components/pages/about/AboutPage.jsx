'use client';

import React from 'react';
import { Layout } from '@/components/layout';
import { Section, SectionHeader, FeatureCard } from '@/components/sections';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AboutPage({ aboutData: serverAboutData }) {
    const { aboutData: contextAboutData } = useData();
    const aboutData = serverAboutData || contextAboutData;
    const { hero, story, mission, vision, culture } = aboutData;

    return (
        <Layout page="about">
            {/* Hero */}
            <section className="hero-gradient pt-32 pb-12 md:pb-20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <span className="inline-block text-accent font-medium text-sm uppercase tracking-wider mb-4">
                            {hero.subtitle}
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-hero-foreground mb-6">
                            {hero.title}
                        </h1>
                        <p className="text-lg md:text-xl text-hero-muted leading-relaxed">
                            {hero.description}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story */}
            <Section>
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                            {story.title}
                        </h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            {story.paragraphs.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-3xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                            <div className="text-center p-8">
                                <div className="text-6xl font-heading font-bold text-accent mb-4">2026</div>
                                <div className="text-xl font-medium text-muted-foreground">Founded</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Mission & Vision */}
            <Section variant="muted">
                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-8 bg-card rounded-2xl border border-border"
                    >
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                            <ArrowRight className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="font-heading font-bold text-2xl mb-4">{mission.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{mission.description}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="p-8 bg-card rounded-2xl border border-border"
                    >
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                            <ArrowRight className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="font-heading font-bold text-2xl mb-4">{vision.title}</h3>
                        <p className="text-muted-foreground leading-relaxed mb-6">{vision.description}</p>
                        <div className="space-y-3">
                            {vision.values.map((value, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-accent" />
                                    <span className="font-medium">{value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Culture */}
            <Section>
                <SectionHeader
                    title={culture.title}
                    subtitle="What drives us every day"
                />
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {culture.values.map((value, index) => (
                        <FeatureCard
                            key={index}
                            icon={value.icon}
                            title={value.title}
                            description={value.description}
                            index={index}
                        />
                    ))}
                </div>
            </Section>

            {/* CTA */}
            <section className="hero-gradient py-20">
                <div className="container-custom text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl mx-auto"
                    >
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-hero-foreground mb-6">
                            Ready to Partner with Us?
                        </h2>
                        <p className="text-lg text-hero-muted mb-8">
                            Let&apos;s discuss how we can help you build your next product.
                        </p>
                        <Link href="/contact">
                            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                                Start a Conversation
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
}
