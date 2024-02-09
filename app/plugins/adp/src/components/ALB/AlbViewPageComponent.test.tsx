// // import React from 'react';
// // import { render, screen } from '@testing-library/react';
// // import { ThemeProvider, createTheme } from '@material-ui/core';
// // import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
// // import { alertApiRef, errorApiRef, discoveryApiRef, fetchApiRef } from '@backstage/core-plugin-api';
// // import { AlbViewPageComponent } from './AlbViewPageComponent';
// // import { armsLengthBodyApiRef } from '../../api/AlbApi'; 

// // describe('AlbViewPageComponent', () => {
// //   const mockData = [
// //     { id: '1', name: 'ALB 1', short_name: 'A1', description: 'Description 1', timestamp: '2024-01-01' },
// //     { id: '2', name: 'ALB 2', short_name: 'A2', description: 'Description 2', timestamp: '2024-01-02' },
// //   ];

// //   const alertApiMock = {
// //     post: jest.fn(),
// //   };

// //   const errorApiMock = {
// //     post: jest.fn(),
// //   };

// //   const discoveryApiMock = {
// //     getBaseUrl: jest.fn(),
// //   };

// //   const fetchApiMock = {
// //     fetch: jest.fn(),
// //   };

// //   // Assuming armsLengthBodyClientMock follows the armsLengthBodyApi interface
// //   const armsLengthBodyClientMock = {
// //     getArmsLengthBodies: jest.fn().mockResolvedValue(mockData),
// //     updateArmsLengthBody: jest.fn().mockResolvedValue({}),
// //   };

// //   it('renders correctly and displays initial data', async () => {


// //     const rendered = await renderInTestApp(
// <TestApiProvider
//         apis={[
//           [alertApiRef, alertApiMock],
//           [errorApiRef, errorApiMock],
//           [discoveryApiRef, discoveryApiMock],
//           [fetchApiRef, fetchApiMock],
//           [armsLengthBodyApiRef, armsLengthBodyClientMock], // Corrected to use armsLengthBodyApiRef
//         ]}
//       ></TestApiProvider>


//       ThemeProvider theme={createTheme()}>
//       <AlbViewPageComponent />
//     </ThemeProvider>


// //     )

    

// //     // expect(screen.getAllByText('Arms Length Bodies')).toBeInTheDocument();
//     // expect(screen.getByText('View or add Arms Length Bodies')).toBeInTheDocument();

// //     // Verify that the table displays the correct data
// //     await screen.findByText('ALB 1');
// //     expect(screen.getByText('ALB 1')).toBeInTheDocument();
// //     expect(screen.getByText('ALB 2')).toBeInTheDocument();
// //   });
// // });
