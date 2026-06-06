'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusCircle, Heart, User } from 'lucide-react';
import { useFavoritesStore } from '@/lib/store/favorites';
import { cn } from '@/lib/cn';

export function MobileBottomNav() {
  const pathname = usePathname();
  const favCount = useFavoritesStore((s) => s.ids.length);

  // Hide on desktop and on specific routes like VDP where we want the sticky contact bar instead
  const isVDP = pathname.match(/^\/fahrzeuge\/[^\/]+$/);

  if (isVDP) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-neutral-200/60 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-[68px] px-2">
        <NavItem href="/" icon={<Home size={22} />} label="Home" isActive={pathname === '/'} />
        <NavItem href="/fahrzeuge" icon={<Search size={22} />} label="Suche" isActive={pathname.startsWith('/fahrzeuge')} />
        <NavItem href="/inzahlungnahme" icon={<PlusCircle size={22} />} label="Verkaufen" isActive={pathname === '/inzahlungnahme'} />
        <NavItem 
          href="/merkliste" 
          icon={<Heart size={22} />} 
          label="Merkliste" 
          isActive={pathname === '/merkliste'} 
          badge={favCount} 
        />
        <NavItem href="/konto" icon={<User size={22} />} label="Konto" isActive={pathname === '/konto'} />
      </div>
    </nav>
  );
}

function NavItem({ href, icon, label, isActive, badge }: any) {
  return (
    <Link 
      href={href} 
      className={cn(
        "relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors", 
        isActive ? "text-red-600" : "text-neutral-500 hover:text-neutral-900"
      )}
    >
      <div className="relative">
        {icon}
        {badge > 0 && (
          <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm ring-1 ring-white">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </Link>
  );
}
