import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, Card } from '../../../../core/components/ui';
import type { Device, DeviceCategory } from '../../domain/entities/Device';
import { Loader2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const deviceCategories: { value: DeviceCategory; label: string }[] = [
    { value: 'phone', label: '📱 Phone' },
    { value: 'laptop', label: '💻 Laptop' },
    { value: 'tablet', label: '📲 Tablet' },
    { value: 'smartwatch', label: '⌚ Smartwatch' },
    { value: 'headphones', label: '🎧 Headphones' },
    { value: 'other', label: '📦 Other' },
];

const deviceSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    brand: z.string().min(2, 'Brand is required'),
    model: z.string().min(1, 'Model is required'),
    category: z.enum(['phone', 'laptop', 'tablet', 'smartwatch', 'headphones', 'other']),
    image: z.string().url('Must be a valid URL'),
    price: z.coerce.number().min(0, 'Price must be positive'),
    marketPrice: z.coerce.number().min(0, 'Market price must be positive'),
    stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
    specifications: z.object({
        processor: z.string().min(1, 'Processor is required'),
        ram: z.string().min(1, 'RAM is required'),
        storage: z.string().min(1, 'Storage is required'),
        display: z.string().min(1, 'Display is required'),
        camera: z.string().min(1, 'Camera is required'),
        battery: z.string().min(1, 'Battery is required'),
    }),
    isActive: z.boolean().default(true),
});

type DeviceFormData = z.infer<typeof deviceSchema>;

interface DeviceFormProps {
    initialData?: Device;
    onSubmit: (data: DeviceFormData) => Promise<void>;
    isSubmitting?: boolean;
}

export function DeviceForm({ initialData, onSubmit, isSubmitting }: DeviceFormProps) {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<DeviceFormData>({
        resolver: zodResolver(deviceSchema) as any,
        defaultValues: initialData ? {
            ...initialData,
        } : {
            isActive: true,
            stock: 0,
            category: 'phone',
            specifications: {
                processor: '',
                ram: '',
                storage: '',
                display: '',
                camera: '',
                battery: ''
            }
        }
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <Card className="p-6 md:col-span-2 space-y-6">
                    <h3 className="text-lg font-semibold border-b border-gray-100 pb-2">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Device Name" error={errors.name?.message} {...register('name')} placeholder="e.g. iPhone 15 Pro" />
                        <Input label="Brand" error={errors.brand?.message} {...register('brand')} placeholder="e.g. Apple" />
                        <Input label="Model" error={errors.model?.message} {...register('model')} placeholder="e.g. 15 Pro" />

                        {/* Category Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Device Category</label>
                            <select
                                {...register('category')}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-tortoise-500"
                            >
                                {deviceCategories.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
                        </div>

                        <Input label="Image URL" error={errors.image?.message} {...register('image')} placeholder="https://..." className="md:col-span-2" />
                    </div>
                </Card>

                {/* Pricing & Stock */}
                <Card className="p-6 space-y-6">
                    <h3 className="text-lg font-semibold border-b border-gray-100 pb-2">Pricing & Stock</h3>
                    <div className="space-y-4">
                        <Input label="Monthly Rental Price (₹)" type="number" error={errors.price?.message} {...register('price')} />
                        <Input label="Market Price (₹)" type="number" error={errors.marketPrice?.message} {...register('marketPrice')} />
                        <Input label="Initial Stock" type="number" error={errors.stock?.message} {...register('stock')} />
                        <div className="flex items-center gap-2 pt-2">
                            <input type="checkbox" id="isActive" className="rounded border-gray-300 text-tortoise-600 focus:ring-tortoise-500" {...register('isActive')} />
                            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Available for Listing</label>
                        </div>
                    </div>
                </Card>

                {/* Specifications */}
                <Card className="p-6 space-y-6">
                    <h3 className="text-lg font-semibold border-b border-gray-100 pb-2">Specifications</h3>
                    <div className="space-y-4">
                        <Input label="Processor" error={errors.specifications?.processor?.message} {...register('specifications.processor')} />
                        <Input label="RAM" error={errors.specifications?.ram?.message} {...register('specifications.ram')} />
                        <Input label="Storage" error={errors.specifications?.storage?.message} {...register('specifications.storage')} />
                        <Input label="Display" error={errors.specifications?.display?.message} {...register('specifications.display')} />
                        <Input label="Camera" error={errors.specifications?.camera?.message} {...register('specifications.camera')} />
                        <Input label="Battery" error={errors.specifications?.battery?.message} {...register('specifications.battery')} />
                    </div>
                </Card>
            </div>

            <div className="sticky bottom-6 flex justify-end gap-4 bg-white/80 backdrop-blur-md p-4 rounded-xl border border-gray-200 shadow-lg">
                <Button type="button" variant="outline" onClick={() => navigate('/devices')}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Device
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}

function Input({ label, error, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string, error?: string }) {
    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-tortoise-500 disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    )
}
