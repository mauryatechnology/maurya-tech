import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import Job from '@/lib/models/Job';
import Project from '@/lib/models/Project';
import Service from '@/lib/models/Service';
import Post from '@/lib/models/Post';
import { hashPassword, verifyToken } from '@/lib/auth';
import { logSecurityEvent } from '@/lib/securityLogger';
import { getClientIp } from '@/lib/rateLimit';

import { jobs as initialJobs } from '@/data/jobs';
import { projects as initialProjects } from '@/data/projects';
import { services as initialServices } from '@/data/services';
import { posts as initialPosts } from '@/data/posts';

export async function POST(req) {
  try {
    await connectToDatabase();
    const existingUsers = await User.countDocuments();

    // Content seeding mutates the live database. When bootstrapping the first
    // superadmin (existingUsers === 0), allow authorization via setup secret
    // or local dev environment. Otherwise strictly require active superadmin token.
    const authUser = await verifyToken(req.cookies.get('admin_token')?.value);
    const setupSecret = req.headers.get('x-setup-secret');
    const cronSecret = process.env.CRON_SECRET;
    const isSetupAuthorized = existingUsers === 0 && Boolean(
      (cronSecret && setupSecret === cronSecret) ||
      (process.env.SEED_ADMIN_PASSWORD && setupSecret === process.env.SEED_ADMIN_PASSWORD) ||
      process.env.NODE_ENV !== 'production'
    );

    if (!isSetupAuthorized && (!authUser || authUser.role !== 'superadmin')) {
      logSecurityEvent({
        eventType: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        ip: getClientIp(req),
        endpoint: '/api/admin/seed',
        details: { role: authUser?.role || 'anonymous', existingUsers },
      });
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // 1. Bootstrap the primary superadmin only when no user exists at all.
    //    Credentials come from the environment - never hardcoded - and an
    //    existing admin's password/PIN is never overwritten by a re-seed.
    let adminSeedResult = 'Skipped (admin users already present)';

    if (existingUsers === 0) {
      const adminEmail = process.env.SEED_ADMIN_EMAIL;
      const adminPassword = process.env.SEED_ADMIN_PASSWORD;
      const adminPin = process.env.SEED_ADMIN_PIN;

      if (!adminEmail || !adminPassword) {
        return NextResponse.json(
          {
            success: false,
            message:
              'No admin exists yet. Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD (optionally SEED_ADMIN_PIN) in the environment before seeding.',
          },
          { status: 400 }
        );
      }

      await User.create({
        name: process.env.SEED_ADMIN_NAME || 'Administrator',
        email: adminEmail.toLowerCase().trim(),
        password: await hashPassword(adminPassword),
        securityPin: adminPin ? await hashPassword(adminPin.trim()) : undefined,
        role: 'superadmin',
      });

      adminSeedResult = `Bootstrapped superadmin ${adminEmail}`;
    }

    // 2. Seed Jobs
    let seededJobsCount = 0;
    if (initialJobs && initialJobs.jobs) {
      for (const j of initialJobs.jobs) {
        await Job.findOneAndUpdate(
          { customId: j.id },
          {
            customId: j.id,
            title: j.title,
            department: j.department,
            location: j.location,
            type: j.type,
            experience: j.experience,
            salary: j.salary || '',
            skills: j.skills || [],
            description: j.description,
            responsibilities: j.responsibilities || [],
            requirements: j.requirements || [],
            benefits: j.benefits || [],
            isActive: j.isActive !== undefined ? j.isActive : true,
          },
          { upsert: true, new: true }
        );
        seededJobsCount++;
      }
    }

    // 3. Seed Projects
    let seededProjectsCount = 0;
    if (initialProjects && initialProjects.projects) {
      for (const p of initialProjects.projects) {
        await Project.findOneAndUpdate(
          { slug: p.slug },
          {
            customId: p.id,
            slug: p.slug,
            title: p.title,
            category: p.category,
            role: p.role,
            shortDescription: p.shortDescription,
            fullDescription: p.fullDescription,
            problem: p.problem,
            solution: p.solution,
            keyFeatures: p.keyFeatures || [],
            techStack: p.techStack || {},
            results: p.results || [],
            thumbnail: p.thumbnail,
            liveLink: p.liveLink,
            githubLink: p.githubLink,
            desktopImages: p.desktopImages || [],
            mobileImages: p.mobileImages || [],
            isFeatured: true,
            isPublished: true,
          },
          { upsert: true, new: true }
        );
        seededProjectsCount++;
      }
    }

    // 4. Seed Services
    let seededServicesCount = 0;
    if (initialServices && initialServices.services) {
      for (const s of initialServices.services) {
        await Service.findOneAndUpdate(
          { customId: s.id },
          {
            customId: s.id,
            icon: s.icon,
            title: s.title,
            shortDescription: s.shortDescription,
            fullDescription: s.fullDescription,
            features: s.features || [],
            technologies: s.technologies || [],
            isPublished: true,
          },
          { upsert: true, new: true }
        );
        seededServicesCount++;
      }
    }

    // 5. Seed Posts
    let seededPostsCount = 0;
    if (initialPosts && initialPosts.posts) {
      for (const post of initialPosts.posts) {
        await Post.findOneAndUpdate(
          { slug: post.slug },
          {
            customId: post.id,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            author: post.author,
            date: post.date,
            readTime: post.readTime,
            category: post.category,
            tags: post.tags || [],
            featured: post.featured || false,
            isPublished: true,
          },
          { upsert: true, new: true }
        );
        seededPostsCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with primary admin and website data!',
      details: {
        adminUser: adminSeedResult,
        seededJobs: seededJobsCount,
        seededProjects: seededProjectsCount,
        seededServices: seededServicesCount,
        seededPosts: seededPostsCount,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
