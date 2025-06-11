import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cab } from '../entities/cab.entity';
import { BaseRepository } from '../../common/repositories/base.repository';
import { CabStatus } from '../dto/create-cab.dto';

@Injectable()
export class CabRepository extends BaseRepository<Cab> {
  constructor(
    @InjectRepository(Cab)
    private readonly cabRepository: Repository<Cab>,
  ) {
    super(cabRepository, Cab);
  }

  async findByDriverId(driverId: string): Promise<Cab[]> {
    return this.cabRepository.findBy({ driverId });
  }

  async findByStatus(status: CabStatus): Promise<Cab[]> {
    return this.cabRepository.findBy({ status });
  }

  async findByLicensePlate(licensePlate: string): Promise<Cab | null> {
    return this.cabRepository.findOneBy({ licensePlate });
  }
} 