import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const adpPlugin = createPlugin({
  id: 'adp',
  routes: {
    root: rootRouteRef,
  },
});

// export const DeliveryProgrammePage = adpPlugin.provide(
//   createRoutableExtension({
//     name: 'DeliveryProgrammePage',
//     component: () =>
//       import('./components/ExampleComponent').then(m => m.ExampleComponent),
//     mountPoint: rootRouteRef,
//   }),
// );

export const DeliveryProgrammePage = adpPlugin.provide(
  createRoutableExtension({
    name: 'DeliveryProgrammePage',
    component: () =>
      import('./components_1/DeliveryProgrammeListPage').then(m => m.DeliveryProgrammeListPage),
    mountPoint: rootRouteRef,
  }),
);