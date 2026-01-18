export interface Offer {
    id: string;
    type: 'percentage' | 'flat';
    value: number; // e.g., 10 for 10% or 500 for ₹500 off
    description: string;
    validFrom: string;
    validTo: string;
    isActive: boolean;
}

export type DeviceCategory = 'phone' | 'laptop' | 'tablet' | 'smartwatch' | 'headphones' | 'other';

export interface Device {
    id: string;
    name: string;
    brand: string;
    model: string;
    category: DeviceCategory;
    image: string; // URL
    price: number; // Monthly rental price
    marketPrice: number; // Original market price
    stock: number;
    specifications: {
        processor: string;
        ram: string;
        storage: string;
        display: string;
        camera: string;
        battery: string;
    };
    offers: Offer[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDeviceDTO extends Omit<Device, 'id' | 'createdAt' | 'updatedAt'> { }
export interface UpdateDeviceDTO extends Partial<CreateDeviceDTO> { }
