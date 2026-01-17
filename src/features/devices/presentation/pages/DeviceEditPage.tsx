import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DeviceForm } from '../components/DeviceForm';
import { deviceRepository } from '../../data/repositories/MockDeviceRepository';
import type { Device } from '../../domain/entities/Device';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../../../../core/components/ui';

export function DeviceEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [device, setDevice] = useState<Device | undefined>(undefined);
    const [loading, setLoading] = useState(!!id);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (id) {
            deviceRepository.getById(id).then(found => {
                if (found) setDevice(found);
                setLoading(false);
            });
        }
    }, [id]);

    const handleSubmit = async (data: any) => {
        setSubmitting(true);
        try {
            if (id) {
                await deviceRepository.update(id, data);
            } else {
                await deviceRepository.create(data);
            }
            navigate('/devices');
        } catch (error) {
            console.error(error);
            alert('Failed to save device');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tortoise-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/devices')}>
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{id ? 'Edit Device' : 'Add New Device'}</h1>
                    <p className="text-gray-500">{id ? `Update details for ${device?.name}` : 'Add a new device to your catalog'}</p>
                </div>
            </div>

            <DeviceForm initialData={device} onSubmit={handleSubmit} isSubmitting={submitting} />
        </div>
    );
}
