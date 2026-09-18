'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout';
import { Section, ProcessStep } from '@/components/sections';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MapPin, Globe, ArrowRight, MessageCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { TurnstileWidget } from '@/components/common/TurnstileWidget';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

export function ContactPage({ contactData: serverContactData }) {
    const { contactData: contextContactData } = useData();
    const contactData = serverContactData || contextContactData;
    const { hero, info, process, form } = contactData;
    const [loading, setLoading] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState('');

    // Form States with Honeypot field for bot protection
    const [userForm, setUserForm] = useState({ name: '', email: '', subject: '', message: '', website_hp: '' });
    const [companyForm, setCompanyForm] = useState({ contactName: '', workEmail: '', companyName: '', jobTitle: '', service: '', budget: '', details: '', website_hp: '' });
    const [salesForm, setSalesForm] = useState({ fullName: '', officialEmail: '', organization: '', partnershipType: '', message: '', website_hp: '' });

    const handleFormSubmit = async (e, type, data) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, data, turnstileToken }),
            });

            const result = await response.json();

            if (response.ok) {
                setSuccessOpen(true);
                // Reset forms
                setUserForm({ name: '', email: '', subject: '', message: '', website_hp: '' });
                setCompanyForm({ contactName: '', workEmail: '', companyName: '', jobTitle: '', service: '', budget: '', details: '', website_hp: '' });
                setSalesForm({ fullName: '', officialEmail: '', organization: '', partnershipType: '', message: '', website_hp: '' });
            } else {
                toast.error(result.message || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            toast.error('Network error. Please ensure the backend server is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout page="contact">
            <section className="hero-gradient pt-32 pb-12 md:pb-20">
                <div className="container-custom">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
                        <span className="inline-block text-accent font-medium text-sm uppercase tracking-wider mb-4">{hero.subtitle}</span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-hero-foreground mb-6">{hero.title}</h1>
                        <p className="text-lg md:text-xl text-hero-muted leading-relaxed">{hero.description}</p>
                    </motion.div>
                </div>
            </section>


            <Section className="section-padding">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="space-y-8">

                            <h2 className="font-heading font-bold text-2xl mb-6">{process.title}</h2>
                            {process.steps.map((step, index) => (
                                <ProcessStep key={index} number={step.number} title={step.title} description={step.description} isLast={index === process.steps.length - 1} index={index} />
                            ))}
                            <div className="mt-8 p-6 bg-muted rounded-2xl space-y-4">
                                <a href={`mailto:${info.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-accent"><Mail className="w-5 h-5" />{info.email}</a>
                                <a href={`tel:${info.phone}`} className="flex items-center gap-3 text-muted-foreground hover:text-accent"><Phone className="w-5 h-5" />{info.phone}</a>
                                <div className="flex items-center gap-3 text-muted-foreground"><MapPin className="w-5 h-5" />{info.location}</div>
                                <div className="flex items-center gap-3 text-muted-foreground"><Globe className="w-5 h-5" />{info.website}</div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-8 bg-card rounded-2xl border border-border">
                            <Tabs defaultValue="user" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50 p-1 rounded-xl">
                                    <TabsTrigger value="user" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">User Inquiry</TabsTrigger>
                                    <TabsTrigger value="company" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Company</TabsTrigger>
                                    <TabsTrigger value="sales" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Sales / Partner</TabsTrigger>
                                </TabsList>

                                {/* USER FORM */}
                                <TabsContent value="user" className="space-y-6">
                                    <form onSubmit={(e) => handleFormSubmit(e, 'user', userForm)} className="space-y-4">
                                        {/* Anti-Bot Honeypot Field */}
                                        <div className="opacity-0 absolute -z-50 pointer-events-none h-0 w-0 overflow-hidden" aria-hidden="true">
                                            <label htmlFor="user-form-hp">Leave this field blank</label>
                                            <input
                                                id="user-form-hp"
                                                type="text"
                                                name="website_hp"
                                                tabIndex={-1}
                                                autoComplete="off"
                                                value={userForm.website_hp || ''}
                                                onChange={e => setUserForm({ ...userForm, website_hp: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-heading font-semibold text-lg">How can we help you?</h3>
                                            <p className="text-sm text-muted-foreground">For general questions and individual inquiries.</p>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="user-form-name" className="text-sm font-medium">Your Name</label>
                                                <Input id="user-form-name" placeholder="John Doe" required value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="user-form-email" className="text-sm font-medium">Email Address</label>
                                                <Input id="user-form-email" type="email" placeholder="john@example.com" required value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="user-form-subject" className="text-sm font-medium">Subject</label>
                                            <Select value={userForm.subject} onValueChange={val => setUserForm({ ...userForm, subject: val })}>
                                                <SelectTrigger id="user-form-subject">
                                                    <SelectValue placeholder="Select a topic" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="general">General Question</SelectItem>
                                                    <SelectItem value="support">Support</SelectItem>
                                                    <SelectItem value="feedback">Feedback</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="user-form-message" className="text-sm font-medium">Message</label>
                                            <Textarea id="user-form-message" placeholder="Tell us what you need..." rows={4} required value={userForm.message} onChange={e => setUserForm({ ...userForm, message: e.target.value })} />
                                        </div>
                                        <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken('')} />
                                        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
                                            {loading ? 'Sending...' : 'Send Message'} <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </form>
                                </TabsContent>

                                {/* COMPANY FORM */}
                                <TabsContent value="company" className="space-y-6">
                                    <form onSubmit={(e) => handleFormSubmit(e, 'company', companyForm)} className="space-y-4">
                                        {/* Anti-Bot Honeypot Field */}
                                        <div className="opacity-0 absolute -z-50 pointer-events-none h-0 w-0 overflow-hidden" aria-hidden="true">
                                            <label htmlFor="company-form-hp">Leave this field blank</label>
                                            <input
                                                id="company-form-hp"
                                                type="text"
                                                name="website_hp"
                                                tabIndex={-1}
                                                autoComplete="off"
                                                value={companyForm.website_hp || ''}
                                                onChange={e => setCompanyForm({ ...companyForm, website_hp: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-heading font-semibold text-lg">Start a Project</h3>
                                            <p className="text-sm text-muted-foreground">Tell us about your business needs and project requirements.</p>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="company-form-contact-name" className="text-sm font-medium">Contact Name</label>
                                                <Input id="company-form-contact-name" placeholder="Full Name" required value={companyForm.contactName} onChange={e => setCompanyForm({ ...companyForm, contactName: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="company-form-work-email" className="text-sm font-medium">Work Email</label>
                                                <Input id="company-form-work-email" type="email" placeholder="name@company.com" required value={companyForm.workEmail} onChange={e => setCompanyForm({ ...companyForm, workEmail: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="company-form-company-name" className="text-sm font-medium">Company Name</label>
                                                <Input id="company-form-company-name" placeholder="Company Inc." required value={companyForm.companyName} onChange={e => setCompanyForm({ ...companyForm, companyName: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="company-form-job-title" className="text-sm font-medium">Job Title</label>
                                                <Input id="company-form-job-title" placeholder="e.g. CTO, Product Manager" value={companyForm.jobTitle} onChange={e => setCompanyForm({ ...companyForm, jobTitle: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="company-form-service" className="text-sm font-medium">Service Needed</label>
                                                <Select value={companyForm.service} onValueChange={val => setCompanyForm({ ...companyForm, service: val })}>
                                                    <SelectTrigger id="company-form-service">
                                                        <SelectValue placeholder="Select Service" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {form.fields.service.options.map((opt) => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="company-form-budget" className="text-sm font-medium">Estimated Budget</label>
                                                <Select value={companyForm.budget} onValueChange={val => setCompanyForm({ ...companyForm, budget: val })}>
                                                    <SelectTrigger id="company-form-budget">
                                                        <SelectValue placeholder="Select Budget" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {form.fields.budget.options.map((opt) => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="company-form-details" className="text-sm font-medium">Project Details</label>
                                            <Textarea id="company-form-details" placeholder="Describe your project goals, timeline, and requirements..." rows={4} required value={companyForm.details} onChange={e => setCompanyForm({ ...companyForm, details: e.target.value })} />
                                        </div>
                                        <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken('')} />
                                        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
                                            {loading ? 'Sending...' : 'Request Consultation'} <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </form>
                                </TabsContent>

                                {/* SALES / PARTNER FORM */}
                                <TabsContent value="sales" className="space-y-6">
                                    <form onSubmit={(e) => handleFormSubmit(e, 'sales', salesForm)} className="space-y-4">
                                        {/* Anti-Bot Honeypot Field */}
                                        <div className="opacity-0 absolute -z-50 pointer-events-none h-0 w-0 overflow-hidden" aria-hidden="true">
                                            <label htmlFor="sales-form-hp">Leave this field blank</label>
                                            <input
                                                id="sales-form-hp"
                                                type="text"
                                                name="website_hp"
                                                tabIndex={-1}
                                                autoComplete="off"
                                                value={salesForm.website_hp || ''}
                                                onChange={e => setSalesForm({ ...salesForm, website_hp: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-heading font-semibold text-lg">Partnership Opportunities</h3>
                                            <p className="text-sm text-muted-foreground">Connect with our sales team for partnerships and enterprise solutions.</p>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="sales-form-full-name" className="text-sm font-medium">Full Name</label>
                                                <Input id="sales-form-full-name" placeholder="Name" required value={salesForm.fullName} onChange={e => setSalesForm({ ...salesForm, fullName: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="sales-form-official-email" className="text-sm font-medium">Official Email</label>
                                                <Input id="sales-form-official-email" type="email" placeholder="email@organization.com" required value={salesForm.officialEmail} onChange={e => setSalesForm({ ...salesForm, officialEmail: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="sales-form-organization" className="text-sm font-medium">Organization / Agency</label>
                                                <Input id="sales-form-organization" placeholder="Organization Name" required value={salesForm.organization} onChange={e => setSalesForm({ ...salesForm, organization: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="sales-form-partnership-type" className="text-sm font-medium">Partnership Type</label>
                                                <Select value={salesForm.partnershipType} onValueChange={val => setSalesForm({ ...salesForm, partnershipType: val })}>
                                                    <SelectTrigger id="sales-form-partnership-type">
                                                        <SelectValue placeholder="Select Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="reseller">Reseller / Agency</SelectItem>
                                                        <SelectItem value="technology">Technology Partner</SelectItem>
                                                        <SelectItem value="affiliate">Affiliate Program</SelectItem>
                                                        <SelectItem value="enterprise">Enterprise Sales</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="sales-form-message" className="text-sm font-medium">Message</label>
                                            <Textarea id="sales-form-message" placeholder="How would you like to partner with us?" rows={4} required value={salesForm.message} onChange={e => setSalesForm({ ...salesForm, message: e.target.value })} />
                                        </div>
                                        <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken('')} />
                                        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
                                            {loading ? 'Sending...' : 'Contact Sales Team'} <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        </motion.div>
                    </div>
                </div>
            </Section>

            <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
                <DialogContent className="sm:max-w-md">

                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-bold flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                <MessageCircle className="w-8 h-8" />
                            </div>
                            Thank You!
                        </DialogTitle>
                        <DialogDescription className="text-center text-lg mt-2">
                            We have received your message and will connect with you soon.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 py-4">
                        <p className="text-muted-foreground text-center">For quicker response, connect with us on WhatsApp:</p>
                        <Button size="lg" className="bg-[#25D366] hover:bg-[#25D366]/90 text-white w-full sm:w-auto gap-2" asChild>
                            <a href="https://wa.me/916263638053" target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="w-5 h-5" />
                                Chat on WhatsApp
                            </a>
                        </Button>
                    </div>
                    <DialogFooter className="sm:justify-center">
                        <Button type="button" variant="secondary" onClick={() => setSuccessOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </Layout >
    );
}
