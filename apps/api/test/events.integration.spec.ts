import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EventsModule } from '../src/modules/events/events.module';
import { EventsService } from '../src/modules/events/events.service';
import { Event } from '../src/modules/events/entities/event.entity';

describe('EventsModule (Integration)', () => {
  let app: INestApplication;
  let eventsService: EventsService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5434, // Test DB Port
          username: 'app',
          password: 'app',
          database: 'app_test',
          entities: [Event],
          synchronize: true,
        }),
        EventsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    eventsService = moduleFixture.get<EventsService>(EventsService);
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await dataSource.getRepository(Event).clear();
  });

  it('should create and retrieve an event', async () => {
    const createDto = {
      name: 'Integration Test Event',
      date: new Date().toISOString(),
      description: 'Testing with real DB',
      place: 'Docker Container',
    };

    const createdEvent = await eventsService.create(createDto);
    expect(createdEvent.id).toBeDefined();
    expect(createdEvent.name).toBe(createDto.name);

    const events = await eventsService.findAll();
    expect(events.length).toBe(1);
    expect(events[0]?.name).toBe(createDto.name);
  });
});
