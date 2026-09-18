"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Layout } from '@/components/layout';
import { projects } from '@/data/projects';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import ShareButtons from '@/components/ui/ShareButtons';
import {
    ArrowLeft,
    ExternalLink,
    Check,
    Calendar,
    Clock,
    User,
    Users,
    ChevronLeft,
    ChevronRight,
    Monitor,
    Smartphone,
    Layers,
    Code2,
    Trophy,
    LayoutDashboard,
    Plane,
    Database,
    Shield,
    Zap,
    BarChart3,
    MessageSquare,
    Globe,
    School,
    Building,
    Heart,
    Activity,
    Cpu,
    Server,
    Code
} from 'lucide-react';

const iconMap = {
    LayoutDashboard,
    Users,
    Plane,
    Database,
    Shield,
    Zap,
    BarChart3,
    MessageSquare,
    Globe,
    School,
    Building,
    Heart,
    Activity,
    Cpu,
    Server,
    Code
};

export const ProjectDetailPage = ({ project: serverProject }) => {
    const params = useParams();
    const slug = params?.slug;
    const router = useRouter();

    const project = serverProject || projects.projects.find(p => p.slug === slug || p.id === slug);

    const [activeDesktopIndex, setActiveDesktopIndex] = useState(0);
    const [activeMobileIndex, setActiveMobileIndex] = useState(0);

    if (!project) {
        return (
            <Layout page="projects">
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
                        <Button onClick={() => router.push('/projects')}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Projects
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    const nextDesktop = () => setActiveDesktopIndex((prev) => (prev + 1) % project.desktopImages.length);
    const prevDesktop = () => setActiveDesktopIndex((prev) => (prev - 1 + project.desktopImages.length) % project.desktopImages.length);
    const nextMobile = () => setActiveMobileIndex((prev) => (prev + 1) % project.mobileImages.length);
    const prevMobile = () => setActiveMobileIndex((prev) => (prev - 1 + project.mobileImages.length) % project.mobileImages.length);

    return (
        <Layout page="projects">
            {/* Hero with Gradient Background */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />

                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl"
                    >
                        <Link href="/projects" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Projects
                        </Link>

                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <Badge className="bg-accent/10 text-accent border-accent/20">
                                {project.category}
                            </Badge>
                            {project.featured && (
                                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                                    ⭐ Featured
                                </Badge>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
                            {project.title}
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                            {project.shortDescription}
                        </p>

                        <div className="flex flex-wrap gap-6 mb-8">
                            {project.client && (
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="w-4 h-4 text-accent" />
                                    <span className="text-muted-foreground">Client:</span>
                                    <span className="font-medium">{project.client}</span>
                                </div>
                            )}
                            {project.role && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Code2 className="w-4 h-4 text-accent" />
                                    <span className="text-muted-foreground">Role:</span>
                                    <span className="font-medium">{project.role}</span>
                                </div>
                            )}
                            {project.duration && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4 text-accent" />
                                    <span className="text-muted-foreground">Duration:</span>
                                    <span className="font-medium">{project.duration}</span>
                                </div>
                            )}
                            {project.year && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-accent" />
                                    <span className="text-muted-foreground">Year:</span>
                                    <span className="font-medium">{project.year}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            {project.liveLink && project.liveLink !== '#' && (
                                <Button
                                    size="lg"
                                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                                    onClick={() => window.open(project.liveLink, '_blank')}
                                >
                                    <ExternalLink className="w-5 h-5 mr-2" />
                                    View Live Project
                                </Button>
                            )}
                            <ShareButtons title={`${project.title} - Case Study by Maurya Technologies`} description={project.shortDescription} />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Desktop Screenshots Carousel */}
            {project.desktopImages && project.desktopImages.length > 0 && (
                <section className="py-8">
                    <div className="container-custom">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="relative">
                                <div className="relative rounded-xl overflow-hidden shadow-2xl bg-card border border-border">
                                    {/* Browser Chrome */}
                                    <div className="h-8 bg-muted flex items-center px-4 gap-2 border-b border-border">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                        </div>
                                        <div className="flex-1 mx-4">
                                            <div className="bg-background/50 rounded-md h-5 px-3 flex items-center text-[10px] text-muted-foreground max-w-md truncate">
                                                {project.liveLink || 'https://project-demo.com'}
                                            </div>
                                        </div>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={activeDesktopIndex}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1, transition: { duration: 0.3 } }}
                                            exit={{ opacity: 0 }}
                                            src={project.desktopImages[activeDesktopIndex]}
                                            alt={`${project.title} desktop view ${activeDesktopIndex + 1}`}
                                            className="w-full aspect-video object-cover"
                                        />
                                    </AnimatePresence>
                                </div>

                                {/* Navigation */}
                                {project.desktopImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevDesktop}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background transition-colors z-10"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={nextDesktop}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background transition-colors z-10"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Problem & Solution */}
            <section className="py-20 bg-muted/20">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-lg font-heading font-semibold text-destructive mb-3">The Problem</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {project.problem}
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-lg font-heading font-semibold text-accent mb-3">The Solution</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {project.solution}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Key Features Grid */}
            <section className="py-20">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-heading font-bold mb-4">Key Features</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Detailed breakdown of the core functionalities implemented in this project.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {project.keyFeatures && project.keyFeatures.map((feature, idx) => {
                            const Icon = iconMap[feature.icon] || Code2;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 rounded-xl bg-card border border-border hover:border-accent/40 hover:bg-accent/5 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                                        <Icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
                                    </div>
                                    <h4 className="font-heading font-bold text-lg mb-2">{feature.title}</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Mobile Showcase & Tech Stack */}
            <section className="py-20 bg-muted/30">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Mobile Images */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex justify-center gap-8"
                        >
                            {project.mobileImages && project.mobileImages.slice(0, 2).map((img, idx) => (
                                <div key={idx} className={`relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-black border-4 border-gray-800 ${idx === 1 ? 'mt-12' : ''}`}>
                                    <div className="absolute top-0 inset-x-0 h-6 bg-black z-10 rounded-t-[2.5rem]">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-xl" />
                                    </div>
                                    <Image
                                        src={img}
                                        alt="Mobile View"
                                        width={260}
                                        height={540}
                                        className="w-[260px] h-[540px] object-cover"
                                    />
                                </div>
                            ))}
                        </motion.div>

                        {/* Tech Stack */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Layers className="w-6 h-6 text-accent" />
                                <h2 className="text-3xl font-heading font-bold">Tech Stack</h2>
                            </div>
                            <p className="text-muted-foreground mb-8">
                                Built with modern, scalable technologies to ensure performance and reliability.
                            </p>

                            <div className="space-y-6">
                                {project.techStack && Object.entries(project.techStack).map(([category, techs], idx) => (
                                    <div key={idx}>
                                        <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/70 mb-3">
                                            {category}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {techs.map((tech) => (
                                                <Badge key={tech} variant="secondary" className="px-3 py-1 bg-background border border-border">
                                                    {tech}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Results/Impact */}
            <section className="py-20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                            <Trophy className="w-8 h-8 text-accent" />
                        </div>
                        <h2 className="text-3xl font-heading font-bold mb-8">Project Impact</h2>
                        <div className="grid gap-6">
                            {project.results && project.results.map((result, idx) => (
                                <div key={idx} className="flex items-center gap-4 text-left p-4 rounded-lg bg-card border border-border">
                                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                        <Check className="w-5 h-5 text-green-500" />
                                    </div>
                                    <span className="text-lg text-foreground/90">{result}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-accent text-accent-foreground">
                <div className="container-custom text-center">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                        Ready to Build Your Success Story?
                    </h2>
                    <p className="text-accent-foreground/80 text-lg max-w-2xl mx-auto mb-8">
                        Let&apos;s apply the same level of engineering excellence to your next project.
                    </p>
                    <Link href="/contact">
                        <Button size="lg" variant="secondary" className="text-accent font-bold">
                            Start Your Pilot
                        </Button>
                    </Link>
                </div>
            </section>
        </Layout>
    );
};
