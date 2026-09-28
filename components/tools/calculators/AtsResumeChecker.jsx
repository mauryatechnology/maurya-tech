'use client';

import React, { useState, useMemo } from 'react';
import { CalculatorContainer } from '@/components/tools/CalculatorContainer';
import { CheckoutModal } from '@/components/products/CheckoutModal';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';

const TECH_KEYWORDS = [
  'react', 'next.js', 'typescript', 'javascript', 'node.js', 'python', 'docker',
  'kubernetes', 'aws', 'ci/cd', 'git', 'sql', 'mongodb', 'postgresql', 'rest api',
  'graphql', 'tailwind', 'microservices', 'redis', 'testing', 'jest', 'cypress',
  'flutter', 'dart', 'performance', 'agile', 'linux'
];

const ACTION_VERBS = [
  'architected', 'engineered', 'developed', 'deployed', 'optimized', 'reduced',
  'increased', 'scaled', 'implemented', 'designed', 'built', 'led', 'automated',
  'spearheaded', 'orchestrated', 'cut', 'accelerated', 'transformed'
];

const WEAK_BUZZWORDS = [
  'hardworking', 'team player', 'motivated', 'passionate', 'detail-oriented',
  'results-driven', 'go-getter', 'self-starter', 'synergy', 'dynamic'
];

