import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { deviceRepository } from '../../../devices/data/repositories/MockDeviceRepository';
import { Card } from '../../../../core/components/ui';
import { Smartphone, AlertTriangle, TrendingUp, Package, Users, ExternalLink, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Helper to load lease orders from localStorage
interface LeaseOrder {
    id: string;
    deviceId: string;
    deviceName: string;
    effectivePrice: number;
    createdAt: string;
}

function getLeaseOrders(): LeaseOrder[] {
    try {
        const stored = localStorage.getItem('tortoise_orders');
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

// Aggregate orders by date for chart
function aggregateOrdersByDate(orders: LeaseOrder[]): { name: string; value: number; rentals: number }[] {
    const today = new Date();
    const last7Days: { name: string; value: number; rentals: number }[] = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        const dayOrders = orders.filter(o => o.createdAt.split('T')[0] === dateStr);
        const totalValue = dayOrders.reduce((sum, o) => sum + o.effectivePrice, 0);

        last7Days.push({
            name: dayName,
            value: totalValue,
            rentals: dayOrders.length
        });
    }

    return last7Days;
}

export function DashboardPage() {
    const [stats, setStats] = useState({
        totalDevices: 0,
        lowStock: 0,
        activeListings: 0,
        totalValue: 0
    });
    const [chartData, setChartData] = useState<{ name: string; value: number; rentals: number }[]>([]);
    const [totalLeases, setTotalLeases] = useState(0);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    // Reusable function to refresh all data
    const refreshData = useCallback(async () => {
        // Fetch device stats
        const devices = await deviceRepository.getAll();
        setStats({
            totalDevices: devices.length,
            lowStock: devices.filter(d => d.stock < 10).length,
            activeListings: devices.filter(d => d.isActive).length,
            totalValue: devices.reduce((acc, d) => acc + (d.price * d.stock), 0)
        });

        // Fetch lease orders for chart
        const orders = getLeaseOrders();
        setTotalLeases(orders.length);
        const aggregated = aggregateOrdersByDate(orders);
        setChartData(aggregated);

        setLastUpdated(new Date());
    }, []);

    useEffect(() => {
        // Initial load
        refreshData();

        // Auto-refresh every 5 seconds for real-time updates
        const interval = setInterval(() => {
            refreshData();
        }, 5000);

        return () => clearInterval(interval);
    }, [refreshData]);

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500">Overview of your inventory and performance.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <RefreshCw className="w-4 h-4 animate-spin text-tortoise-500" style={{ animationDuration: '3s' }} />
                    <span>Live • {lastUpdated.toLocaleTimeString()}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Devices"
                    value={stats.totalDevices}
                    icon={Smartphone}
                    trend="+12% from last month"
                    trendUp={true}
                />
                <StatsCard
                    title="Active Listings"
                    value={stats.activeListings}
                    icon={TrendingUp}
                    trend="+5% from last month"
                    trendUp={true}
                />
                <StatsCard
                    title="Low Stock Items"
                    value={stats.lowStock}
                    icon={AlertTriangle}
                    trend="Needs attention"
                    trendUp={false}
                    variant="warning"
                />
                <StatsCard
                    title="Inventory Value"
                    value={`₹${stats.totalValue.toLocaleString()}`}
                    icon={Package}
                    trend="Estimated monthly value"
                    trendUp={true}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="col-span-2 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Rental Trends (Last 7 Days)</h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {totalLeases} total lease{totalLeases !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="h-[300px] w-full">
                        {chartData.every(d => d.value === 0) ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Package className="w-12 h-12 mb-3 opacity-50" />
                                <p className="text-sm">No lease data yet</p>
                                <p className="text-xs mt-1">Leases made in Employee App will appear here</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} tickFormatter={(v) => `₹${v}`} />
                                    <Tooltip
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                                                        <p className="font-semibold text-gray-900">{label}</p>
                                                        <p className="text-sm text-gray-600">{data.rentals} rental{data.rentals !== 1 ? 's' : ''}</p>
                                                        <p className="text-sm font-medium text-tortoise-600">₹{data.value.toLocaleString()}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link to="/devices/new" className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center gap-3 transition-colors">
                            <div className="p-2 bg-white rounded-md border border-gray-200">
                                <Smartphone className="w-5 h-5 text-tortoise-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">Add New Device</p>
                                <p className="text-xs text-gray-500">Create a new listing</p>
                            </div>
                        </Link>
                        <Link to="/devices" className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center gap-3 transition-colors">
                            <div className="p-2 bg-white rounded-md border border-gray-200">
                                <Package className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">Manage Devices</p>
                                <p className="text-xs text-gray-500">Edit stock, offers, pricing</p>
                            </div>
                        </Link>
                        <Link to="/employee-app" target="_blank" className="w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 flex items-center gap-3 transition-colors border border-indigo-100">
                            <div className="p-2 bg-white rounded-md border border-indigo-200">
                                <Users className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">Employee Marketplace</p>
                                <p className="text-xs text-gray-500">Preview customer view</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, trend, trendUp, variant = 'default' }: any) {
    return (
        <Card className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${variant === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-tortoise-50 text-tortoise-600'}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {trend}
                </span>
            </div>
        </Card>
    )
}
