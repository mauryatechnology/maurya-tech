"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import Image from 'next/image';



export const FeatureCard = ({
  icon,
  title,
  description,
  className,
  index = 0,
}) => {
  const IconComponent = (LucideIcons)[icon] || LucideIcons.Star;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        'group p-6 md:p-8 rounded-2xl bg-card border border-border card-hover',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
        <IconComponent className="w-6 h-6 text-accent" />
      </div>
      <h3 className="font-heading font-semibold text-xl mb-3 text-card-foreground">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
};



export const ServiceCard = ({
  icon,
  title,
  description,
  features,
  technologies,
  className,
  index = 0,
  onClick,
}) => {
  const IconComponent = (LucideIcons)[icon] || LucideIcons.Star;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className={cn(
        'group p-6 md:p-8 rounded-2xl bg-card border border-border card-hover cursor-pointer',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <IconComponent className="w-7 h-7 text-accent" />
      </div>
      <h3 className="font-heading font-semibold text-xl mb-3 text-card-foreground group-hover:text-accent transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed mb-4">{description}</p>
      
      {technologies && technologies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {technologies.slice(0, 4).map((tech, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-md"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};



export const TestimonialCard = ({
  quote,
  author,
  role,
  company,
  image,
  className,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        'p-6 md:p-8 rounded-2xl bg-card border border-border',
        className
      )}
    >
      <div className="mb-6">
        <LucideIcons.Quote className="w-8 h-8 text-accent/40" />
      </div>
      <blockquote className="text-lg text-card-foreground leading-relaxed mb-6">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-4">
        {image ? (
          <Image
            src={image}
            alt={author}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-accent font-semibold">{author.charAt(0)}</span>
          </div>
        )}
        <div>
          <div className="font-semibold text-card-foreground">{author}</div>
          <div className="text-sm text-muted-foreground">
            {role}{company && `, ${company}`}
          </div>
        </div>
      </div>
    </motion.div>
  );
};



export const ProcessStep = ({
  number,
  title,
  description,
  isLast = false,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative flex gap-6"
    >
      {/* Number & Line */}
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center font-heading font-bold text-xl">
          {number}
        </div>
        {!isLast && (
          <div className="flex-1 w-px bg-border mt-4" />
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 pb-12">
        <h3 className="font-heading font-semibold text-xl mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};




