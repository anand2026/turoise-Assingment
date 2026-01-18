import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            {/* Main content - responsive padding */}
            <div className="lg:pl-64 pt-16 lg:pt-0">
                <main className="min-h-screen">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
