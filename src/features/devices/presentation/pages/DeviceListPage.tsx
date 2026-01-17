import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Device } from '../../domain/entities/Device';
import { deviceRepository } from '../../data/repositories/MockDeviceRepository';
import { Button, Card, Badge } from '../../../../core/components/ui';
import { Plus, Search, Filter, Edit2, Package, Percent, Trash2, Eye, EyeOff, X, AlertTriangle } from 'lucide-react';

export function DeviceListPage() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showInactive, setShowInactive] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ id: string; name: string } | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadDevices();
    }, []);

    const loadDevices = async () => {
        setLoading(true);
        const data = await deviceRepository.getAll();
        setDevices(data);
        setLoading(false);
    };

    const handleDeleteClick = (id: string, name: string) => {
        setDeleteModal({ id, name });
    };

    const confirmDelete = async () => {
        if (!deleteModal) return;
        setDeleting(true);
        try {
            await deviceRepository.delete(deleteModal.id);
            await loadDevices();
            setDeleteModal(null);
        } catch (e) {
            console.error(e);
            alert('Failed to delete device');
        } finally {
            setDeleting(false);
        }
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            await deviceRepository.update(id, { isActive: !currentStatus });
            await loadDevices();
        } catch (e) {
            console.error(e);
        }
    };

    const filteredDevices = devices.filter(device => {
        const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            device.brand.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesActive = showInactive ? true : device.isActive;
        return matchesSearch && matchesActive;
    });

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Device Listings</h1>
                    <p className="text-gray-500">Manage your device catalog and inventory.</p>
                </div>
                <Link to="/devices/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Device
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search devices by name or brand..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tortoise-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button
                    variant={showInactive ? 'primary' : 'outline'}
                    className="gap-2"
                    onClick={() => setShowInactive(!showInactive)}
                >
                    <Filter className="w-4 h-4" />
                    {showInactive ? 'Showing All' : 'Active Only'}
                </Button>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tortoise-600"></div>
                </div>
            ) : filteredDevices.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    <p>No devices found. {searchTerm && 'Try a different search term.'}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredDevices.map(device => (
                        <DeviceCard
                            key={device.id}
                            device={device}
                            onDelete={handleDeleteClick}
                            onToggleActive={handleToggleActive}
                        />
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteModal(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Delete Device</h3>
                                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                                </div>
                                <button onClick={() => setDeleteModal(null)} className="ml-auto p-2 hover:bg-gray-100 rounded-lg">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete <strong>"{deleteModal.name}"</strong>? All associated data including offers and stock history will be permanently removed.
                            </p>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setDeleteModal(null)}>
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                    onClick={confirmDelete}
                                    disabled={deleting}
                                >
                                    {deleting ? 'Deleting...' : 'Delete Device'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

interface DeviceCardProps {
    device: Device;
    onDelete: (id: string, name: string) => void;
    onToggleActive: (id: string, currentStatus: boolean) => void;
}

function DeviceCard({ device, onDelete, onToggleActive }: DeviceCardProps) {
    const hasOffers = device.offers && device.offers.filter(o => o.isActive).length > 0;

    return (
        <Card className={`overflow-hidden flex flex-col hover:shadow-md transition-shadow ${!device.isActive ? 'opacity-60' : ''}`}>
            <div className="aspect-[4/3] bg-gray-100 relative group overflow-hidden">
                <img
                    src={device.image}
                    alt={device.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                    {hasOffers && (
                        <Badge variant="success" className="bg-rose-500 text-white border-0">
                            Offer
                        </Badge>
                    )}
                    <Badge variant={device.stock > 0 ? (device.stock < 5 ? 'warning' : 'success') : 'error'}>
                        {device.stock > 0 ? `${device.stock} in stock` : 'Out of stock'}
                    </Badge>
                </div>
                {!device.isActive && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium">Inactive</span>
                    </div>
                )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-xs font-semibold text-tortoise-600 uppercase tracking-wider">{device.brand}</p>
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{device.name}</h3>
                    </div>
                </div>

                <div className="space-y-1 mb-4 flex-1">
                    <p className="text-sm text-gray-500">{device.specifications.storage} • {device.specifications.ram}</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-gray-900">₹{device.price}</span>
                        <span className="text-xs text-gray-500 font-medium">/mo</span>
                    </div>
                </div>

                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                    <Link to={`/devices/${device.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-2">
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit
                        </Button>
                    </Link>
                    <Link to={`/devices/${device.id}/offers`}>
                        <Button variant="secondary" size="sm" className="px-3" title="Manage Offers">
                            <Percent className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Link to={`/devices/${device.id}/stock`}>
                        <Button variant="secondary" size="sm" className="px-3" title="Manage Stock">
                            <Package className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="px-2"
                        title={device.isActive ? 'Deactivate' : 'Activate'}
                        onClick={() => onToggleActive(device.id, device.isActive)}
                    >
                        {device.isActive ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-tortoise-600" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="px-2 text-red-500 hover:bg-red-50"
                        title="Delete"
                        onClick={() => onDelete(device.id, device.name)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    )
}
