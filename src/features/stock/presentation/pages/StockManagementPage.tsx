import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deviceRepository } from '../../../devices/data/repositories/MockDeviceRepository';
import type { Device } from '../../../devices/domain/entities/Device';
import { Button, Card, Badge } from '../../../../core/components/ui';
import { ChevronLeft, Loader2, RefreshCw } from 'lucide-react';

export function StockManagementPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [device, setDevice] = useState<Device | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [newTotal, setNewTotal] = useState(0);

    useEffect(() => {
        // If id is present, manage single device stock. 
        // If no id, maybe show list? For this assignment, let's assume /stock points to global list or specific item.
        // The previous App.tsx used :id/stock for specific item. 
        // And /stock for general.
        // Let's handle both or just the specific one for now based on route.

        // We will assume this component handles SINGLE device if ID provided.
        if (id) {
            loadDevice(id);
        } else {
            // Redirect to device list if no ID (simplification)
            navigate('/devices');
        }
    }, [id, navigate]);

    const loadDevice = async (deviceId: string) => {
        setLoading(true);
        const data = await deviceRepository.getById(deviceId);
        if (data) {
            setDevice(data);
            setNewTotal(data.stock);
        }
        setLoading(false);
    };

    const handleUpdate = async () => {
        if (!device) return;
        setUpdating(true);
        try {
            await deviceRepository.updateStock(device.id, newTotal);
            await loadDevice(device.id);
            alert('Stock updated successfully');
            navigate('/devices');
        } catch (e) {
            console.error(e);
            alert('Failed to update stock');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-8"><div className="animate-spin w-8 h-8 border-b-2 border-tortoise-600"></div></div>;
    if (!device) return <div className="p-8">Device not found</div>;

    return (
        <div className="p-8 max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/devices')}>
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Stock</h1>
                    <p className="text-gray-500">Update inventory for {device.name}</p>
                </div>
            </div>

            <Card className="p-6">
                <div className="flex gap-6 items-start">
                    <img src={device.image} alt={device.name} className="w-24 h-24 object-cover rounded-lg bg-gray-100" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{device.brand} {device.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{device.model}</p>
                        <Badge variant={device.stock > 0 ? (device.stock < 5 ? 'warning' : 'success') : 'error'}>
                            {device.stock > 0 ? `${device.stock} units currently` : 'Out of stock'}
                        </Badge>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Stock</label>
                        <div className="text-3xl font-bold text-gray-900">{device.stock}</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Total Stock</label>
                        <div className="flex items-center gap-4">
                            <button
                                className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 text-2xl font-medium transition-colors"
                                onClick={() => setNewTotal(prev => Math.max(0, prev - 1))}
                            >-</button>
                            <div className="w-20 text-center text-3xl font-bold text-gray-900">
                                {newTotal}
                            </div>
                            <button
                                className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 text-2xl font-medium transition-colors"
                                onClick={() => setNewTotal(prev => prev + 1)}
                            >+</button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Adjusting by {newTotal - device.stock > 0 ? '+' : ''}{newTotal - device.stock} units
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <Button onClick={handleUpdate} disabled={updating || newTotal === device.stock}>
                        {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                        Update Stock
                    </Button>
                </div>
            </Card>
        </div>
    );
}
