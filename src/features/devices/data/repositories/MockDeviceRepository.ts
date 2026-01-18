import type { Device, CreateDeviceDTO, UpdateDeviceDTO, Offer } from '../../domain/entities/Device';
import type { DeviceRepository } from '../../domain/repositories/DeviceRepository';

const STORAGE_KEY = 'tortoise_devices';

// Seed data - Using reliable image CDN
const initialDevices: Device[] = [
    {
        id: '1',
        name: 'iPhone 15 Pro',
        brand: 'Apple',
        model: '15 Pro',
        image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro.jpg',
        price: 3500,
        marketPrice: 134900,
        stock: 25,
        specifications: {
            processor: 'A17 Pro',
            ram: '8GB',
            storage: '128GB',
            display: '6.1" Super Retina XDR',
            camera: '48MP Main',
            battery: '3274 mAh'
        },
        offers: [
            {
                id: 'o1',
                type: 'percentage',
                value: 10,
                description: '10% off for first-time users',
                validFrom: '2026-01-01',
                validTo: '2026-03-31',
                isActive: true
            }
        ],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Google Pixel 8',
        brand: 'Google',
        model: 'Pixel 8',
        image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8.jpg',
        price: 2200,
        marketPrice: 75999,
        stock: 12,
        specifications: {
            processor: 'Tensor G3',
            ram: '8GB',
            storage: '128GB',
            display: '6.2" Actua OLED',
            camera: '50MP Main',
            battery: '4575 mAh'
        },
        offers: [],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        name: 'Samsung Galaxy S24 Ultra',
        brand: 'Samsung',
        model: 'S24 Ultra',
        image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra-5g.jpg',
        price: 4100,
        marketPrice: 129999,
        stock: 8,
        specifications: {
            processor: 'Snapdragon 8 Gen 3',
            ram: '12GB',
            storage: '256GB',
            display: '6.8" Dynamic AMOLED 2X',
            camera: '200MP Main',
            battery: '5000 mAh'
        },
        offers: [
            {
                id: 'o2',
                type: 'flat',
                value: 500,
                description: '₹500 off this month',
                validFrom: '2026-01-01',
                validTo: '2026-01-31',
                isActive: true
            }
        ],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

// Helper to load from localStorage or use seed data
function loadDevices(): Device[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return [...initialDevices];
        }
    }
    return [...initialDevices];
}

// Helper to save to localStorage
function saveDevices(devices: Device[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
}

class MockDeviceRepositoryImpl implements DeviceRepository {
    private devices: Device[] = loadDevices();

    private persist(): void {
        saveDevices(this.devices);
    }

    async getAll(): Promise<Device[]> {
        return new Promise((resolve) => {
            setTimeout(() => resolve([...this.devices]), 300);
        });
    }

    async getById(id: string): Promise<Device | null> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const device = this.devices.find(d => d.id === id);
                resolve(device ? { ...device } : null);
            }, 200);
        });
    }

    async create(data: CreateDeviceDTO): Promise<Device> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newDevice: Device = {
                    ...data,
                    id: 'dev_' + Math.random().toString(36).substring(2, 9),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                this.devices.push(newDevice);
                this.persist();
                resolve(newDevice);
            }, 400);
        });
    }

    async update(id: string, data: UpdateDeviceDTO): Promise<Device> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this.devices.findIndex(d => d.id === id);
                if (index === -1) {
                    reject(new Error('Device not found'));
                    return;
                }
                this.devices[index] = {
                    ...this.devices[index],
                    ...data,
                    updatedAt: new Date().toISOString()
                };
                this.persist();
                resolve(this.devices[index]);
            }, 400);
        });
    }

    async delete(id: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.devices = this.devices.filter(d => d.id !== id);
                this.persist();
                resolve();
            }, 200);
        });
    }

    async updateStock(id: string, quantity: number): Promise<Device> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this.devices.findIndex(d => d.id === id);
                if (index === -1) {
                    reject(new Error('Device not found'));
                    return;
                }
                this.devices[index].stock = quantity;
                this.devices[index].updatedAt = new Date().toISOString();
                this.persist();
                resolve(this.devices[index]);
            }, 200);
        });
    }

    // New: Add or update an offer on a device
    async addOffer(deviceId: string, offer: Omit<Offer, 'id'>): Promise<Device> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this.devices.findIndex(d => d.id === deviceId);
                if (index === -1) {
                    reject(new Error('Device not found'));
                    return;
                }
                const newOffer: Offer = {
                    ...offer,
                    id: 'off_' + Math.random().toString(36).substring(2, 9),
                };
                this.devices[index].offers.push(newOffer);
                this.devices[index].updatedAt = new Date().toISOString();
                this.persist();
                resolve(this.devices[index]);
            }, 300);
        });
    }

    async removeOffer(deviceId: string, offerId: string): Promise<Device> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this.devices.findIndex(d => d.id === deviceId);
                if (index === -1) {
                    reject(new Error('Device not found'));
                    return;
                }
                this.devices[index].offers = this.devices[index].offers.filter(o => o.id !== offerId);
                this.devices[index].updatedAt = new Date().toISOString();
                this.persist();
                resolve(this.devices[index]);
            }, 200);
        });
    }

    async toggleOfferStatus(deviceId: string, offerId: string): Promise<Device> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const deviceIndex = this.devices.findIndex(d => d.id === deviceId);
                if (deviceIndex === -1) {
                    reject(new Error('Device not found'));
                    return;
                }
                const offerIndex = this.devices[deviceIndex].offers.findIndex(o => o.id === offerId);
                if (offerIndex === -1) {
                    reject(new Error('Offer not found'));
                    return;
                }
                this.devices[deviceIndex].offers[offerIndex].isActive =
                    !this.devices[deviceIndex].offers[offerIndex].isActive;
                this.devices[deviceIndex].updatedAt = new Date().toISOString();
                this.persist();
                resolve(this.devices[deviceIndex]);
            }, 200);
        });
    }
}

export const deviceRepository = new MockDeviceRepositoryImpl();
