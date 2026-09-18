'use client';

import React, { useState } from 'react';
import { CalculatorContainer } from '@/components/tools/CalculatorContainer';
import {
  FileText,
  Printer,
  Plus,
  Trash2,
  Sparkles,
  Download,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  FolderGit2,
  CheckCircle2,
} from 'lucide-react';

const SAMPLE_PROFILE = {
  fullName: 'Aryan Sharma',
  title: 'Senior Full Stack & Distributed Systems Engineer',
  email: 'aryan.sharma@example.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, India',
  website: 'https://github.com/aryansharma',
  summary:
    'High-impact software engineer with 6+ years designing scalable microservices, Next.js web applications, and real-time data pipelines. Proven record of reducing API latency by 45% and driving 99.99% system uptime.',
  experience: [
    {
      id: 1,
      role: 'Staff Software Engineer',
      company: 'HyperScale Cloud Labs',
      location: 'Bengaluru / Remote',
      dates: '2023 - Present',
      bullets:
        'Architected real-time WebSocket ingestion service handling 40,000 requests/sec with Node.js and Redis.\nLed cross-functional migration to Next.js 15 App Router, improving Core Web Vitals to 98th percentile.',
    },
    {
      id: 2,
      role: 'Software Development Engineer II',
      company: 'FinTech Dynamics',
      location: 'Pune, India',
      dates: '2021 - 2023',
      bullets:
        'Built automated reconciliation engine in Go and MongoDB processing ₹500M+ in daily transaction volume.\nMentored 6 junior engineers and standardized Jest/Playwright automated test suites across 4 repositories.',
    },
  ],
  education: [
    {
      id: 1,
      degree: 'B.Tech in Computer Science & Engineering',
      school: 'National Institute of Technology (NIT)',
      year: '2017 - 2021',
      grade: 'CGPA: 8.8 / 10.0',
    },
  ],
  skills:
    'JavaScript, TypeScript, React, Next.js, Node.js, Python, PostgreSQL, MongoDB, Docker, Kubernetes, AWS, GraphQL, TailwindCSS',
  projects: [
    {
      id: 1,
      title: 'Distributed Task Queue (Open Source)',
      tech: 'Go, Redis, Docker',
      description:
        'High-throughput asynchronous job broker with exponential backoff and dead-letter queue monitoring. 1,200+ GitHub stars.',
    },
  ],
};

