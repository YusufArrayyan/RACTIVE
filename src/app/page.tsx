"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTheme } from "@/components/ThemeProvider";
import { TrendingUp, FileText, Video, LayoutDashboard, Cpu, LineChart, Sun, Moon, ArrowRight } from "lucide-react";

const FEATURES = [
  { icon: <TrendingUp size={20} strokeWidth={1.5} />, title: "Trend Intelligence", desc: "Real-time velocity tracking across major platforms to identify breakout formats early." },
  { icon: <FileText size={20} strokeWidth={1.5} />, title: "Script Engineering", desc: "Structured templates and automated drafting tuned for retention and conversion." },
  { icon: <Video size={20} strokeWidth={1.5} />, title: "Production Mapping", desc: "Automated shot lists, B-roll suggestions, and precise editing timelines." },
  { icon: <LayoutDashboard size={20} strokeWidth={1.5} />, title: "Unified Pipeline", desc: "A singular board to manage ideation, scripting, filming, and distribution." },
  { icon: <Cpu size={20} strokeWidth={1.5} />, title: "Autonomous Agents", desc: "Delegated background processes for research, captioning, and publishing." },
  { icon: <LineChart size={20} strokeWidth={1.5} />, title: "Performance Telemetry", desc: "Aggregated metrics with actionable retention graph analysis." },
];

export default function LandingPage() {
  const { data: session } = useSession();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-[var(--text-primary)] selection:text-[var(--bg-primary)]">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6 lg:px-12 bg-[var(--bg-primary)] border-b border-[var(--border-default)]">
        <div className="flex items-center gap-2 mr-auto">
          <div className="w-6 h-6 bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center justify-center text-xs font-semibold rounded-sm">R</div>
          <span className="font-semibold text-sm tracking-tight">RACTIVE</span>
        </div>
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
          {["Platform", "Methodology", "Customers", "Changelog"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[var(--text-primary)] transition-colors">{item}</a>
          ))}
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <button onClick={toggleTheme} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            {resolvedTheme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          {session ? (
            <Link href="/dashboard" className="text-sm font-medium hover:text-[var(--text-secondary)] transition-colors">Dashboard →</Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hidden sm:block transition-colors">Log in</Link>
              <Link href="/register" className="btn-primary btn-sm rounded-md">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12 overflow-hidden flex flex-col items-center text-center">
        <div className="absolute inset-0 hero-grid-bg opacity-40 dark:opacity-20 pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 max-w-3xl flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[var(--border-default)] bg-[var(--bg-secondary)] mb-8">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--text-primary)] opacity-20"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--text-primary)]"></span>
            </span>
            <span className="text-xs font-medium text-[var(--text-secondary)]">v2.0 Early Access</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-medium tracking-tight mb-6 text-[var(--text-primary)]">
            The standard for modern <br className="hidden sm:block"/>
            <span className="text-[var(--text-secondary)]">content production.</span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            A precise, high-performance environment for creators. Replace fragmented workflows with a unified system for research, scripting, and analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link href={session ? "/dashboard" : "/register"} className="btn-primary h-10 px-6 w-full sm:w-auto rounded-md">
              Start Building
            </Link>
            <Link href="#documentation" className="btn-secondary h-10 px-6 w-full sm:w-auto rounded-md">
              Read the Docs
            </Link>
          </div>
        </motion.div>

        {/* Dashboard Mockup - Strict & Clean */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="w-full max-w-5xl mt-20 relative z-10 text-left">
          <div className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] shadow-2xl overflow-hidden flex flex-col text-[var(--text-primary)]">
            {/* Header */}
            <div className="h-12 border-b border-[var(--border-default)] flex items-center px-4 gap-4 bg-[var(--bg-secondary)]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)]" />
              </div>
              <div className="flex-1" />
              <div className="text-xs text-[var(--text-tertiary)] font-mono">ractive.workspace / Overview</div>
              <div className="flex-1" />
            </div>
            {/* Body */}
            <div className="flex flex-col md:flex-row h-auto md:h-[400px]">
              {/* Sidebar */}
              <div className="w-48 border-r border-[var(--border-default)] p-4 hidden md:flex flex-col gap-1 bg-[var(--bg-secondary)]">
                {["Overview", "Research", "Scripts", "Pipeline", "Analytics"].map((item, i) => (
                  <div key={item} className={`text-sm px-2 py-1.5 rounded-md cursor-pointer ${i === 0 ? 'bg-[var(--border-default)] text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                    {item}
                  </div>
                ))}
              </div>
              {/* Content */}
              <div className="flex-1 p-6 bg-[var(--bg-primary)] overflow-hidden flex flex-col gap-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-medium text-lg">Performance</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Last 30 days across all platforms</p>
                  </div>
                  <div className="text-sm border border-[var(--border-default)] bg-[var(--bg-secondary)] px-3 py-1.5 rounded-md text-[var(--text-secondary)] hover:border-[var(--border-strong)] cursor-pointer transition-colors">
                    All Channels ▾
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Impressions", value: "4.2M", trend: "+12%" },
                    { label: "Conversion Rate", value: "2.4%", trend: "+0.3%" },
                    { label: "Active Projects", value: "12", trend: "0" },
                  ].map((stat, i) => (
                    <div key={i} className="border border-[var(--border-default)] rounded-lg p-4 bg-[var(--bg-secondary)]">
                      <div className="text-xs text-[var(--text-secondary)] mb-1">{stat.label}</div>
                      <div className="flex items-end gap-2">
                        <div className="text-2xl font-medium">{stat.value}</div>
                        <div className="text-xs mb-1 text-[var(--text-tertiary)]">{stat.trend}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex-1 border border-[var(--border-default)] rounded-lg bg-[var(--bg-secondary)] relative overflow-hidden min-h-[150px]">
                  {/* Mock Chart */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[var(--border-default)] to-transparent opacity-50" />
                  <svg className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,100 L0,50 Q25,60 50,30 T100,10 L100,100 Z" fill="var(--border-default)" opacity="0.3" />
                    <path d="M0,50 Q25,60 50,30 T100,10" fill="none" stroke="var(--text-tertiary)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="methodology" className="py-24 px-6 lg:px-12 bg-[var(--bg-secondary)] border-y border-[var(--border-default)]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 md:flex md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-medium tracking-tight mb-4">A Systematic Approach.</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                RACTIVE isn't just another tool—it's a complete paradigm shift for content creators. We provide the infrastructure needed to scale your output without compromising quality.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {FEATURES.map((feat, i) => (
              <div key={i} className="flex flex-col">
                <div className="w-10 h-10 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-default)] flex items-center justify-center mb-5 text-[var(--text-primary)] shadow-sm">
                  {feat.icon}
                </div>
                <h3 className="text-base font-medium mb-2">{feat.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-medium tracking-tight mb-4">Ready to upgrade your workflow?</h2>
          <p className="text-[var(--text-secondary)] mb-8">Join the next generation of professional creators.</p>
          <Link href="/register" className="btn-primary h-10 px-8 rounded-md inline-flex items-center gap-2">
            Create your workspace <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[var(--border-default)] py-12 px-6 lg:px-12 bg-[var(--bg-primary)]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center justify-center text-[10px] font-bold rounded-sm">R</div>
            <span className="font-semibold text-sm">RACTIVE</span>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-[var(--text-secondary)]">
            {["Documentation", "API", "Twitter", "GitHub", "Legal"].map(link => (
              <a key={link} href="#" className="hover:text-[var(--text-primary)] transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
