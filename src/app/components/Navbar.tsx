'use client';

import { Home, BarChart2, Mail, Settings } from 'lucide-react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from "./ThemeSwitcher";
import Logo from './Logo';

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

const NavBar = () => {
    const pathname = usePathname();

    const navItems: NavItem[] = [
        { href: '/transactions', label: 'Transactions', icon: Home },
        { href: '/transactions/stats', label: 'Stats', icon: BarChart2 },
        // { href: '/accounts', label: 'Accounts', icon: CreditCard },
        { href: '/contact', label: 'Contact', icon: Mail },
        { href: '/dashboard', label: 'Settings', icon: Settings },
    ];

    return (
        <>
            <nav className="hidden md:flex md:ml-3 m-0 lg:m-0 justify-between items-center fixed top-2 left-1/2 transform -translate-x-1/2 gap-x-2 dark:bg-black bg-white z-40 rounded-md shadow-md border dark:border-zinc-600 p-1 shadow-zinc-500/50 w-max h-max group">
                <Logo className='group flex justify-between font-semibold lg:font-bold items-center gap-x-2 h-full dark:bg-zinc-800 rounded-md px-2 py-1.5 lg:text-lg text-sm lg:mr-3' logoClassName={"lg:w-7 lg:h-7 w-6 h-6"} />
                {navItems.map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex justify-between items-center dark:hover:bg-zinc-800 hover:bg-zinc-300 h-full px-2 py-1.5 rounded-md text-xs lg:text-base border ${pathname.startsWith(href) ? 'ring-2 dark:ring-white ring-zinc-500' : 'inactive'}`}
                        prefetch={false}
                    >
                        {label}
                    </Link>
                ))}
                <div className=''>
                    <ThemeSwitcher />
                </div>
            </nav>
            <MobileBottomNav navItems={navItems} />
        </>
    );
};

interface MobileBottomNavProps {
    navItems: NavItem[];
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ navItems }) => {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 w-full z-50 border-t border-gray-200 gap-x-2 dark:bg-black bg-white rounded-md shadow-md border dark:border-zinc-600 p-1 shadow-zinc-500/50">
            <Logo className='fixed top-0 flex justify-center font-semibold lg:font-bold items-center gap-x-2 dark:bg-zinc-800 rounded-md px-2 mt-1 text-nowrap text-lg lg:mr-3 h-max transform -translate-x-1/2 left-1/2' logoClassName={"w-8 h-8"} />
            <div className="flex justify-around py-2">
                {navItems.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex flex-col items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${pathname.startsWith(href) ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'inactive'}`}
                    >
                        <Icon className={`w-6 h-6 ${pathname.startsWith(href) ? 'fill-current' : ''}`} />
                        <span className="text-xs">{label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default NavBar;