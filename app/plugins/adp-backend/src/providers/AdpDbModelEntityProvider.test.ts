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
import { Entity } from '@backstage/catalog-model';
import { EntityProviderConnection } from '@backstage/plugin-catalog-node';

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
const mockTaskRunner = {
  createScheduleFn: jest.fn(),
  run: jest.fn(),
} as TaskRunner;
const mockDatabaseManager = {} as PluginDatabaseManager;
const mockScheduler = {
  createScheduledTaskRunner: jest.fn(),
} as unknown as PluginTaskScheduler;
const mockSchedule = new PersistingTaskRunner();

const options = {
  logger: mockLogger,
  schedule: mockSchedule,
  scheduler: mockScheduler,
  database: mockDatabaseManager,
};

const entityProvider = new AdpDbModelEntityProvider(
  mockLogger,
  mockTaskRunner,
  mockConfig,
  mockDatabaseManager,
);

const mockConnection: EntityProviderConnection = {
  applyMutation: jest.fn(),
  refresh: jest.fn(),
};

describe('AdpDbModelEntityProvider', () => {
  describe('fromConfig', () => {
    it('initializes correctly from configuration', () => {
      const entityProvider = AdpDbModelEntityProvider.fromConfig(
        mockConfig,
        options,
      );
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

  // describe('track progress', () => {
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //     jest.spyOn(Date, 'now');
  //   });

  //   afterAll(() => {
  //     jest.restoreAllMocks();
  //   });

  //   it('logs read and commit progress with correct durations and entity counts', () => {
  //     const { markReadComplete } = entityProvider.trackProgress(mockLogger);
  //     const mockedDateNow = Date.now as jest.MockedFunction<typeof Date.now>;
  //     const startTime = 1000;
  //     const readTime = 2000;
  //     const commitTime = 4000;
  //     mockedDateNow
  //       .mockReturnValueOnce(startTime)
  //       .mockReturnValueOnce(readTime)
  //       .mockReturnValueOnce(commitTime);

  //     const readEntities: Entity[] = [
  //       {
  //         apiVersion: 'v1',
  //         kind: 'ExampleKind',
  //         metadata: {
  //           name: 'entity1',
  //         },
  //       },
  //       {
  //         apiVersion: 'v1',
  //         kind: 'ExampleKind',
  //         metadata: {
  //           name: 'entity2',
  //         },
  //       },
  //     ];

  //     const committedEntities: Entity[] = [
  //       {
  //         apiVersion: 'v1',
  //         kind: 'ExampleKind',
  //         metadata: {
  //           name: 'entity3',
  //         },
  //       },
  //       {
  //         apiVersion: 'v1',
  //         kind: 'ExampleKind',
  //         metadata: {
  //           name: 'entity4',
  //         },
  //       },
  //     ];

  //     const { markCommitComplete } = markReadComplete(readEntities);

  //     expect(mockLogger.info).toHaveBeenCalledWith(
  //       expect.stringContaining('Read'),
  //     );

  //     markCommitComplete(committedEntities);

  //     expect(mockLogger.info).toHaveBeenCalledWith(
  //       `Committed 2 in 2.0 seconds.`,
  //     );
  //   });
  // });
});
