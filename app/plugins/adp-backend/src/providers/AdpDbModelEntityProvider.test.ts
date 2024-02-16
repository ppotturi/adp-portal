// import { AdpDbModelEntityProvider } from './AdpDbModelEntityProvider';
// import {
//   TaskInvocationDefinition,
//   PluginTaskScheduler,
//   TaskRunner,
// } from '@backstage/backend-tasks';
// import { PluginDatabaseManager } from '@backstage/backend-common';
// import { ConfigReader } from '@backstage/config';
// import { getVoidLogger } from '@backstage/backend-common';
// import { EntityProviderConnection } from '@backstage/plugin-catalog-node';

// describe('AdpDbModelEntityProvider', () => {
//   const mockConfig = new ConfigReader({
//     catalog: {
//       providers: {
//         adpDb: {
//           baseUrl: 'http://adpdb:8080',
//           schedule: {
//             frequency: {
//               minutes: 10,
//             },
//             timeout: {
//               minutes: 10,
//             },
//           },
//         },
//       },
//     },
//   });

//   class PersistingTaskRunner implements TaskRunner {
//     private tasks: TaskInvocationDefinition[] = [];

//     getTasks() {
//       return this.tasks;
//     }

//     run(task: TaskInvocationDefinition): Promise<void> {
//       this.tasks.push(task);
//       return Promise.resolve(undefined);
//     }
//   }

//   const logger = getVoidLogger();
//   const mockTaskRunner = { run: jest.fn() } as unknown as TaskRunner;
//   const mockDatabaseManager = {} as PluginDatabaseManager;
//   //const mockScheduler = {} as PluginTaskScheduler;
//   // const mockScheduler = { run: jest.fn().mockReturnValue(mockTaskRunner),
//   // };
//   const mockSchedule = new PersistingTaskRunner();

//   const options = {
//     logger: logger,
//     // schedule: mockSchedule,
//     scheduler: mockSchedule,
//     database: mockDatabaseManager,
//   };

//   const entityProvider = AdpDbModelEntityProvider.fromConfig(
//     mockConfig,
//     options,
//   );

//   const mockConnection: EntityProviderConnection = {
//     applyMutation: jest.fn(),
//     refresh: jest.fn(),
//   };

//   it('should throw an error if neither schedule nor scheduler is provided', () => {
//     expect(() =>
//       AdpDbModelEntityProvider.fromConfig(mockConfig, {
//         logger: logger,
//         scheduler: mockSchedule,
//         database: mockDatabaseManager,
//       }),
//     ).toThrow('Either schedule or scheduler must be provided.');
//   });

//   jest.mock('../armsLengthBody/armsLengthBodyStore', () => ({
//     ArmsLengthBodyStore: jest.fn().mockImplementation(() => ({
//       getAll: jest.fn().mockResolvedValue([
//         {
//           creator: 'Seed',
//           owner: 'Seed',
//           title: 'Environment Agency',
//           alias: 'EA',
//           description: '',
//           url: null,
//           name: 'environment-agency',
//           id: '4b5c98c3-94fb-444e-8d9b-ebe71ac4d5f3',
//           created_at: '2024-02-05T11:29:33.059Z',
//         },
//       ]),
//     })),
//   }));

//   jest.mock('../database/adpDatabase', () => ({
//     AdpDatabase: {
//       create: jest.fn().mockResolvedValue({
//         creator: 'Seed',
//         owner: 'Seed',
//         title: 'Environment Agency',
//         alias: 'EA',
//         description: '',
//         url: null,
//         name: 'environment-agency',
//         id: '4b5c98c3-94fb-444e-8d9b-ebe71ac4d5f3',
//         created_at: '2024-02-05T11:29:33.059Z',
//       }),
//     },
//   }));

//   describe('fromConfig', () => {
//     it('initializes correctly from configuration', () => {
//       expect(entityProvider).toBeDefined();
//     });

//     it('throws an error if neither schedule nor scheduler is provided', () => {
//       expect(() =>
//         AdpDbModelEntityProvider.fromConfig(mockConfig, options),
//       ).toThrow();
//     });
//   });

//   describe('connect and refresh', () => {
//     it('connects and schedules refresh successfully', async () => {
//       await entityProvider.connect(mockConnection);
//       expect(mockTaskRunner.run).toHaveBeenCalledWith({
//         id: expect.any(String),
//         fn: expect.any(Function),
//       });
//     });
//   });

//   describe('refresh', () => {
//     it('should refresh data and apply mutation', async () => {
//       const mockTrackProgress = jest.fn().mockReturnValue({
//         markReadComplete: jest
//           .fn()
//           .mockReturnValue({ markCommitComplete: jest.fn() }),
//       });
//       entityProvider['trackProgress'] = mockTrackProgress;
//       entityProvider['readArmsLengthBodies'] = jest.fn().mockResolvedValue([]);

//       const refreshFn = entityProvider['refresh'];
//       await refreshFn(logger, mockDatabaseManager);

//       expect(logger.info).toHaveBeenCalledWith(
//         'Discovering ADP Data Model Entities',
//       );
//       expect(mockTaskRunner.run).toHaveBeenCalledTimes(1);
//       expect(mockConnection.applyMutation).toHaveBeenCalledWith({
//         type: 'full',
//         entities: [],
//       });
//     });
//   });
// });
