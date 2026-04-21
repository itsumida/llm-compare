'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  icon: string;
  href: string;
}

const workspaceItems: NavItem[] = [
  { label: 'Playground', icon: 'code', href: '/models' },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-4">
      <span className="font-primary text-[14px] text-sidebar-foreground leading-[1.14]">
        {children}
      </span>
    </div>
  );
}

function NavItemLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-4 px-4 py-3 rounded-full mx-4 transition-colors ${
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
      }`}
    >
      <span
        className="material-icon text-[24px]"
        style={{ fontWeight: 100, fontSize: 24, width: 24, height: 24 }}
      >
        {item.icon}
      </span>
      <span className="font-secondary text-[16px] leading-[1.5] flex-1 truncate">
        {item.label}
      </span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-[280px] min-w-[280px] h-full bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center justify-center h-[88px] px-8 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-primary text-[18px] font-bold text-primary leading-none tracking-tight">
            LLM ARENA
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-0 py-0">
        <SectionTitle>Workspace</SectionTitle>
        <div className="flex flex-col gap-1">
          {workspaceItems.map((item) => (
            <NavItemLink
              key={item.href}
              item={item}
              isActive={pathname === item.href || (item.href === '/compare' && pathname.startsWith('/compare'))}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
}
