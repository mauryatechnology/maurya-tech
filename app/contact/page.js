import React from 'react';
import { ContactPage } from '@/components/pages/contact/ContactPage';
import { contacts as contactData } from '@/data/contacts';

export const metadata = {
    title: 'Contact Us',
    description: 'Get in Touch: Start your project with a risk-free pilot. Contact Maurya Technologies today.',
    alternates: {
        canonical: '/contact',
    },
}

export default function Contact() {
    return <ContactPage contactData={contactData} />;
}
