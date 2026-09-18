'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowRight,
  CheckCircle,
  UploadCloud,
  Loader2,
  FileCheck,
  Link2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { TurnstileWidget } from '@/components/common/TurnstileWidget';

export const JobApplicationForm = ({ jobTitle, jobId }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [success, setSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');

  const linkInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    resume: '',
    coverLetter: '',
    website_hp: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'resume') {
      setUploadError(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10MB', {
        description: 'Please select a smaller PDF or provide a Google Drive link.',
      });
      return;
    }

    setUploading(true);
    setUploadError(false);

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();

      if (res.ok && json.success && json.url) {
        setFormData((prev) => ({ ...prev, resume: json.url }));
        setUploadedFileName(file.name);
        toast.success('Resume uploaded successfully!', {
          description: `${file.name} attached to your application.`,
        });
      } else {
        throw new Error(json.error || 'Upload failed');
      }
    } catch (err) {
      console.warn('Resume file upload fallback:', err);
      setUploadError(true);
      toast.warning('Cloud file upload could not be completed', {
        description: 'Please paste a direct Google Drive or Dropbox link in the input box below.',
        duration: 5000,
      });
      // Focus link field
      setTimeout(() => {
        linkInputRef.current?.focus();
      }, 300);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.resume.trim()) {
      toast.error('Resume required', {
        description: 'Please upload your resume file or provide a direct link.',
      });
      linkInputRef.current?.focus();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, jobTitle, jobId, turnstileToken }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast.success('Application submitted successfully!', {
          description: `We have received your application for ${jobTitle}.`,
        });
      } else {
        toast.error('Submission Failed', {
          description: result.message || 'Failed to submit application. Please try again.',
        });
      }
    } catch (error) {
      toast.error('Network Error', {
        description: 'Could not connect to server. Please check your internet connection.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 bg-card rounded-2xl border border-border text-center space-y-4 shadow-sm"
      >
        <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-heading font-bold text-foreground">Application Received!</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Thank you for applying for the <strong>{jobTitle}</strong> position. Our engineering hiring team has received your profile and will review your qualifications shortly.
        </p>
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSuccess(false);
              setFormData({
                name: '',
                email: '',
                phone: '',
                linkedin: '',
                resume: '',
                coverLetter: '',
              });
              setUploadedFileName('');
            }}
            className="text-xs"
          >
            Submit Another Application
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 md:p-8 bg-card rounded-2xl border border-border shadow-sm"
    >
      <div className="mb-6">
        <h3 className="font-heading font-bold text-xl text-foreground">Apply for this Role</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Submit your profile directly to our hiring squad.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Anti-Bot Honeypot Field */}
        <div className="opacity-0 absolute -z-50 pointer-events-none h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="apply-form-hp">Leave this field blank</label>
          <input
            id="apply-form-hp"
            type="text"
            name="website_hp"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website_hp || ''}
            onChange={handleChange}
          />
        </div>
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="apply-name" className="text-xs font-semibold text-foreground">
            Full Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="apply-name" name="name"
            placeholder="e.g. Aman Sharma"
            required
            value={formData.name}
            onChange={handleChange}
            className="text-xs py-2"
          />
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label htmlFor="apply-email" className="text-xs font-semibold text-foreground">
            Email Address <span className="text-destructive">*</span>
          </label>
          <Input
            type="email"
            id="apply-email" name="email"
            placeholder="e.g. aman.sharma@example.com"
            required
            value={formData.email}
            onChange={handleChange}
            className="text-xs py-2"
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <label htmlFor="apply-phone" className="text-xs font-semibold text-foreground">
            Phone Number <span className="text-destructive">*</span>
          </label>
          <Input
            type="tel"
            id="apply-phone" name="phone"
            placeholder="e.g. +91 98765 43210"
            required
            value={formData.phone}
            onChange={handleChange}
            className="text-xs py-2"
          />
        </div>

        {/* LinkedIn Profile */}
        <div className="space-y-1.5">
          <label htmlFor="apply-linkedin" className="text-xs font-semibold text-foreground">
            LinkedIn / GitHub / Portfolio Link
          </label>
          <Input
            type="url"
            id="apply-linkedin" name="linkedin"
            placeholder="https://linkedin.com/in/username or github.com/..."
            value={formData.linkedin}
            onChange={handleChange}
            className="text-xs py-2"
          />
        </div>

        {/* Resume: Dual Option (Upload or Link) */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>
              Resume / CV <span className="text-destructive">*</span>
            </span>
            <span className="text-[11px] text-muted-foreground font-normal">
              PDF, DOCX or Drive Link
            </span>
          </span>

          {/* Option 1: File Upload */}
          <div>
            <label
              className={`cursor-pointer flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed transition text-xs ${
                uploadedFileName
                  ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400'
                  : 'border-border bg-muted/30 hover:bg-muted/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  <span className="font-medium text-accent">Uploading Resume to Cloud...</span>
                </>
              ) : uploadedFileName ? (
                <>
                  <FileCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-medium truncate max-w-[200px]">{uploadedFileName}</span>
                  <span className="text-[10px] text-emerald-500/80 font-mono ml-auto">Uploaded</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 text-accent shrink-0" />
                  <span>
                    <strong>Click to Upload PDF</strong> (Max 10MB)
                  </span>
                </>
              )}
              <input
                type="file"
                aria-label="Upload resume file (PDF, DOC or DOCX, max 10MB)"
                accept=".pdf,.doc,.docx"
                className="hidden"
                disabled={uploading}
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-border/60"></div>
            <span className="flex-shrink mx-2 text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-wider">
              OR Direct Link
            </span>
            <div className="flex-grow border-t border-border/60"></div>
          </div>

          {/* Option 2: Direct URL Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <Link2 className="w-3.5 h-3.5" />
            </div>
            <Input
              ref={linkInputRef}
              type="url"
              id="apply-resume" name="resume"
              aria-label="Resume link (Google Drive, Dropbox or Notion URL)"
              placeholder="Paste Google Drive / Dropbox / Notion link..."
              required
              value={formData.resume}
              onChange={handleChange}
              className={`text-xs pl-9 py-2 ${
                uploadError
                  ? 'border-amber-500 focus-visible:ring-amber-500 bg-amber-500/5'
                  : ''
              }`}
            />
          </div>

          {/* Error / Helper Guidance */}
          {uploadError && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-500 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Please ensure your Google Drive link has view permissions enabled.</span>
            </div>
          )}
        </div>

        {/* Cover Letter / Note */}
        <div className="space-y-1.5">
          <label htmlFor="apply-cover-letter" className="text-xs font-semibold text-foreground">
            Cover Letter / Why Are You a Great Fit?{' '}
            <span className="text-muted-foreground font-normal">(Optional)</span>
          </label>
          <Textarea
            id="apply-cover-letter" name="coverLetter"
            placeholder="Highlight relevant projects, live apps, or why you want to work with Maurya Technologies..."
            rows={3}
            value={formData.coverLetter}
            onChange={handleChange}
            className="text-xs leading-relaxed"
          />
        </div>

        {/* Cloudflare Turnstile Bot Challenge */}
        <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken('')} />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-3 font-bold cursor-pointer transition shadow-md"
          disabled={loading || uploading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Submitting Application...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Submit Application <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>
    </motion.div>
  );
};
