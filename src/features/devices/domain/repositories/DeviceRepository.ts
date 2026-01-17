import type { Device, CreateDeviceDTO, UpdateDeviceDTO } from '../entities/Device';

export interface DeviceRepository {
    getAll(): Promise<Device[]>;
    getById(id: string): Promise<Device | null>;
    create(data: CreateDeviceDTO): Promise<Device>;
    update(id: string, data: UpdateDeviceDTO): Promise<Device>;
    delete(id: string): Promise<void>;
    updateStock(id: string, quantity: number): Promise<Device>;
}
