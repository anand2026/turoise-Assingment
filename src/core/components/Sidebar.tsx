import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Smartphone, Box, Package, Users } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Devices', path: '/devices', icon: Smartphone },
    { name: 'Stock', path: '/stock', icon: Package },
    { name: 'Employee App', path: '/employee-app', icon: Users, external: true },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 z-10">
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    {/* Tortoise Logo Placeholder */}
                    <div className="bg-tortoise-600 p-1.5 rounded-lg">
                        <Box className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">Tortoise</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-tortoise-50 text-tortoise-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <Icon className={clsx("w-5 h-5", isActive ? "text-tortoise-600" : "text-gray-400 group-hover:text-gray-500")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                        S
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-gray-900 truncate">Supplier Admin</p>
                        <p className="text-xs text-gray-500 truncate">supplier@tortoise.pro</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
