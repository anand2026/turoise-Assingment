import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deviceRepository } from '../../../devices/data/repositories/MockDeviceRepository';
import type { Device } from '../../../devices/domain/entities/Device';
import { Button, Card, Badge } from '../../../../core/components/ui';
import { Package, Search, AlertTriangle, TrendingUp, ArrowUpDown, Edit2 } from 'lucide-react';

export function StockOverviewPage() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'stock' | 'stockAsc'>('name');
    const [filterStock, setFilterStock] = useState<'all' | 'low' | 'out'>('all');

    useEffect(() => {
        loadDevices();
    }, []);

    const loadDevices = async () => {
        setLoading(true);
        const data = await deviceRepository.getAll();
        setDevices(data);
        setLoading(false);
    };

    // Calculate stats
    const totalDevices = devices.length;
    const totalStock = devices.reduce((sum, d) => sum + d.stock, 0);
    const lowStockDevices = devices.filter(d => d.stock > 0 && d.stock < 10).length;
    const outOfStockDevices = devices.filter(d => d.stock === 0).length;

    // Filter and sort
    const filteredDevices = devices
        .filter(d => {
            const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.brand.toLowerCase().includes(searchQuery.toLowerCase());

            if (filterStock === 'low') return matchesSearch && d.stock > 0 && d.stock < 10;
            if (filterStock === 'out') return matchesSearch && d.stock === 0;
            return matchesSearch;
        })
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'stock') return b.stock - a.stock;
            if (sortBy === 'stockAsc') return a.stock - b.stock;
            return 0;
        });

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-tortoise-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
                    <p className="text-gray-500">Monitor and manage inventory levels across all devices</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-tortoise-100 flex items-center justify-center">
                            <Package className="w-5 h-5 text-tortoise-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Devices</p>
                            <p className="text-xl font-bold text-gray-900">{totalDevices}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Stock</p>
                            <p className="text-xl font-bold text-gray-900">{totalStock} units</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStock(filterStock === 'low' ? 'all' : 'low')}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Low Stock</p>
                            <p className="text-xl font-bold text-amber-600">{lowStockDevices}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStock(filterStock === 'out' ? 'all' : 'out')}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <Package className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Out of Stock</p>
                            <p className="text-xl font-bold text-red-600">{outOfStockDevices}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search and Sort Controls */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by device name or brand..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tortoise-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant={filterStock === 'all' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilterStock('all')}
                        >
                            All ({totalDevices})
                        </Button>
                        <Button
                            variant={filterStock === 'low' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilterStock('low')}
                        >
                            Low Stock ({lowStockDevices})
                        </Button>
                        <Button
                            variant={filterStock === 'out' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setFilterStock('out')}
                        >
                            Out of Stock ({outOfStockDevices})
                        </Button>

                        <div className="border-l border-gray-200 mx-2"></div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSortBy(sortBy === 'stockAsc' ? 'stock' : 'stockAsc')}
                            className="flex items-center gap-1"
                        >
                            <ArrowUpDown className="w-4 h-4" />
                            Sort by Stock
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Stock Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Device</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock Level</th>
                                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredDevices.map((device) => (
                                <tr key={device.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={device.image}
                                                alt={device.name}
                                                className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900">{device.name}</p>
                                                <p className="text-xs text-gray-500">{device.model}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-600">{device.brand}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="font-medium text-gray-900">₹{device.price.toLocaleString()}</span>
                                        <span className="text-xs text-gray-500">/mo</span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${device.stock === 0 ? 'bg-red-500' :
                                                        device.stock < 5 ? 'bg-amber-500' :
                                                            device.stock < 10 ? 'bg-yellow-500' : 'bg-green-500'
                                                        }`}
                                                    style={{ width: `${Math.min(100, (device.stock / 30) * 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className="font-semibold text-gray-900 min-w-[3rem]">{device.stock}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        {device.stock === 0 ? (
                                            <Badge variant="error">Out of Stock</Badge>
                                        ) : device.stock < 10 ? (
                                            <Badge variant="warning">Low Stock</Badge>
                                        ) : (
                                            <Badge variant="success">In Stock</Badge>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <Link to={`/devices/${device.id}/stock`}>
                                            <Button variant="outline" size="sm">
                                                <Edit2 className="w-4 h-4 mr-1" />
                                                Update
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredDevices.length === 0 && (
                        <div className="py-12 text-center text-gray-500">
                            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="font-medium">No devices found</p>
                            <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
