import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <div className="pl-64">
                {/* Header can go here if needed, or just padding */}
                <main className="min-h-screen">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
