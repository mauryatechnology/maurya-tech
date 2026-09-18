'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { Layout } from '@/components/layout';
import { Section } from '@/components/sections';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Check, ArrowRight, Code, Cloud, Plug,
    TrendingUp, Users, Star, ChevronRight
} from 'lucide-react';

export function ProductDetailPage() {
    const params = useParams();
    const { productsData } = useData();

    // Find the product by slug
    // Ensure productsData is loaded before trying to access
    if (!productsData || !productsData.categories) {
        return null; // Or simpler loading state
    }

    let product = null;
    let category = null;

    for (const cat of productsData.categories) {
        const found = cat.products.find(p => p.slug === params.slug);
        if (found) {
            product = found;
            category = cat;
            break;
        }
    }

    if (!product) {
        notFound();
    }

    const relatedProducts = category?.products
        .filter(p => p.slug !== product.slug)
        .slice(0, 3) || [];

    return (
        <Layout page="products">
            {/* Hero Section */}
            <section className="relative hero-gradient pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" />
                </div>

                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-hero-muted mb-6">
                            <Link href="/products" className="hover:text-accent transition-colors">Products</Link>
                            <ChevronRight className="w-4 h-4" />
                            <Link href={`/products?category=${category?.id}`} className="hover:text-accent transition-colors">
                                {category?.title}
                            </Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-hero-foreground">{product.title}</span>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <Badge className="mb-4" variant="secondary">
                                    {product.pricingType}
                                </Badge>

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-hero-foreground mb-6 leading-tight">
                                    {product.title}
                                </h1>

                                <p className="text-xl text-hero-muted leading-relaxed mb-8">
                                    {product.description}
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                                        <Link href="/contact">
                                            Request Demo
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="border-hero-muted/20 text-hero-foreground hover:bg-hero-muted/10" asChild>
                                        <Link href="/pricing">View Pricing</Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {product.benefits?.slice(0, 4).map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.1 + index * 0.1 }}
                                        className="cursor-default"
                                    >
                                        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card hover:shadow-lg transition-all duration-300 h-full">
                                            <CardContent className="p-6">
                                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-3">
                                                    <TrendingUp className="w-6 h-6 text-accent" />
                                                </div>
                                                <p className="text-sm font-medium leading-relaxed">{benefit}</p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <Section className="section-padding bg-muted/30">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                            Powerful Features
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Everything you need to streamline your operations and drive growth
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {product.features?.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="cursor-default"
                            >
                                <Card className="h-full hover:shadow-lg hover:border-accent/30 transition-all duration-300 group">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center shrink-0 mt-1 group-hover:scale-110 transition-transform">
                                                <Check className="w-5 h-5 text-accent" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors">{feature}</h3>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Benefits Section */}
            {product.benefits && (
                <Section className="section-padding">
                    <div className="container-custom">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
                                    Why Choose {product.title}?
                                </h2>
                                <div className="space-y-4">
                                    {product.benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                                                <Star className="w-3 h-3 text-accent fill-accent" />
                                            </div>
                                            <p className="text-lg">{benefit}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <Card className="border-2 p-8">
                                    <h3 className="font-heading font-bold text-2xl mb-6">
                                        Perfect For
                                    </h3>
                                    <div className="space-y-4">
                                        {product.useCases?.map((useCase, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                                                    <Users className="w-5 h-5 text-accent" />
                                                </div>
                                                <p className="leading-relaxed">{useCase}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </Section>
            )}

            {/* Technical Specifications */}
            <Section className="section-padding bg-muted/30">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                            Technical Details
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {product.techStack && (
                            <Card className="cursor-default hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-3">
                                        <Code className="w-7 h-7 text-accent" />
                                    </div>
                                    <CardTitle className="text-lg">Technology Stack</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {product.techStack.map((tech, index) => (
                                            <Badge key={index} variant="secondary" className="cursor-default">{tech}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {product.deployment && (
                            <Card className="cursor-default hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-3">
                                        <Cloud className="w-7 h-7 text-accent" />
                                    </div>
                                    <CardTitle className="text-lg">Deployment</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{product.deployment}</p>
                                </CardContent>
                            </Card>
                        )}

                        {product.integrations && (
                            <Card className="cursor-default hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-3">
                                        <Plug className="w-7 h-7 text-accent" />
                                    </div>
                                    <CardTitle className="text-lg">Integrations</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {product.integrations.map((integration, index) => (
                                            <Badge key={index} variant="outline" className="text-xs cursor-default">
                                                {integration}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </Section>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <Section className="section-padding bg-muted/20">
                    <div className="container-custom">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                                Related Products
                            </h2>
                            <p className="text-muted-foreground text-lg">Explore more solutions in {category?.title}</p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {relatedProducts.map((relatedProduct, index) => (
                                <motion.a
                                    key={relatedProduct.id}
                                    href={`/products/${relatedProduct.slug}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="block h-full cursor-pointer"
                                >
                                    <Card className="h-full hover:shadow-xl transition-all duration-300 group border-2 hover:border-accent/50 flex flex-col">
                                        <CardHeader>
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <Badge variant="secondary" className="shrink-0">
                                                    {relatedProduct.pricingType}
                                                </Badge>
                                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                                            </div>
                                            <CardTitle className="group-hover:text-accent transition-colors text-xl">
                                                {relatedProduct.title}
                                            </CardTitle>
                                            <CardDescription className="text-sm leading-relaxed min-h-[40px]">
                                                {relatedProduct.shortDesc || relatedProduct.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-1">
                                            {relatedProduct.features && (
                                                <div className="space-y-2">
                                                    {relatedProduct.features.slice(0, 3).map((feature, i) => (
                                                        <div key={i} className="flex items-start gap-2 text-sm">
                                                            <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                                                            <span className="text-muted-foreground">{feature}</span>
                                                        </div>
                                                    ))}
                                                    {relatedProduct.features.length > 3 && (
                                                        <p className="text-xs text-muted-foreground pl-6">
                                                            +{relatedProduct.features.length - 3} more features
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </Section>
            )}

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
                                <CardTitle className="text-3xl md:text-4xl mb-4">
                                    Ready to Get Started?
                                </CardTitle>
                                <CardDescription className="text-lg">
                                    Schedule a demo with our team and see how {product.title} can transform your business
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-8">
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button size="lg" className="cursor-pointer" asChild>
                                        <Link href="/contact">
                                            Schedule Demo
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="cursor-pointer" asChild>
                                        <Link href="/pricing">View Pricing</Link>
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
