'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { Section } from '@/components/sections';
import { useData } from '@/contexts/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Check, Info, Star, ArrowRight, Zap, Shield,
    HeadphonesIcon, TrendingUp, Crown, Gift
} from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function PricingPage({ pricingData: serverPricingData }) {
    const { pricingData: contextPricingData } = useData();
    const pricingData = serverPricingData || contextPricingData;
    const { title, subtitle, currency, disclaimer, categories, faq } = pricingData;
    const [selectedCategory, setSelectedCategory] = useState("web_dev");

    const activeCategory = categories.find(c => c.id === selectedCategory);

    const features = [
        { icon: Shield, text: 'Enterprise-grade Security' },
        { icon: Zap, text: '99.9% Uptime SLA' },
        { icon: HeadphonesIcon, text: '24/7 Premium Support' },
        { icon: TrendingUp, text: 'Scalable Infrastructure' },
    ];

    return (
        <Layout page="pricing">
            {/* Hero Section */}
            <section className="relative hero-gradient pt-32 pb-12 md:pb-20 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
                </div>

                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6"
                        >
                            <Star className="w-4 h-4 text-accent" />
                            <span className="text-accent font-medium text-sm">Transparent Pricing</span>
                        </motion.div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-hero-foreground mb-6 leading-tight">
                            {title}
                        </h1>
                        <p className="text-lg md:text-xl text-hero-muted leading-relaxed mb-8">
                            {subtitle}
                        </p>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                        className="flex flex-col items-center gap-2 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-accent" />
                                        </div>
                                        <span className="text-xs font-medium text-center">{feature.text}</span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </section>



            {/* Pricing Plans */}
            <Section className="py-16 md:py-24">
                <div className="container-custom">
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-4xl mx-auto mb-12 md:mb-20"
                        >
                            <div className="text-center mb-6">
                                <h2 className="font-heading font-bold text-2xl md:text-3xl mb-2">Choose Your Solution</h2>
                                <p className="text-muted-foreground">Select a category to view pricing plans</p>
                            </div>

                            {/* Mobile Dropdown */}
                            <div className="md:hidden mb-6">
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-full h-12">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Desktop Category Grid */}
                            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3">
                                {categories.map((category, index) => {
                                    const isActive = selectedCategory === category.id;
                                    return (
                                        <motion.button
                                            key={category.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`
                      relative px-4 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer
                      ${isActive
                                                    ? 'bg-accent text-accent-foreground shadow-lg scale-105'
                                                    : 'bg-card hover:bg-muted border border-border hover:border-accent/50'
                                                }
                    `}
                                        >
                                            <span className="text-sm">{category.name}</span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="categoryPill"
                                                    className="absolute inset-0 rounded-xl bg-accent"
                                                    style={{ zIndex: -1 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                        {activeCategory && (
                            <motion.div
                                key={activeCategory.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-7xl mx-auto"
                            >
                                {/* Responsive Pricing Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                    {activeCategory.plans.map((plan, index) => {
                                        const isPopular = plan.popular;

                                        return (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={`relative ${isPopular ? 'lg:-mt-4 lg:mb-4' : ''}`}
                                            >
                                                {isPopular && (
                                                    <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                                                        <Badge className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground px-4 py-1.5 shadow-lg">
                                                            <Crown className="w-3 h-3 mr-1 fill-current" />
                                                            Most Popular
                                                        </Badge>
                                                    </div>
                                                )}

                                                <Card className={`
                          h-full flex flex-col transition-all duration-300 cursor-pointer group
                          ${isPopular
                                                        ? 'border-2 border-accent shadow-2xl lg:scale-105 bg-gradient-to-br from-accent/5 to-transparent hover:shadow-accent/20'
                                                        : 'border-2 border-border hover:border-accent/50 hover:shadow-xl'
                                                    }
                        `}>
                                                    <CardHeader className="text-center pb-8 relative">
                                                        {isPopular && (
                                                            <div className="absolute top-4 right-4">
                                                                <Gift className="w-5 h-5 text-accent" />
                                                            </div>
                                                        )}

                                                        <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                                                        <CardDescription className="text-sm min-h-[40px]">
                                                            {plan.description}
                                                        </CardDescription>

                                                        <div className="pt-6">
                                                            <div className="flex items-center justify-center gap-1 mb-2 flex-wrap">
                                                                <span className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground break-all">
                                                                    {currency}{plan.price}
                                                                </span>
                                                            </div>
                                                            <div className="text-muted-foreground text-sm font-medium">
                                                                {plan.period === "starts at" ? "starts at" : `per ${plan.period}`}
                                                            </div>
                                                        </div>
                                                    </CardHeader>

                                                    <CardContent className="flex-1 px-6">
                                                        <div className="space-y-3 mb-6">
                                                            {plan.features.map((feature, i) => (
                                                                <div key={i} className="flex items-start gap-3 group/feature">
                                                                    <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/feature:bg-accent/20 transition-colors">
                                                                        <Check className="w-3 h-3 text-accent" />
                                                                    </div>
                                                                    <span className="text-sm leading-relaxed group-hover/feature:text-foreground transition-colors">{feature}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </CardContent>

                                                    <CardFooter className="pt-0 pb-6 px-6">
                                                        <Button
                                                            className={`
                                w-full group-hover:scale-105 transition-transform
                                ${isPopular
                                                                    ? 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg'
                                                                    : 'hover:bg-accent hover:text-accent-foreground'
                                                                }
                              `}
                                                            variant={isPopular ? "default" : "outline"}
                                                            size="lg"
                                                            asChild
                                                        >
                                                            <Link href="/contact" className="flex items-center justify-center cursor-pointer">
                                                                Get Started
                                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                            </Link>
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="flex gap-3 items-start max-w-5xl mx-auto bg-card/50 backdrop-blur-sm  rounded-xl  cursor-default pt-12"
                >
                    <Info className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold mb-2">Pricing Information</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {disclaimer}
                        </p>
                    </div>
                </div>
            </Section>


            {/* FAQ Section */}
            <Section className="section-padding bg-gradient-to-b from-muted/30 to-background">
                <div className="container-custom max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Find answers to common pricing queries
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <Accordion type="single" collapsible className="w-full space-y-3">
                            {faq.map((item, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                    className="bg-card border-2 border-border rounded-xl px-6 overflow-hidden hover:border-accent transition-all duration-300 data-[state=open]:border-accent data-[state=open]:shadow-lg data-[state=open]:shadow-accent/10"
                                >
                                    <AccordionTrigger className="text-left hover:text-accent py-6 hover:no-underline [&[data-state=open]]:text-accent">
                                        <span className="font-semibold pr-4 text-base">{item.question}</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground pb-6 pt-1 leading-relaxed">
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </motion.div>
                </div>
            </Section>

            {/* CTA Section */}
            <Section className="py-20 bg-muted/30">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        <Card className="border-2 hover:border-accent/50 transition-colors">
                            <CardHeader className="text-center pb-6">
                                <CardTitle className="text-3xl md:text-4xl lg:text-5xl mb-4">
                                    Still Have Questions?
                                </CardTitle>
                                <CardDescription className="text-lg md:text-xl">
                                    Our team is here to help you choose the right plan and answer any questions you may have.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-8">
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button
                                        size="lg"
                                        className="cursor-pointer"
                                        asChild
                                    >
                                        <Link href="/contact" className="flex items-center justify-center">
                                            Contact Sales Team
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </Link>
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="cursor-pointer"
                                        asChild
                                    >
                                        <Link href="/products">View All Products</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </Section>
        </Layout>
    );
}
