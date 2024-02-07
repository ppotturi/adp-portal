// import React from 'react';
// import { render, screen, waitFor } from '@testing-library/react';
// import { AlbViewPageComponent } from './AlbViewPageComponent';
// import { armsLengthBodyClient } from '../../api/AlbClient'; // Import the client class instead of the API interface
// import { ThemeProvider, createTheme } from '@material-ui/core';
// import { alertApiRef, useApi } from '@backstage/core-plugin-api';

// jest.mock('@backstage/core-plugin-api', () => ({
//     useApi: jest.fn(),
//   }));


// jest.mock('@backstage/core-plugin-api', () => ({
//   useApi: jest.fn().mockReturnValue({
//     alertApi: {
//       post: jest.fn(),
//     },
//     errorApi: {
//       post: jest.fn(),
//     },
//     discoveryApi: {
//       getBaseUrl: jest.fn(),
//     },
//     fetchApi: {
//       fetch: jest.fn(),
//     },
//     useApi: jest.fn(),
//   }),
// }));


// jest.mock('../../api/AlbClient', () => ({
//   armsLengthBodyClient: {
//     getArmsLengthBodies: jest.fn(),
//   },
// }));

// describe('AlbViewPageComponent', () => {
//   const mockData = [
//     { id: '1', name: 'ALB 1', short_name: 'A1', description: 'Description 1', timestamp: '2022-01-01' },
//     { id: '2', name: 'ALB 2', short_name: 'A2', description: 'Description 2', timestamp: '2022-01-02' },
//   ];

//   beforeEach(() => {
//     armsLengthBodyClient.getArmsLengthBodies.mockResolvedValueOnce(mockData); // Mock the resolved value for the getArmsLengthBodies method
//   });

//   it('renders correctly', async () => {
//     render(
//       <ThemeProvider theme={createTheme()}>
//         <AlbViewPageComponent />
//       </ThemeProvider>
//     );

//     // Verify that the component renders correctly
//     expect(screen.getByText('Arms Length Bodies')).toBeInTheDocument();
//     expect(screen.getByText('View or add Arms Length Bodies')).toBeInTheDocument();

//     // Verify that the table displays the correct data
//     await waitFor(() => {
//       expect(screen.getByText('ALB 1')).toBeInTheDocument();
//       expect(screen.getByText('ALB 2')).toBeInTheDocument();
//     });
//   });

// });
