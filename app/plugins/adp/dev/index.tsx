import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { createDevApp } from '@backstage/dev-utils';
import { adpPlugin, DeliveryProgrammePage } from '../src/plugin';

const mockEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'adp-delivery-programmes-list',
    description: 'backstage.io',
    annotations: {
      'backstage.io/kubernetes-id': 'adp',
    },
  },
  spec: {
    lifecycle: 'production',
    type: 'service',
    owner: 'user:guest',
  },
};

createDevApp()
  .registerPlugin(adpPlugin)
  .addPage({
    path: '/delivery-programmes',
    title: 'Delivery Programmes',
    element: (
      <EntityProvider entity={mockEntity}>
        <DeliveryProgrammePage />
      </EntityProvider>
    ),
  })
  .render();

// createDevApp()
//   .registerPlugin(adpPlugin)
//   .addPage({
//     element: <DeliveryProgrammePage />,
//     title: 'Root Page',
//     path: '/adp'
//   })
//   .render();