export function ResumeBuilder({
  country = 'in',
  countryName = 'India',
  computeConfig = {},
  tool,
}) {
  const [profile, setProfile] = useState(SAMPLE_PROFILE);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'experience', 'education', 'skills', 'projects'
  const [mobileView, setMobileView] = useState('edit'); // 'edit' or 'preview' on small viewports

  const handlePrint = () => {
    window.print();
  };

  const loadSample = () => {
    setProfile(SAMPLE_PROFILE);
  };

  const resetAll = () => {
    setProfile({
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      summary: '',
      experience: [],
      education: [],
      skills: '',
      projects: [],
    });
  };

  // Add items
  const addExperience = () => {
    setProfile((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now(),
          role: 'Software Engineer',
          company: 'Company Name',
          location: 'Location',
          dates: '2022 - Present',
          bullets: 'Built high-traffic API microservices.\nOptimized SQL queries by 30%.',
        },
      ],
    }));
  };

  const removeExperience = (id) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));
  };

  const updateExperience = (id, field, value) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  };

  const addEducation = () => {
    setProfile((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now(),
          degree: 'Degree / Major',
          school: 'University Name',
          year: '2020 - 2024',
          grade: 'CGPA or Percentage',
        },
      ],
    }));
  };

  const removeEducation = (id) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  };

  const updateEducation = (id, field, value) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  };

  const addProject = () => {
    setProfile((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: Date.now(),
          title: 'New Project',
          tech: 'Tech Stack',
          description: 'Bullet description of what you built and achieved.',
        },
      ],
    }));
  };

  const removeProject = (id) => {
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const updateProject = (id, field, value) => {
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  };

  const summaryText = `ATS Resume: ${profile.fullName || 'Candidate'} - ${profile.title || 'Professional'} (${profile.experience.length} experiences, ${profile.education.length} degrees)`;

  return (
    <CalculatorContainer
      country={country}
      countryName={countryName}
      toolName={tool?.name || 'Free ATS Resume & CV Builder 2026'}
      category="salary"
      badge="Career Engine"
      description="Design a clean, ATS-compliant software engineering and professional resume in minutes. Live split-screen preview with instant browser PDF export."
      resultSummaryText={summaryText}
      faqs={tool?.seo?.faqSchema || []}
    >
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadSample}
              className="px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Tech Profile</span>
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Clear Form
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-sm shadow-cyan-500/20 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print or Export as PDF</span>
          </button>
        </div>

        {/* Mobile View Switcher */}
        <div className="flex lg:hidden p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setMobileView('edit')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
              mobileView === 'edit'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Edit Resume Details
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
              mobileView === 'preview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Resume Sheet Preview
          </button>
        </div>

        {/* Split Screen: Left Editor, Right Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Editor Controls */}
          <div
            className={`lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5 ${
              mobileView === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Editor Tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-3">
              {[
                { id: 'personal', label: 'Personal Info' },
                { id: 'experience', label: `Experience (${profile.experience.length})` },
                { id: 'education', label: `Education (${profile.education.length})` },
                { id: 'skills', label: 'Skills' },
                { id: 'projects', label: `Projects (${profile.projects.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Personal Info */}
            {activeTab === 'personal' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      placeholder="e.g. Aryan Sharma"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Professional Headline
                    </label>
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      placeholder="e.g. Senior Full Stack Engineer"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="user@example.com"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Location</label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      placeholder="Bengaluru, India"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    LinkedIn / GitHub / Portfolio URL
                  </label>
                  <input
                    type="text"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Professional Summary (ATS Hook)
                  </label>
                  <textarea
                    rows={4}
                    value={profile.summary}
                    onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                    placeholder="2-3 impactful sentences highlighting your experience and core stack..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            {/* Tab: Experience */}
            {activeTab === 'experience' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Employment History</span>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Role</span>
                  </button>
                </div>

                {profile.experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                        placeholder="Job Title"
                        className="font-bold text-slate-900 bg-transparent border-b border-transparent focus:border-cyan-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeExperience(exp.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        title="Delete Role"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        placeholder="Company"
                        className="p-1.5 rounded-lg bg-white border border-slate-200"
                      />
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                        placeholder="City, Country"
                        className="p-1.5 rounded-lg bg-white border border-slate-200"
                      />
                      <input
                        type="text"
                        value={exp.dates}
                        onChange={(e) => updateExperience(exp.id, 'dates', e.target.value)}
                        placeholder="Dates (e.g. 2022 - 2024)"
                        className="p-1.5 rounded-lg bg-white border border-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 text-[11px] mb-1">
                        Impact Bullets (One per line)
                      </label>
                      <textarea
                        rows={3}
                        value={exp.bullets}
                        onChange={(e) => updateExperience(exp.id, 'bullets', e.target.value)}
                        placeholder="• Increased system throughput by 30%..."
                        className="w-full p-2 rounded-lg bg-white border border-slate-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Education */}
            {activeTab === 'education' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Degrees & Qualifications</span>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Degree</span>
                  </button>
                </div>

                {profile.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        placeholder="Degree / Major"
                        className="font-bold text-slate-900 bg-transparent border-b border-transparent focus:border-cyan-500 focus:outline-none w-full"
                      />
                      <button
                        type="button"
                        onClick={() => removeEducation(edu.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                        placeholder="University / College"
                        className="p-1.5 rounded-lg bg-white border border-slate-200"
                      />
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                        placeholder="Years"
                        className="p-1.5 rounded-lg bg-white border border-slate-200"
                      />
                      <input
                        type="text"
                        value={edu.grade}
                        onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)}
                        placeholder="CGPA / Grade"
                        className="p-1.5 rounded-lg bg-white border border-slate-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Skills */}
            {activeTab === 'skills' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Core Technical Skills & Tools (Comma-separated)
                  </label>
                  <textarea
                    rows={5}
                    value={profile.skills}
                    onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                    placeholder="e.g. JavaScript, Python, React, Next.js, Docker, Kubernetes, AWS, PostgreSQL"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Tip: Group key keywords from the job description to maximize ATS keyword match score.
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Projects */}
            {activeTab === 'projects' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Featured Projects</span>
                  <button
                    type="button"
                    onClick={addProject}
                    className="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                {profile.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                        placeholder="Project Title"
                        className="font-bold text-slate-900 bg-transparent border-b border-transparent focus:border-cyan-500 focus:outline-none w-full"
                      />
                      <button
                        type="button"
                        onClick={() => removeProject(proj.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={proj.tech}
                      onChange={(e) => updateProject(proj.id, 'tech', e.target.value)}
                      placeholder="Tech stack (e.g. React, Next.js, Node)"
                      className="w-full p-1.5 rounded-lg bg-white border border-slate-200"
                    />
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                      placeholder="Description & achievements"
                      className="w-full p-2 rounded-lg bg-white border border-slate-200"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Live Resume Sheet (Printable A4 preview) */}
          <div className={`lg:col-span-6 w-full ${mobileView === 'edit' ? 'hidden lg:block' : 'block'}`}>
            <style>{`
              @media print {
                body * {
                  visibility: hidden !important;
                }
                #printable-resume, #printable-resume * {
                  visibility: visible !important;
                }
                #printable-resume {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  max-width: 100% !important;
                  margin: 0 !important;
                  padding: 20mm !important;
                  border: none !important;
                  box-shadow: none !important;
                }
              }
            `}</style>
            <div
              id="printable-resume"
              className="bg-white border border-slate-300 rounded-3xl p-8 sm:p-10 shadow-lg text-slate-900 font-sans space-y-6 max-w-2xl mx-auto"
            >
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-4">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">
                  {profile.fullName || 'YOUR NAME'}
                </h1>
                <p className="text-sm font-semibold text-cyan-700 tracking-wide mt-0.5">
                  {profile.title || 'Professional Title'}
                </p>

                {/* Contact Line */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 mt-3">
                  {profile.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {profile.email}
                    </span>
                  )}
                  {profile.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {profile.phone}
                    </span>
                  )}
                  {profile.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {profile.location}
                    </span>
                  )}
                  {profile.website && (
                    <span className="flex items-center gap-1 font-mono text-cyan-700">
                      <Globe className="w-3 h-3 text-slate-400" />
                      {profile.website.replace('https://', '')}
                    </span>
                  )}
                </div>
              </div>

              {/* Summary */}
              {profile.summary && (
                <div className="space-y-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                    Professional Summary
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed">{profile.summary}</p>
                </div>
              )}

              {/* Experience */}
              {profile.experience.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                    Work Experience
                  </h2>
                  {profile.experience.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex items-baseline justify-between text-xs font-bold text-slate-900">
                        <span>{exp.role}</span>
                        <span className="text-[11px] font-medium text-slate-500">{exp.dates}</span>
                      </div>
                      <div className="flex items-baseline justify-between text-[11px] text-slate-600 italic">
                        <span>{exp.company}</span>
                        <span>{exp.location}</span>
                      </div>
                      <div className="text-[11px] text-slate-700 pl-3 pt-0.5 space-y-0.5">
                        {(exp.bullets || '')
                          .split('\n')
                          .filter(Boolean)
                          .map((b, i) => (
                            <div key={i} className="leading-relaxed list-disc">
                              • {b.replace(/^[•\-\*]\s*/, '')}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {profile.education.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                    Education
                  </h2>
                  {profile.education.map((edu) => (
                    <div key={edu.id} className="flex items-baseline justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{edu.degree}</span>
                        <span className="text-slate-600"> — {edu.school}</span>
                        {edu.grade && (
                          <span className="text-[11px] text-slate-500 font-mono"> ({edu.grade})</span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">{edu.year}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {profile.projects.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                    Key Projects
                  </h2>
                  {profile.projects.map((p) => (
                    <div key={p.id} className="text-xs space-y-0.5">
                      <div className="font-bold text-slate-900">
                        {p.title}
                        {p.tech && (
                          <span className="font-normal text-[11px] text-slate-500">
                            {' '}
                            | {p.tech}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-700">{p.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {profile.skills && (
                <div className="space-y-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                    Skills & Technologies
                  </h2>
                  <p className="text-[11px] text-slate-700 leading-relaxed">{profile.skills}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CalculatorContainer>
  );
}
