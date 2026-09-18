'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout';
import { Section, SectionHeader, ServiceCard, ProcessStep, CTASection } from '@/components/sections';
import { useData } from '@/contexts/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ServicesPage({ servicesData: serverServicesData }) {
    const { servicesData: contextServicesData } = useData();
    const servicesData = serverServicesData || contextServicesData;
    const { hero, services, process } = servicesData;
    const [selectedService, setSelectedService] = useState(null);

    return (
        <Layout page="services">
            {/* Hero */}
            <section className="hero-gradient pt-16 pb-12 md:pb-20">
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

            {/* Services Grid */}
            <Section>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={service.id}
                            icon={service.icon}
                            title={service.title}
                            description={service.shortDescription}
                            technologies={service.technologies}
                            index={index}
                            onClick={() => setSelectedService(service)}
                        />
                    ))}
                </div>
            </Section>

            {/* Process */}
            <Section variant="muted">
                <SectionHeader
                    title={process.title}
                    subtitle={process.subtitle}
                />
                <div className="max-w-2xl mx-auto">
                    {process.steps.map((step, index) => (
                        <ProcessStep
                            key={index}
                            number={step.number}
                            title={step.title}
                            description={step.description}
                            isLast={index === process.steps.length - 1}
                            index={index}
                        />
                    ))}
                </div>
            </Section>

            {/* CTA */}
            <CTASection
                title="Ready to Build Your Product?"
                description="Start your risk-free pilot today and see our process in action."
                buttonText="Get Started"
                buttonLink="/contact"
            />

            {/* Service Detail Modal */}
            <AnimatePresence>
                {selectedService && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm"
                        onClick={() => setSelectedService(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-start justify-between mb-6">
                                <h3 className="font-heading font-bold text-2xl">{selectedService.title}</h3>
                                <button
                                    onClick={() => setSelectedService(null)}
                                    className="p-2 rounded-lg hover:bg-muted"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-muted-foreground leading-relaxed mb-6">
                                {selectedService.fullDescription}
                            </p>

                            <div className="mb-6">
                                <h4 className="font-semibold mb-4">What&apos;s Included</h4>
                                <div className="space-y-3">
                                    {selectedService.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <Check className="w-5 h-5 text-accent flex-shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-semibold mb-4">Technologies</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedService.technologies.map((tech, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 text-sm font-medium bg-muted text-muted-foreground rounded-lg"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <Link href="/contact">
                                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                                    Discuss This Service
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Layout>
    );
}
