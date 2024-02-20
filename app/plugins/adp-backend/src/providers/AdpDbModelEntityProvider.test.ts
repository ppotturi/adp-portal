import { AdpDbModelEntityProvider } from './AdpDbModelEntityProvider';
import {
  TaskInvocationDefinition,
  PluginTaskScheduler,
  TaskRunner,
} from '@backstage/backend-tasks';
import {
  PluginDatabaseManager,
  getVoidLogger,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { EntityProviderConnection } from '@backstage/plugin-catalog-node';
import { Entity } from '@backstage/catalog-model';

describe('AdpDbModelEntityProvider', () => {
  const mockConfig = new ConfigReader({
    catalog: {
      providers: {
        adpDb: {
          baseUrl: 'http://adpdb:8080',
          schedule: {
            frequency: {
              minutes: 10,
            },
            timeout: {
              minutes: 10,
            },
          },
        },
      },
    },
  });

  class PersistingTaskRunner implements TaskRunner {
    private tasks: TaskInvocationDefinition[] = [];

    getTasks() {
      return this.tasks;
    }

    run(task: TaskInvocationDefinition): Promise<void> {
      this.tasks.push(task);
      return Promise.resolve(undefined);
    }
  }

  const mockLogger = getVoidLogger();
  const mockTaskRunner = { run: jest.fn() } as unknown as TaskRunner;
  const mockDatabaseManager = {} as PluginDatabaseManager;
  const mockScheduler = {} as PluginTaskScheduler;
  const mockSchedule = new PersistingTaskRunner();

  const options = {
    logger: mockLogger,
    schedule: mockSchedule,
    scheduler: mockScheduler,
    database: mockDatabaseManager,
  };

  const entityProvider = AdpDbModelEntityProvider.fromConfig(
    mockConfig,
    options,
  );

  const mockConnection: EntityProviderConnection = {
    applyMutation: jest.fn(),
    refresh: jest.fn(),
  };

  jest.mock('../armsLengthBody/armsLengthBodyStore', () => ({
    ArmsLengthBodyStore: jest.fn().mockImplementation(() => ({
      getAll: jest.fn().mockResolvedValue([
        {
          creator: 'Seed',
          owner: 'Seed',
          title: 'Environment Agency',
          alias: 'EA',
          description: '',
          url: null,
          name: 'environment-agency',
          id: '4b5c98c3-94fb-444e-8d9b-ebe71ac4d5f3',
          created_at: '2024-02-05T11:29:33.059Z',
        },
      ]),
    })),
  }));

  jest.mock('../database/adpDatabase', () => ({
    AdpDatabase: {
      create: jest.fn().mockResolvedValue({
        creator: 'Seed',
        owner: 'Seed',
        title: 'Environment Agency',
        alias: 'EA',
        description: '',
        url: null,
        name: 'environment-agency',
        id: '4b5c98c3-94fb-444e-8d9b-ebe71ac4d5f3',
        created_at: '2024-02-05T11:29:33.059Z',
      }),
    },
  }));

  describe('fromConfig', () => {
    it('initializes correctly from configuration', () => {
      expect(entityProvider).toBeDefined();
    });
  });

  describe('connect and refresh', () => {
    it('connects and schedules refresh successfully', async () => {
      await entityProvider.connect(mockConnection);
      expect(mockTaskRunner.run).toHaveBeenCalledWith({
        id: expect.any(String),
        fn: expect.any(Function),
      });
    });
  });

  describe('refresh', () => {
    it('should refresh data and apply mutation', async () => {
      const mockTrackProgress = jest.fn().mockReturnValue({
        markReadComplete: jest
          .fn()
          .mockReturnValue({ markCommitComplete: jest.fn() }),
      });
      entityProvider['trackProgress'] = mockTrackProgress;
      entityProvider['readArmsLengthBodies'] = jest.fn().mockResolvedValue([]);

      const refreshFn = entityProvider['refresh'];
      await refreshFn(mockLogger, mockDatabaseManager);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Discovering ADP Data Model Entities',
      );
      expect(mockTaskRunner.run).toHaveBeenCalledTimes(1);
      expect(mockConnection.applyMutation).toHaveBeenCalledWith({
        type: 'full',
        entities: [],
      });
    });
  });

  describe('', () => {
    const loggerSpy = jest.spyOn(mockLogger, 'info');
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(Date, 'now');
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('logs read and commit progress with correct durations and entity counts', () => {
      const { markReadComplete } = entityProvider.trackProgress(mockLogger);
      const mockedDateNow = Date.now as jest.MockedFunction<typeof Date.now>;
      const startTime = 1000;
      const readTime = 2000;
      const commitTime = 4000;
      mockedDateNow
        .mockReturnValueOnce(startTime)
        .mockReturnValueOnce(readTime)
        .mockReturnValueOnce(commitTime);

      const readEntities: Entity[] = [
        {
          apiVersion: 'v1',
          kind: 'ExampleKind',
          metadata: {
            name: 'entity1',
          },
        },
        {
          apiVersion: 'v1',
          kind: 'ExampleKind',
          metadata: {
            name: 'entity2',
          },
        },
      ];

      const committedEntities: Entity[] = [
        {
          apiVersion: 'v1',
          kind: 'ExampleKind',
          metadata: {
            name: 'entity3',
          },
        },
        {
          apiVersion: 'v1',
          kind: 'ExampleKind',
          metadata: {
            name: 'entity4',
          },
        },
      ];
  
      const { markCommitComplete } = markReadComplete(readEntities);
      expect(loggerSpy).toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining('Read')
      );

      markCommitComplete(committedEntities);

      expect(mockLogger.info).toHaveBeenCalledWith(
        `Committed 2 in 2.0 seconds.`,
      );
    });
  });
});
