import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deviceRepository } from '../../../devices/data/repositories/MockDeviceRepository';
import type { Device } from '../../../devices/domain/entities/Device';
import { Button, Card, Badge } from '../../../../core/components/ui';
import { ChevronLeft, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export function OffersManagementPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [device, setDevice] = useState<Device | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form state for new offer
    const [newOffer, setNewOffer] = useState({
        type: 'percentage' as 'percentage' | 'flat',
        value: 0,
        description: '',
        validFrom: '',
        validTo: '',
        isActive: true
    });

    useEffect(() => {
        if (id) {
            loadDevice(id);
        } else {
            navigate('/devices');
        }
    }, [id, navigate]);

    const loadDevice = async (deviceId: string) => {
        setLoading(true);
        const data = await deviceRepository.getById(deviceId);
        if (data) setDevice(data);
        setLoading(false);
    };

    const handleAddOffer = async () => {
        if (!device || !newOffer.description || !newOffer.validFrom || !newOffer.validTo) {
            alert('Please fill all required fields');
            return;
        }
        try {
            const updated = await deviceRepository.addOffer(device.id, newOffer);
            setDevice(updated);
            setShowForm(false);
            setNewOffer({ type: 'percentage', value: 0, description: '', validFrom: '', validTo: '', isActive: true });
        } catch (e) {
            console.error(e);
            alert('Failed to add offer');
        }
    };

    const handleRemoveOffer = async (offerId: string) => {
        if (!device) return;
        if (!confirm('Are you sure you want to remove this offer?')) return;
        try {
            const updated = await deviceRepository.removeOffer(device.id, offerId);
            setDevice(updated);
        } catch (e) {
            console.error(e);
        }
    };

    const handleToggleOffer = async (offerId: string) => {
        if (!device) return;
        try {
            const updated = await deviceRepository.toggleOfferStatus(device.id, offerId);
            setDevice(updated);
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="p-8"><div className="animate-spin w-8 h-8 border-b-2 border-tortoise-600 rounded-full"></div></div>;
    if (!device) return <div className="p-8">Device not found</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/devices')}>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Manage Offers</h1>
                        <p className="text-gray-500">{device.brand} {device.name}</p>
                    </div>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Offer
                </Button>
            </div>

            {/* Add Offer Form */}
            {showForm && (
                <Card className="p-6 space-y-4 bg-tortoise-50 border-tortoise-200">
                    <h3 className="font-semibold text-gray-900">New Offer</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Offer Type</label>
                            <select
                                value={newOffer.type}
                                onChange={(e) => setNewOffer({ ...newOffer, type: e.target.value as 'percentage' | 'flat' })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            >
                                <option value="percentage">Percentage Off</option>
                                <option value="flat">Flat Discount (₹)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                            <input
                                type="number"
                                value={newOffer.value}
                                onChange={(e) => setNewOffer({ ...newOffer, value: Number(e.target.value) })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                placeholder={newOffer.type === 'percentage' ? 'e.g., 10' : 'e.g., 500'}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input
                                type="text"
                                value={newOffer.description}
                                onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                placeholder="e.g., Summer sale discount"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                            <input
                                type="date"
                                value={newOffer.validFrom}
                                onChange={(e) => setNewOffer({ ...newOffer, validFrom: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Valid To</label>
                            <input
                                type="date"
                                value={newOffer.validTo}
                                onChange={(e) => setNewOffer({ ...newOffer, validTo: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                        <Button onClick={handleAddOffer}>Save Offer</Button>
                    </div>
                </Card>
            )}

            {/* Offers List */}
            <Card className="divide-y divide-gray-100">
                {device.offers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No offers configured for this device. Add one above!
                    </div>
                ) : (
                    device.offers.map((offer) => (
                        <div key={offer.id} className="p-4 flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-900">
                                        {offer.type === 'percentage' ? `${offer.value}% off` : `₹${offer.value} off`}
                                    </span>
                                    <Badge variant={offer.isActive ? 'success' : 'default'}>
                                        {offer.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-600">{offer.description}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Valid: {new Date(offer.validFrom).toLocaleDateString()} - {new Date(offer.validTo).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleToggleOffer(offer.id)}>
                                    {offer.isActive ? <ToggleRight className="w-5 h-5 text-tortoise-600" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleRemoveOffer(offer.id)}>
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </Card>
        </div>
    );
}
