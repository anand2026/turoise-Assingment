import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Device, CreateDeviceDTO } from '../../domain/entities/Device';
import { Button, Card } from '../../../../core/components/ui';

const deviceSchema = z.object({
    name: z.string().min(1, 'Device name is required'),
    brand: z.string().min(1, 'Brand is required'),
    model: z.string().min(1, 'Model is required'),
    image: z.string().url('Must be a valid URL').or(z.string().length(0)),
    price: z.coerce.number().min(1, 'Price must be greater than 0'),
    marketPrice: z.coerce.number().min(1, 'Market price must be greater than 0'),
    stock: z.coerce.number().min(0, 'Stock cannot be negative'),
    specifications: z.object({
        processor: z.string().optional(),
        ram: z.string().optional(),
        storage: z.string().optional(),
        display: z.string().optional(),
        camera: z.string().optional(),
        battery: z.string().optional(),
    }),
    isActive: z.boolean(),
});

type DeviceFormData = z.infer<typeof deviceSchema>;

interface DeviceFormProps {
    device?: Device;
    onSubmit: (data: CreateDeviceDTO) => void;
    isLoading?: boolean;
}

export function DeviceForm({ device, onSubmit, isLoading }: DeviceFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<DeviceFormData>({
        resolver: zodResolver(deviceSchema) as any,
        defaultValues: {
            name: device?.name || '',
            brand: device?.brand || '',
            model: device?.model || '',
            image: device?.image || '',
            price: device?.price || 0,
            marketPrice: device?.marketPrice || 0,
            stock: device?.stock || 0,
            specifications: {
                processor: device?.specifications?.processor || '',
                ram: device?.specifications?.ram || '',
                storage: device?.specifications?.storage || '',
                display: device?.specifications?.display || '',
                camera: device?.specifications?.camera || '',
                battery: device?.specifications?.battery || '',
            },
            isActive: device?.isActive ?? true,
        },
    });

    const handleFormSubmit = (data: DeviceFormData) => {
        onSubmit({
            ...data,
            image: data.image || 'https://via.placeholder.com/400x300?text=Device',
            specifications: {
                processor: data.specifications.processor || '',
                ram: data.specifications.ram || '',
                storage: data.specifications.storage || '',
                display: data.specifications.display || '',
                camera: data.specifications.camera || '',
                battery: data.specifications.battery || '',
            },
            offers: device?.offers || [],
        });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Device Name *
                        </label>
                        <input
                            {...register('name')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tortoise-500"
                            placeholder="e.g., iPhone 15 Pro"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Brand *
                        </label>
                        <input
                            {...register('brand')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tortoise-500"
                            placeholder="e.g., Apple"
                        />
                        {errors.brand && (
                            <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Model *
                        </label>
                        <input
                            {...register('model')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tortoise-500"
                            placeholder="e.g., 15 Pro"
                        />
                        {errors.model && (
                            <p className="text-red-500 text-sm mt-1">{errors.model.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image URL
                        </label>
                        <input
                            {...register('image')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tortoise-500"
                            placeholder="https://example.com/image.jpg"
                        />
                        {errors.image && (
                            <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
                        )}
                    </div>
                </div>
            </Card>

            {/* Pricing & Stock */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Stock</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Monthly Rental Price (₹) *
                        </label>
                        <input
                            type="number"
                            {...register('price')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tortoise-500"
                            placeholder="3500"
                        />
                        {errors.price && (
                            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Market Price (₹) *
                        </label>
                        <input
                            type="number"
                            {...register('marketPrice')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tortoise-500"
                            placeholder="134900"
                        />
                        {errors.marketPrice && (
                            <p className="text-red-500 text-sm mt-1">{errors.marketPrice.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Initial Stock *
                        </label>
                        <input
                            type="number"
                            {...register('stock')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tortoise-500"
                            placeholder="25"
                        />
                        {errors.stock && (
                            <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
                        )}
                    </div>
                </div>

                <div className="mt-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            {...register('isActive')}
                            className="w-4 h-4 text-tortoise-600 border-gray-300 rounded focus:ring-tortoise-500"
                        />
                        <span className="text-sm text-gray-700">Active (visible to employees)</span>
                    </label>
                </div>
            </Card>

            {/* Specifications */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Processor
                        </label>
                        <input
                            {...register('specifications.processor')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tortoise-500"
                            placeholder="e.g., A17 Pro"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            RAM
                        </label>
                        <input
                            {...register('specifications.ram')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tortoise-500"
                            placeholder="e.g., 8GB"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Storage
                        </label>
                        <input
                            {...register('specifications.storage')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tortoise-500"
                            placeholder="e.g., 128GB"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display
                        </label>
                        <input
                            {...register('specifications.display')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tortoise-500"
                            placeholder='e.g., 6.1" Super Retina XDR'
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Camera
                        </label>
                        <input
                            {...register('specifications.camera')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tortoise-500"
                            placeholder="e.g., 48MP Main"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Battery
                        </label>
                        <input
                            {...register('specifications.battery')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tortoise-500"
                            placeholder="e.g., 3274 mAh"
                        />
                    </div>
                </div>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : device ? 'Update Device' : 'Add Device'}
                </Button>
            </div>
        </form>
    );
}
