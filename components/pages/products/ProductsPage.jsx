'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { Section } from '@/components/sections';
import { useData } from '@/contexts/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    LayoutGrid, Globe, Smartphone, Bot, Building,
    Megaphone, Shield, Check, Search, ArrowRight,
    Sparkles, Zap, TrendingUp, Filter
} from 'lucide-react';

const iconMap = {
    LayoutGrid, Globe, Smartphone, Bot, Building,
    Megaphone, Shield
};

export function ProductsPage({ productsData: serverProductsData }) {
    const { productsData: contextProductsData } = useData();
    const productsData = serverProductsData || contextProductsData;
    const { title, subtitle, categories } = productsData;
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const activeCategory = categories.find(c => c.id === selectedCategory);

    const stats = [
        { icon: Sparkles, label: 'Products', value: `${categories.reduce((acc, cat) => acc + cat.products.length, 0)}+` },
        { icon: LayoutGrid, label: 'Categories', value: categories.length },
        { icon: TrendingUp, label: 'Industries Served', value: '15+' },
    ];

    return (
        <Layout page="products">
            {/* Hero Section */}
            <section className="relative hero-gradient pt-32 pb-12 md:pb-20 overflow-hidden">
                {/* Animated Background Elements */}
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
                            <Zap className="w-4 h-4 text-accent" />
                            <span className="text-accent font-medium text-sm">Enterprise-Grade Solutions</span>
                        </motion.div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-hero-foreground mb-6 leading-tight">
                            {title}
                        </h1>
                        <p className="text-lg md:text-xl text-hero-muted leading-relaxed mb-8 max-w-3xl mx-auto">
                            {subtitle}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                        className="text-center"
                                    >
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 mb-2">
                                            <Icon className="w-6 h-6 text-accent" />
                                        </div>
                                        <div className="font-heading font-bold text-2xl md:text-3xl text-hero-foreground">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-hero-muted">{stat.label}</div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Products Grid with Integrated Search and Filters */}
            <Section className="section-padding bg-gradient-to-b from-background to-muted/20">
                <div className="container-custom">
                    {/* Search and Filter Header */}
                    <div className="mb-12">
                        {/* Search Bar */}
                        <div className="relative max-w-3xl mx-auto mb-8">
                            <div className="relative">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
                                <Input
                                    placeholder="Search products across all categories..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-14 pr-6 h-16 text-base border-2 focus:border-accent shadow-sm hover:shadow-md transition-shadow rounded-xl bg-background"
                                />
                            </div>
                        </div>

                        {/* Category Filter Dropdown */}
                        <div className="max-w-md mx-auto">
                            <div className="flex items-center gap-3">
                                <Filter className="w-5 h-5 text-muted-foreground shrink-0" />
                                <Select
                                    value={selectedCategory || "all"}
                                    onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
                                >
                                    <SelectTrigger className="h-12 border-2 hover:border-accent transition-colors">
                                        <SelectValue placeholder="Filter by category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            <div className="flex items-center gap-2">
                                                <LayoutGrid className="w-4 h-4" />
                                                <span>All Products</span>
                                                <Badge variant="secondary" className="ml-auto">
                                                    {categories.reduce((acc, cat) => acc + cat.products.length, 0)}
                                                </Badge>
                                            </div>
                                        </SelectItem>
                                        {categories.map((category) => {
                                            const Icon = iconMap[category.icon] || LayoutGrid;
                                            return (
                                                <SelectItem key={category.id} value={category.id}>
                                                    <div className="flex items-center gap-2">
                                                        <Icon className="w-4 h-4" />
                                                        <span>{category.title}</span>
                                                        <Badge variant="secondary" className="ml-auto">
                                                            {category.products.length}
                                                        </Badge>
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Active Filter Display */}
                        <div className="mt-6 min-h-[28px]">
                            {selectedCategory && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center"
                                >
                                    <p className="text-sm text-muted-foreground">
                                        Showing <span className="font-semibold text-accent">{activeCategory?.title}</span>
                                        {searchQuery && <> matching &ldquo;<span className="font-semibold text-foreground">{searchQuery}</span>&rdquo;</>}
                                    </p>
                                </motion.div>
                            )}

                            {searchQuery && !selectedCategory && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center"
                                >
                                    <p className="text-sm text-muted-foreground">
                                        Searching across all categories for &ldquo;<span className="font-semibold text-accent">{searchQuery}</span>&rdquo;
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <AnimatePresence mode="wait">
                        {(() => {
                            // Get filtered products
                            let productsToShow = [];

                            if (selectedCategory) {
                                // Filter by selected category
                                productsToShow = activeCategory?.products.filter(product =>
                                    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
                                ) || [];
                            } else {
                                // Show all products from all categories
                                productsToShow = categories.flatMap(cat =>
                                    cat.products.filter(product =>
                                        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                );
                            }

                            return (
                                <motion.div
                                    key={selectedCategory || 'all'}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {productsToShow.length > 0 ? (
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {productsToShow.map((product, index) => (
                                                <motion.a
                                                    key={product.id}
                                                    href={`/products/${product.slug}`}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="h-full block"
                                                >
                                                    <Card className="h-full hover:shadow-xl transition-all duration-300 group border-2 hover:border-accent/50 flex flex-col cursor-pointer">
                                                        <CardHeader className="flex-none">
                                                            <div className="flex items-start justify-between gap-2 mb-3">
                                                                {product.pricingType && (
                                                                    <Badge variant="secondary" className="shrink-0">
                                                                        {product.pricingType}
                                                                    </Badge>
                                                                )}
                                                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                                                            </div>
                                                            <CardTitle className="group-hover:text-accent transition-colors mb-2">
                                                                {product.title}
                                                            </CardTitle>
                                                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                                {product.shortDesc || product.description}
                                                            </p>
                                                        </CardHeader>
                                                        <CardContent className="flex-1">
                                                            {product.features && (
                                                                <div className="space-y-2">
                                                                    {product.features.slice(0, 4).map((feature, i) => (
                                                                        <div key={i} className="flex items-start gap-2 text-sm">
                                                                            <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                                                                            <span className="text-muted-foreground">{feature}</span>
                                                                        </div>
                                                                    ))}
                                                                    {product.features.length > 4 && (
                                                                        <p className="text-xs text-muted-foreground pl-6">
                                                                            +{product.features.length - 4} more features
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                </motion.a>
                                            ))}
                                        </div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-16"
                                        >
                                            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                                                <Search className="w-10 h-10 text-muted-foreground" />
                                            </div>
                                            <h3 className="font-heading font-bold text-2xl mb-2">No products found</h3>
                                            <p className="text-muted-foreground mb-6">
                                                Try adjusting your search or filters
                                            </p>
                                            <Button onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}>
                                                Clear Filters
                                            </Button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })()}
                    </AnimatePresence>
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
                                    Ready to Transform Your Business?
                                </CardTitle>
                                <CardDescription className="text-lg md:text-xl">
                                    Get in touch with our team to discuss your requirements and explore the perfect solution for your needs.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-8">
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button
                                        size="lg"
                                        className="cursor-pointer"
                                        asChild
                                    >
                                        <Link href="/contact">
                                            Request a Demo
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </Link>
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="cursor-pointer"
                                        asChild
                                    >
                                        <Link href="/pricing">View Pricing Plans</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </Section>
        </Layout >
    );
}
