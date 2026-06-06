'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { ARTICLES } from '@/lib/mock/articles';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

const TABS = ['Alle', 'Fahrzeuge', 'Technik', 'Markt', 'Lifestyle'];

export default function MagazinPage() {
  const [activeTab, setActiveTab] = useState('Alle');

  const filteredArticles = activeTab === 'Alle'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === activeTab);

  const displayArticles = filteredArticles.length > 0 ? filteredArticles : ARTICLES;

  const featured = displayArticles[0];
  const rest = displayArticles.slice(1);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col gap-12 md:gap-20">
      <header className="flex flex-col gap-4 text-center items-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
          // Magazin · Editorial
        </span>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 max-w-3xl">
          Lesen, nicht überfliegen.
        </h1>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-semibold transition-all border",
              activeTab === tab 
                ? "bg-neutral-900 text-white border-neutral-900 shadow-sm" 
                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Featured Article */}
      {featured && (
        <article className="group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <Link href={`/magazin/${featured.slug}`} className="block overflow-hidden rounded-[2rem] aspect-[4/3] lg:aspect-square relative w-full">
            <div className="veh-img alt-0 absolute inset-0 transition-transform duration-700 group-hover:scale-105">
              <div className="veh-img-shape" />
              <div className="veh-img-grid" />
            </div>
          </Link>
          <div className="flex flex-col items-start gap-6">
            <div className="flex items-center gap-4 text-sm font-semibold">
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-red-700 border-red-200 uppercase tracking-wider">{featured.category}</span>
              <span className="text-neutral-500">{featured.date}</span>
            </div>
            <Link href={`/magazin/${featured.slug}`} className="block group-hover:text-red-600 transition-colors">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-neutral-900 m-0">
                {featured.title}
              </h2>
            </Link>
            <p className="text-lg text-neutral-500 max-w-xl leading-relaxed m-0">
              {featured.excerpt}
            </p>
            <div className="flex items-center gap-3 text-sm font-semibold text-neutral-900 mt-4 border-t border-neutral-200 pt-6 w-full">
              <span className="text-neutral-900">{featured.author}</span>
              <span className="text-neutral-300">·</span>
              <span className="text-neutral-500">{featured.readTime}</span>
              <Link href={`/magazin/${featured.slug}`} className="ml-auto inline-flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors">
                Weiterlesen <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </article>
      )}

      {/* Article Grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 border-t border-neutral-200 pt-16">
          {rest.map((article, i) => (
            <article key={article.id} className="group flex flex-col gap-6">
              <Link href={`/magazin/${article.slug}`} className="block overflow-hidden rounded-2xl aspect-[4/3] relative w-full">
                <div className={cn("veh-img absolute inset-0 transition-transform duration-700 group-hover:scale-105", `alt-${(i + 1) % 7}`)}>
                  <div className="veh-img-shape" />
                  <div className="veh-img-grid" />
                </div>
              </Link>
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-red-600 uppercase tracking-wider">{article.category}</span>
                  <span className="text-neutral-400">{article.date}</span>
                </div>
                <Link href={`/magazin/${article.slug}`} className="block group-hover:text-red-600 transition-colors">
                  <h3 className="font-display text-xl font-bold leading-tight text-neutral-900 m-0">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-sm text-neutral-500 line-clamp-3 m-0 flex-1">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm font-semibold mt-auto pt-4 border-t border-neutral-100">
                  <span className="text-neutral-400">{article.readTime}</span>
                  <Link href={`/magazin/${article.slug}`} className="inline-flex items-center gap-1.5 text-neutral-900 hover:text-red-600 transition-colors">
                    Weiterlesen <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Newsletter */}
      <section className="bg-neutral-900 rounded-[2rem] p-8 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-24 overflow-hidden relative">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="flex-1 flex flex-col gap-6 relative z-10 text-center lg:text-left">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white m-0">Jede Woche neue Perspektiven.</h2>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto lg:mx-0 m-0">
            Abonnieren Sie unseren Newsletter für Editorials, Marktanalysen und exklusive Fahrzeug-Pre-Releases.
          </p>
        </div>
        <form className="w-full lg:w-auto min-w-[320px] flex flex-col sm:flex-row gap-3 relative z-10" onSubmit={(e) => e.preventDefault()}>
          <div className="relative flex-1">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="email"
              placeholder="E-Mail Adresse"
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all text-[15px] font-medium"
              required
            />
          </div>
          <button type="submit" className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-[15px] font-bold text-neutral-900 transition-all hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shadow-sm">
            Abonnieren
          </button>
        </form>
      </section>
    </main>
  );
}
