import { useEffect, useState } from 'react';
import { deviceRepository } from '../../../devices/data/repositories/MockDeviceRepository';
import type { Device } from '../../../devices/domain/entities/Device';
import { Card, Badge, Button } from '../../../../core/components/ui';
import { Percent, ShoppingCart, Search, X, Check, ArrowLeft, Loader2 } from 'lucide-react';

interface LeaseOrder {
    id: string;
    deviceId: string;
    deviceName: string;
    deviceBrand: string;
    monthlyRental: number;
    effectivePrice: number;  // Changed from effectiveCost to match Dashboard
    createdAt: string;  // Changed from leasedAt to match Dashboard
    status: 'pending' | 'approved' | 'active';
}

export function EmployeeAppView() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [brandFilter, setBrandFilter] = useState<string>('');
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [leaseConfirmed, setLeaseConfirmed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        loadDevices();
        // Auto-refresh every 5 seconds to simulate real-time sync
        const interval = setInterval(() => {
            loadDevices();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const loadDevices = async () => {
        const data = await deviceRepository.getAll();
        // Only show active devices with stock
        setDevices(data.filter(d => d.isActive && d.stock > 0));
        setLastUpdated(new Date());
        setLoading(false);
    };

    const getEffectivePrice = (device: Device): number => {
        const activeOffers = device.offers.filter(o => o.isActive && new Date(o.validTo) >= new Date());
        if (activeOffers.length === 0) return device.price;

        // Apply best offer
        let bestPrice = device.price;
        for (const offer of activeOffers) {
            if (offer.type === 'percentage') {
                const discounted = device.price * (1 - offer.value / 100);
                if (discounted < bestPrice) bestPrice = discounted;
            } else {
                const discounted = device.price - offer.value;
                if (discounted < bestPrice) bestPrice = Math.max(0, discounted);
            }
        }
        return Math.round(bestPrice);
    };

    const brands = [...new Set(devices.map(d => d.brand))];

    const filteredDevices = devices.filter(device => {
        const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            device.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            device.model.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = brandFilter ? device.brand === brandFilter : true;
        return matchesSearch && matchesBrand;
    });

    const handleLease = (device: Device) => {
        setSelectedDevice(device);
        setLeaseConfirmed(false);
        setIsProcessing(false);
    };

    const confirmLease = async () => {
        if (!selectedDevice) return;

        setIsProcessing(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Reduce stock by 1
        const newStock = Math.max(0, selectedDevice.stock - 1);
        await deviceRepository.updateStock(selectedDevice.id, newStock);

        // Create lease order and save to localStorage
        const order: LeaseOrder = {
            id: `lease-${Date.now()}`,
            deviceId: selectedDevice.id,
            deviceName: selectedDevice.name,
            deviceBrand: selectedDevice.brand,
            monthlyRental: getEffectivePrice(selectedDevice),
            effectivePrice: Math.round(getEffectivePrice(selectedDevice) * 0.7),  // Changed field name
            createdAt: new Date().toISOString(),  // Changed field name
            status: 'pending'
        };

        // Save order to localStorage (using 'tortoise_orders' to match Dashboard)
        const existingOrders = JSON.parse(localStorage.getItem('tortoise_orders') || '[]');
        existingOrders.push(order);
        localStorage.setItem('tortoise_orders', JSON.stringify(existingOrders));

        setIsProcessing(false);
        setLeaseConfirmed(true);

        // Refresh devices to show updated stock
        loadDevices();
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="animate-spin w-8 h-8 border-b-2 border-indigo-600 rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Lease Modal */}
            {selectedDevice && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
                        {leaseConfirmed ? (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="w-8 h-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Lease Request Submitted!</h2>
                                <p className="text-gray-600 mb-6">Your request for {selectedDevice.brand} {selectedDevice.name} has been submitted. HR will process it shortly.</p>
                                <Button onClick={() => setSelectedDevice(null)}>Close</Button>
                            </div>
                        ) : (
                            <>
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-gray-900">Confirm Lease</h2>
                                        <button onClick={() => setSelectedDevice(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex gap-4 mb-6">
                                        <img src={selectedDevice.image} alt={selectedDevice.name} className="w-24 h-24 object-cover rounded-lg bg-gray-100" />
                                        <div>
                                            <p className="text-sm text-indigo-600 font-semibold">{selectedDevice.brand}</p>
                                            <h3 className="text-lg font-bold text-gray-900">{selectedDevice.name}</h3>
                                            <p className="text-sm text-gray-500">{selectedDevice.specifications.storage} • {selectedDevice.specifications.ram}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Monthly Rental</span>
                                            <span className="font-semibold">₹{getEffectivePrice(selectedDevice)}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Pre-tax Savings (approx)</span>
                                            <span className="font-semibold text-green-600">~₹{Math.round(getEffectivePrice(selectedDevice) * 0.3)}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-gray-200">
                                            <span className="text-gray-900 font-medium">Effective Cost</span>
                                            <span className="font-bold text-lg">₹{Math.round(getEffectivePrice(selectedDevice) * 0.7)}/mo</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-500 mb-6">By proceeding, you agree to the lease terms. The amount will be deducted from your salary pre-tax.</p>

                                    <div className="flex gap-3">
                                        <Button variant="outline" className="flex-1" onClick={() => setSelectedDevice(null)} disabled={isProcessing}>Cancel</Button>
                                        <Button className="flex-1" onClick={confirmLease} disabled={isProcessing}>
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                                    Confirm Lease
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto p-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">🐢 Tortoise Marketplace</h1>
                        <p className="text-gray-600">Browse and lease devices — Employee view</p>
                    </div>
                    <div className="text-right">
                        <a href="/" className="text-sm text-indigo-600 hover:underline flex items-center gap-1 mb-1">
                            <ArrowLeft className="w-3 h-3" />
                            Back to Supplier Portal
                        </a>
                        <p className="text-xs text-gray-500">Auto-syncs every 5s • {lastUpdated.toLocaleTimeString()}</p>
                    </div>
                </div>


                {/* Search & Filters */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <div className="relative flex-1 min-w-[250px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search devices..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                    </div>
                    <select
                        value={brandFilter}
                        onChange={(e) => setBrandFilter(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Brands</option>
                        {brands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                </div>

                {/* Device Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDevices.map(device => {
                        const effectivePrice = getEffectivePrice(device);
                        const hasDiscount = effectivePrice < device.price;
                        const activeOffers = device.offers.filter(o => o.isActive && new Date(o.validTo) >= new Date());

                        return (
                            <Card key={device.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="aspect-[4/3] bg-gray-100 relative">
                                    <img src={device.image} alt={device.name} className="w-full h-full object-cover" />
                                    {activeOffers.length > 0 && (
                                        <div className="absolute top-3 left-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
                                            <Percent className="w-3 h-3" />
                                            {activeOffers[0].type === 'percentage' ? `${activeOffers[0].value}% OFF` : `₹${activeOffers[0].value} OFF`}
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{device.brand}</p>
                                    <h3 className="text-lg font-bold text-gray-900 mt-1">{device.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{device.specifications.storage} • {device.specifications.ram}</p>

                                    <div className="mt-4 flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-gray-900">₹{effectivePrice}</span>
                                        <span className="text-sm text-gray-500">/month</span>
                                        {hasDiscount && (
                                            <span className="text-sm text-gray-400 line-through">₹{device.price}</span>
                                        )}
                                    </div>

                                    {activeOffers.length > 0 && (
                                        <p className="text-xs text-rose-600 mt-2">{activeOffers[0].description}</p>
                                    )}

                                    <div className="mt-4 flex items-center justify-between">
                                        <Badge variant={device.stock > 5 ? 'success' : 'warning'}>
                                            {device.stock} available
                                        </Badge>
                                        <button
                                            onClick={() => handleLease(device)}
                                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Lease Now
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {filteredDevices.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">No devices found. {searchTerm && 'Try a different search term.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
