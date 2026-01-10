import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto';
import { Repository } from 'typeorm';

const mockEvent = {
  id: 1,
  name: 'Test Event',
  date: new Date(),
  description: 'Test Description',
  place: 'Test Place',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('EventsService', () => {
  let service: EventsService;
  let repo: Repository<Event>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            create: jest
              .fn()
              .mockImplementation(
                (dto: CreateEventDto) => dto as unknown as Event,
              ),
            save: jest.fn().mockResolvedValue(mockEvent),
            find: jest.fn().mockResolvedValue([mockEvent]),
            findOneBy: jest.fn().mockResolvedValue(mockEvent),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repo = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an event', async () => {
    const dto: CreateEventDto = {
      name: 'New Event',
      date: new Date().toISOString(),
    };
    expect(await service.create(dto)).toEqual(mockEvent);
    expect(repo.create).toHaveBeenCalledWith(dto);
  });

  it('should return all events', async () => {
    expect(await service.findAll()).toEqual([mockEvent]);
    expect(repo.find).toHaveBeenCalled();
  });

  it('should find one event', async () => {
    expect(await service.findOne(1)).toEqual(mockEvent);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });
});
