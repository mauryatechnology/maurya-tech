'use client';

import React, { useState, useMemo } from 'react';
import { NumericInput } from '@/components/tools/NumericInput';
import { CalculatorContainer } from '@/components/tools/CalculatorContainer';
import {
  GraduationCap,
  Award,
  BookOpen,
  Plus,
  Trash2,
  Percent,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export function CgpaCalculator({
  country = 'in',
  countryName = 'India',
  computeConfig = {},
  tool,
}) {
  const [activeTab, setActiveTab] = useState('cgpa-to-percent'); // 'cgpa-to-percent', 'percent-to-cgpa', 'us-gpa', 'sgpa-calc'

  // Mode 1: CGPA to Percentage
  const [cgpa, setCgpa] = useState(8.5);
  const [multiplier, setMultiplier] = useState(9.5); // CBSE standard 9.5, or 10.0

  // Mode 2: Percentage to CGPA
  const [percentage, setPercentage] = useState(82);

  // Mode 3: US 4.0 GPA
  const [gpa10, setGpa10] = useState(8.2);

  // Mode 4: Semester SGPA courses
  const [courses, setCourses] = useState([
    { id: 1, name: 'Data Structures & Algorithms', credits: 4, gradePoint: 9 },
    { id: 2, name: 'Database Management Systems', credits: 4, gradePoint: 8 },
    { id: 3, name: 'Web Technologies', credits: 3, gradePoint: 10 },
    { id: 4, name: 'Operating Systems', credits: 3, gradePoint: 8 },
  ]);

  // Calculations
  const cgpaToPercentResult = useMemo(() => {
    const score = Math.max(0, Math.min(10, Number(cgpa) || 0));
    const mul = Math.max(1, Number(multiplier) || 9.5);
    const pct = Math.min(100, Math.round(score * mul * 100) / 100);

    let division = 'First Division with Distinction';
    if (pct < 40) division = 'Fail';
    else if (pct < 50) division = 'Third Division';
    else if (pct < 60) division = 'Second Division';
    else if (pct < 75) division = 'First Division';

    return { percentage: pct, division };
  }, [cgpa, multiplier]);

  const percentToCgpaResult = useMemo(() => {
    const pct = Math.max(0, Math.min(100, Number(percentage) || 0));
    const score = Math.min(10, Math.round((pct / 9.5) * 100) / 100);
    return { cgpa: score };
  }, [percentage]);

  const usGpaResult = useMemo(() => {
    const val = Math.max(0, Math.min(10, Number(gpa10) || 0));
    let usScale = 0;
    let letter = 'F';

    if (val >= 9.0) {
      usScale = 4.0;
      letter = 'A';
    } else if (val >= 8.0) {
      usScale = 3.7 + ((val - 8.0) / 1.0) * 0.3;
      letter = 'A-';
    } else if (val >= 7.0) {
      usScale = 3.3 + ((val - 7.0) / 1.0) * 0.4;
      letter = 'B+';
    } else if (val >= 6.0) {
      usScale = 3.0 + ((val - 6.0) / 1.0) * 0.3;
      letter = 'B';
    } else if (val >= 5.0) {
      usScale = 2.5 + ((val - 5.0) / 1.0) * 0.5;
      letter = 'C';
    } else {
      usScale = Math.max(0, val * 0.4);
      letter = 'D/F';
    }

    return {
      usGpa: Math.round(usScale * 100) / 100,
      letter,
    };
  }, [gpa10]);

  const sgpaResult = useMemo(() => {
    const totalCredits = courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
    const weightedPoints = courses.reduce(
      (sum, c) => sum + (Number(c.credits) || 0) * (Number(c.gradePoint) || 0),
      0
    );
    const sgpa = totalCredits > 0 ? Math.round((weightedPoints / totalCredits) * 100) / 100 : 0;
    const approximatePercentage = Math.round(sgpa * 9.5 * 10) / 10;
    return { sgpa, totalCredits, approximatePercentage };
  }, [courses]);

  const addCourse = () => {
    setCourses((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: `Course ${prev.length + 1}`,
        credits: 3,
        gradePoint: 8,
      },
    ]);
  };

  const removeCourse = (id) => {
    if (courses.length <= 1) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCourse = (id, field, value) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const summaryText =
    activeTab === 'cgpa-to-percent'
      ? `CGPA ${cgpa} on ${multiplier} multiplier = ${cgpaToPercentResult.percentage}% (${cgpaToPercentResult.division})`
      : activeTab === 'percent-to-cgpa'
      ? `${percentage}% on 9.5 scale = ${percentToCgpaResult.cgpa} CGPA`
      : activeTab === 'us-gpa'
      ? `${gpa10} CGPA converts to ${usGpaResult.usGpa} / 4.0 US GPA (Grade: ${usGpaResult.letter})`
      : `Semester GPA (SGPA): ${sgpaResult.sgpa} across ${sgpaResult.totalCredits} credits (~${sgpaResult.approximatePercentage}%)`;

  return (
    <CalculatorContainer
      country={country}
      countryName={countryName}
      toolName={tool?.name || 'CGPA to Percentage & US 4.0 GPA Calculator'}
      category="general"
      badge="Academic Grading"
      description="Convert CGPA to percentage using CBSE & university multipliers, calculate US 4.0 scale GPA for MS/MBA applications, or compute semester SGPA with custom course credits."
      resultSummaryText={summaryText}
      faqs={tool?.seo?.faqSchema || []}
    >
      <div className="space-y-6">
        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          {[
            { id: 'cgpa-to-percent', label: 'CGPA to Percentage' },
            { id: 'percent-to-cgpa', label: 'Percentage to CGPA' },
            { id: 'us-gpa', label: 'US 4.0 GPA Scale' },
            { id: 'sgpa-calc', label: 'Semester SGPA Calculator' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-semibold transition cursor-pointer text-center ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mode 1: CGPA to Percentage */}
        {activeTab === 'cgpa-to-percent' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-cyan-600" />
                  <span>Enter Your CGPA Score</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Standard 10-point cumulative grade point average
                </p>
              </div>

              <NumericInput
                id="cgpa-input"
                label="Cumulative Grade Point Average (CGPA)"
                value={cgpa}
                onChange={setCgpa}
                step={0.01}
                min={0}
                max={10}
                placeholder="8.5"
                hint="Scale from 0.0 to 10.0"
                required
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  University / Board Multiplier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '9.5 (CBSE / VTU)', val: 9.5 },
                    { label: '10.0 (Standard)', val: 10.0 },
                    { label: '8.9 (Mumbai Univ)', val: 8.9 },
                  ].map((m) => (
                    <button
                      key={m.val}
                      type="button"
                      onClick={() => setMultiplier(m.val)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer text-center ${
                        multiplier === m.val
                          ? 'bg-cyan-50 border-cyan-400 text-cyan-800'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-6 bg-linear-to-br from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl border border-slate-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Equivalent Percentage</span>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-white">
                  {cgpaToPercentResult.percentage}%
                </div>
                <div className="text-sm font-medium text-emerald-400 mt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{cgpaToPercentResult.division}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-2">
                <div className="font-semibold text-white">Calculation Formula:</div>
                <div className="font-mono text-cyan-300">
                  Percentage = CGPA ({cgpa}) × Multiplier ({multiplier}) = {cgpaToPercentResult.percentage}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mode 2: Percentage to CGPA */}
        {activeTab === 'percent-to-cgpa' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Percent className="w-5 h-5 text-cyan-600" />
                  <span>Enter Aggregate Percentage</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Converts total marks percentage to a 10-point CGPA
                </p>
              </div>

              <NumericInput
                id="pct-input"
                label="Percentage (%)"
                value={percentage}
                onChange={setPercentage}
                suffix="%"
                step={0.1}
                min={0}
                max={100}
                placeholder="82"
                required
              />
            </div>

            <div className="lg:col-span-6 bg-linear-to-br from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl border border-slate-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Equivalent 10-Point CGPA</span>
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold font-mono text-white">
                {percentToCgpaResult.cgpa} <span className="text-xl text-slate-400">/ 10</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
                Formula: CGPA = Percentage ({percentage}%) ÷ 9.5
              </div>
            </div>
          </div>
        )}

        {/* Mode 3: US 4.0 GPA */}
        {activeTab === 'us-gpa' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-600" />
                  <span>Indian 10-Point CGPA</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Converts Indian university CGPA to US 4.0 GPA for WES evaluations and university applications
                </p>
              </div>

              <NumericInput
                id="gpa10-input"
                label="Your Indian CGPA (out of 10)"
                value={gpa10}
                onChange={setGpa10}
                step={0.1}
                min={0}
                max={10}
                placeholder="8.2"
                required
              />
            </div>

            <div className="lg:col-span-6 bg-linear-to-br from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl border border-slate-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Estimated US 4.0 GPA</span>
              </div>
              <div className="flex items-baseline gap-4">
                <div className="text-4xl sm:text-5xl font-extrabold font-mono text-white">
                  {usGpaResult.usGpa} <span className="text-xl text-slate-400">/ 4.0</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Letter Grade: {usGpaResult.letter}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
                Calibrated against WES (World Education Services) standard grade conversion methodology.
              </div>
            </div>
          </div>
        )}

        {/* Mode 4: Semester SGPA Calculator */}
        {activeTab === 'sgpa-calc' && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-600" />
                  <span>Semester Courses & Credit Points</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Add your courses, credit weightage, and grade points to compute semester SGPA
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-500">Calculated SGPA:</div>
                  <div className="text-xl font-bold font-mono text-cyan-600">
                    {sgpaResult.sgpa} <span className="text-xs text-slate-400">/ 10</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addCourse}
                  className="px-3 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Course</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {courses.map((course, idx) => (
                <div
                  key={course.id}
                  className="grid grid-cols-12 gap-3 items-center p-3 rounded-2xl bg-slate-50 border border-slate-200/80"
                >
                  <div className="col-span-5 sm:col-span-6">
                    <input
                      type="text"
                      value={course.name}
                      onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                      placeholder="Course name"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-3">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-500 shrink-0">Credits:</span>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={course.credits}
                        onChange={(e) => updateCourse(course.id, 'credits', Number(e.target.value))}
                        className="w-full px-2.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 font-bold focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-2">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-500 shrink-0">Grade:</span>
                      <input
                        type="number"
                        min={0}
                        max={10}
                        step={1}
                        value={course.gradePoint}
                        onChange={(e) =>
                          updateCourse(course.id, 'gradePoint', Number(e.target.value))
                        }
                        className="w-full px-2.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 font-bold focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => removeCourse(course.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      title="Remove Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorContainer>
  );
}
