import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto, UpdateEventDto } from './dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  create(createEventDto: CreateEventDto) {
    const event = this.eventsRepository.create(createEventDto);
    return this.eventsRepository.save(event);
  }

  findAll() {
    return this.eventsRepository.find();
  }

  async findOne(id: number) {
    const event = await this.eventsRepository.findOneBy({ id });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const event = await this.findOne(id);
    this.eventsRepository.merge(event, updateEventDto);
    return this.eventsRepository.save(event);
  }

  async remove(id: number) {
    const event = await this.findOne(id);
    await this.eventsRepository.remove(event);
    return { message: 'Event deleted successfully' };
  }
}
