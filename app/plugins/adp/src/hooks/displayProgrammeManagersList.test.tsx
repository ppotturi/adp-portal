// import React from 'react';
// import { TestApiProvider } from '@backstage/test-utils';

// import {
//   alertApiRef,
//   errorApiRef,
//   discoveryApiRef,
//   fetchApiRef,
// } from '@backstage/core-plugin-api';
// import { renderHook } from '@testing-library/react-hooks';
// import { useProgrammeManagersList } from './displayProgrammeManagersList';
// const mockErrorApi = { post: jest.fn() };
// const mockDiscoveryApi = { getBaseUrl: jest.fn() };
// const mockFetchApi = { fetch: jest.fn() };
// const mockAlertApi = { post: jest.fn() };




// jest.mock('../components/DeliveryProgramme/api/DeliveryProgrammeClient', () => ({
//     DeliveryProgrammeClient: jest.fn().mockImplementation(() => ({
//       getDeliveryPManagers: jest.fn().mockResolvedValue([
//         {
          
//       },
//       ]),
//     })),
//   }));



//   it('fetches and formats data correctly', async () => {
    
//     const wrapper:React.FC = ({ children }) => (
//       <TestApiProvider
//         apis={[
//           [alertApiRef, mockAlertApi],
//           [errorApiRef, mockErrorApi],
//           [discoveryApiRef, mockDiscoveryApi],
//           [fetchApiRef, mockFetchApi],
         
//         ]}
//       >
//         {children}
//       </TestApiProvider>
//     );
  
//     const { result, waitForNextUpdate } = renderHook(() => useProgrammeManagersList(), { wrapper });
  
//     await waitForNextUpdate();
  
//     expect(result.current).toEqual({
//         "cc21ba7c-3c35-4e88-b281-df7ace32c449": "user one, user two"
        
//   });
//   });