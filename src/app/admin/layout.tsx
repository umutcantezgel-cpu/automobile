'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Car,
  MessageSquare,
  ExternalLink,
  LogOut,
  Search,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/cn';

interface NavItemConfig {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  hasDot?: boolean;
  external?: boolean;
}

const NAV_SECTIONS: { title: string; items: NavItemConfig[] }[] = [
  {
    title: 'Verwaltung',
    items: [
      {
        label: 'Übersicht',
        href: '/admin',
        icon: <LayoutDashboard size={18} />,
      },
      {
        label: 'Fahrzeuge',
        href: '/admin/fahrzeuge',
        icon: <Car size={18} />,
        badge: '124',
      },
      {
        label: 'Anfragen',
        href: '/admin/anfragen',
        icon: <MessageSquare size={18} />,
        badge: '12',
        hasDot: true,
      },
    ],
  },
  {
    title: 'Weiteres',
    items: [
      {
        label: 'Live-Site ansehen',
        href: '/',
        icon: <ExternalLink size={18} />,
        external: true,
      },
      {
        label: 'Abmelden',
        href: '#',
        icon: <LogOut size={18} />,
      },
    ],
  },
];

function getBreadcrumbAndTitle(pathname: string): {
  breadcrumb: string;
  title: string;
} {
  if (pathname === '/admin') {
    return { breadcrumb: 'Dashboard', title: 'Übersicht' };
  }
  if (pathname.startsWith('/admin/fahrzeuge/')) {
    return { breadcrumb: 'Fahrzeuge / Bearbeiten', title: 'Fahrzeug bearbeiten' };
  }
  if (pathname === '/admin/fahrzeuge') {
    return { breadcrumb: 'Dashboard / Fahrzeuge', title: 'Fahrzeuge' };
  }
  if (pathname === '/admin/anfragen') {
    return { breadcrumb: 'Dashboard / Anfragen', title: 'Anfragen' };
  }
  return { breadcrumb: 'Dashboard', title: 'Admin' };
}

function isNavActive(href: string, pathname: string): boolean {
  if (href === '/admin') {
    return pathname === '/admin';
  }
  return pathname.startsWith(href);
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { breadcrumb, title } = getBreadcrumbAndTitle(pathname);

  return (
    <div className="adm-shell">
      {/* ── Sidebar ── */}
      <aside className="adm-sidebar">
        {/* Brand */}
        <div className="adm-sidebar-brand">
          <Link href="/admin" className="flex items-center gap-1 no-underline">
            <span className="font-display text-base font-bold tracking-tight text-black">APEX</span>
            <span className="font-display text-base font-bold tracking-tight text-black">/</span>
            <span className="font-display text-base font-bold tracking-tight text-black">MOTORS</span>
          </Link>
          <span className="adm-env">Admin</span>
        </div>

        {/* Navigation */}
        <nav className="adm-nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <div className="adm-nav-section">{section.title}</div>
              {section.items.map((item) => {
                const active = isNavActive(item.href, pathname);
                const Component = item.external ? 'a' : Link;
                const extraProps = item.external
                  ? { target: '_blank' as const, rel: 'noopener noreferrer' }
                  : {};

                return (
                  <Component
                    key={item.href + item.label}
                    href={item.href}
                    className={cn('adm-nav-item', active && 'active')}
                    {...extraProps}
                  >
                    {item.icon}
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="adm-nav-badge">
                        {item.hasDot && (
                          <span className={cn("adm-pulse-dot", "text-green-500")} />
                        )}
                        {item.badge}
                      </span>
                    )}
                  </Component>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="adm-sidebar-foot">
          <div className="flex items-center justify-center shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-black to-neutral-700 text-white text-xs font-bold font-display tracking-widest">CA</div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis text-black">Carla Apex</span>
            <span className="text-xs whitespace-nowrap overflow-hidden text-ellipsis text-neutral-500">Geschäftsführerin</span>
          </div>
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="adm-topbar">
          <div>
            <div className="adm-breadcrumb">{breadcrumb}</div>
            <h1 className="adm-page-title">{title}</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="adm-search">
              <Search size={16} className="text-neutral-500 shrink-0" />
              <input type="text" placeholder="Suchen…" />
              <kbd className="kbd">⌘K</kbd>
            </div>

            {/* Bell */}
            <button
              className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-50 border border-neutral-200 cursor-pointer text-neutral-500"
              aria-label="Benachrichtigungen"
            >
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-black border-[2px] border-white" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="adm-content">{children}</main>
      </div>
    </div>
  );
}
