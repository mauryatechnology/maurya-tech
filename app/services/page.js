import React from 'react';
import { ServicesPage } from '@/components/pages/services/ServicesPage';
import { services as initialServicesData } from '@/data/services';
import connectToDatabase from '@/lib/mongodb';
import Service from '@/lib/models/Service';

export const revalidate = 60;

export const metadata = {
  title: 'Services & Capabilities',
  description:
    'Explore our software engineering services: Custom Web Development, Mobile Apps, Cloud Solutions, AI/ML Automation, and Enterprise Consulting.',
  alternates: {
    canonical: '/services',
  },
};

async function getServicesData() {
  try {
    await connectToDatabase();
    const dbServices = await Service.find({ isPublished: true }).sort({ order: 1, createdAt: -1 }).lean();

    if (dbServices && dbServices.length > 0) {
      const formattedServices = dbServices.map((s) => ({
        id: s.customId || s._id.toString(),
        icon: s.icon || 'Code',
        title: s.title,
        shortDescription: s.shortDescription,
        fullDescription: s.fullDescription,
        features: s.features || [],
        technologies: s.technologies || [],
      }));

      return {
        ...initialServicesData,
        services: formattedServices,
      };
    }
  } catch (err) {
    console.warn('MongoDB Services list fallback:', err.message);
  }

  return initialServicesData;
}

export default async function Services() {
  const dynamicServicesData = await getServicesData();
  return <ServicesPage servicesData={dynamicServicesData} />;
}