export function AtsResumeChecker({
  country = 'in',
  countryName = 'India',
  computeConfig = {},
  tool,
}) {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack / Software Engineer');
  const [modalOpen, setModalOpen] = useState(false);

  const analysis = useMemo(() => {
    const text = resumeText.toLowerCase().trim();
    if (!text || text.length < 50) {
      return null;
    }

    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // 1. Keyword Matches
    const matchedKeywords = TECH_KEYWORDS.filter((kw) => text.includes(kw));
    const keywordScore = Math.min(30, Math.round((matchedKeywords.length / 8) * 30));

    // 2. Action Verbs
    const matchedVerbs = ACTION_VERBS.filter((verb) => text.includes(verb));
    const verbScore = Math.min(25, Math.round((matchedVerbs.length / 5) * 25));

    // 3. Measurable Impact (Numbers, %, $, ₹)
    const metricsCount = (text.match(/\d+[%kKmMbB]?|\$\d+|₹\d+/g) || []).length;
    const metricScore = Math.min(25, Math.round((metricsCount / 4) * 25));

    // 4. Section Presence
    const hasExp = /experience|employment|work history/.test(text);
    const hasEdu = /education|university|college|b\.tech|bachelor/.test(text);
    const hasSkills = /skills|technologies|technical/.test(text);
    const hasProjects = /projects|portfolio|open source/.test(text);
    const sectionsCount = [hasExp, hasEdu, hasSkills, hasProjects].filter(Boolean).length;
    const sectionScore = Math.min(20, sectionsCount * 5);

    // 5. Weak Buzzword Penalty
    const foundWeakWords = WEAK_BUZZWORDS.filter((w) => text.includes(w));
    const penalty = foundWeakWords.length * 4;

    const rawTotal = keywordScore + verbScore + metricScore + sectionScore - penalty;
    const finalScore = Math.max(10, Math.min(100, rawTotal));

    return {
      finalScore,
      wordCount,
      matchedKeywords,
      matchedVerbs,
      metricsCount,
      sectionsCount,
      foundWeakWords,
      hasExp,
      hasEdu,
      hasSkills,
      hasProjects,
    };
  }, [resumeText]);

  const summaryText = analysis
    ? `ATS Score: ${analysis.finalScore}/100 (${analysis.wordCount} words, ${analysis.matchedKeywords.length} tech keywords, ${analysis.metricsCount} metric figures).`
    : '';

  return (
    <>
      <CalculatorContainer
        country={country}
        countryName={countryName}
        toolName={tool?.name || "Free ATS Resume Checker"}
        category="career"
        badge="Instant 0ms Parser"
        description="Scan your resume text against modern Applicant Tracking System (ATS) algorithms. Real-time scoring for keyword density, measurable impact metrics, and action verbs."
        resultSummaryText={summaryText}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input Box */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-600" />
                  <h3 className="text-base font-bold text-slate-900">Paste Your Resume Content</h3>
                </div>
                {analysis && (
                  <span className="text-xs font-semibold text-slate-500">
                    {analysis.wordCount} words
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="target-role" className="text-xs font-semibold text-slate-600 mb-1.5 block">
                  Target Engineering Role
                </label>
                <select
                  id="target-role"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-cyan-500"
                >
                  <option>Full Stack / Software Engineer</option>
                  <option>Mobile Developer (Flutter / React Native)</option>
                  <option>DevOps & Cloud Engineer</option>
                  <option>QA Automation & SDET</option>
                  <option>Cyber Security Engineer</option>
                </select>
              </div>

              <div>
                <label htmlFor="resume-paste" className="text-xs font-semibold text-slate-600 mb-1.5 block">
                  Resume Text (Copy & Paste text from your PDF or Word document)
                </label>
                <textarea
                  id="resume-paste"
                  rows={14}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your full resume here (e.g. Summary, Experience, Projects, Skills, Education)... The score updates instantly as you type!"
                  className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 font-mono leading-relaxed focus:outline-none focus:border-cyan-500 transition resize-y"
                />
              </div>

              {!resumeText && (
                <button
                  type="button"
                  onClick={() =>
                    setResumeText(
                      `Rahul Sharma | Software Engineer\nEmail: rahul@example.com | GitHub: github.com/rahul\n\nEXPERIENCE:\nSoftware Engineer at Maurya Technologies (2024 - Present)\n- Engineered high-performance Next.js 15 web application reducing page load latency by 45%.\n- Architected scalable REST APIs in Node.js and MongoDB handling 100k+ monthly requests.\n- Automated CI/CD deployment pipelines with Docker and GitHub Actions, cutting release cycles by 30%.\n\nPROJECTS:\nLeadHarvest - Google Maps Lead Extractor\n- Developed full-stack SaaS with Python and React for automated business scraping.\n\nSKILLS:\nReact, Next.js, TypeScript, Node.js, Docker, MongoDB, SQL, Git, AWS, Jest\n\nEDUCATION:\nB.Tech in Computer Science (2020 - 2024)`
                    )
                  }
                  className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 underline cursor-pointer"
                >
                  Load Sample Resume to test
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Score & Real-time Audit */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span>ATS Parsing Score</span>
              </h3>

              {!analysis ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8" />
                  </div>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Paste your resume text on the left to see your instant ATS compatibility score.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Score Gauge */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div>
                      <div className="text-3xl font-extrabold text-slate-900">
                        {analysis.finalScore}
                        <span className="text-sm font-semibold text-slate-400">/100</span>
                      </div>
                      <div className="text-xs font-semibold mt-0.5">
                        {analysis.finalScore >= 80 ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Interview Ready (High ATS Match)
                          </span>
                        ) : analysis.finalScore >= 55 ? (
                          <span className="text-amber-600 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Moderate (Needs Metric & Keyword Tuning)
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> High Risk of ATS Auto-Rejection
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      {analysis.finalScore}%
                    </div>
                  </div>

                  {/* Checklist Breakdown */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-700">Detailed ATS Audit:</div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-600">Tech Keywords Detected</span>
                        <span className="font-bold text-slate-900">
                          {analysis.matchedKeywords.length} keywords
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-600">Power Action Verbs</span>
                        <span className="font-bold text-slate-900">
                          {analysis.matchedVerbs.length} verbs
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-600">Measurable Quantified Metrics</span>
                        <span className="font-bold text-slate-900">
                          {analysis.metricsCount} numbers / %
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-600">Core Sections Present</span>
                        <span className="font-bold text-slate-900">
                          {analysis.sectionsCount} of 4 (Exp, Edu, Skills, Projects)
                        </span>
                      </div>

                      {analysis.foundWeakWords.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                          ⚠️ Remove passive buzzwords: {analysis.foundWeakWords.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upgrade CTA */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                      <Award className="w-4 h-4" />
                      <span>Want Guaranteed 90+ Score?</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Download our pre-tested LaTeX and Word templates with 50+ Google XYZ bullet formulas.
                    </p>
                    <button
                      onClick={() => setModalOpen(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Get ATS Resume Kit (₹199)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CalculatorContainer>

      <CheckoutModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        country={country}
      />
    </>
  );
}
