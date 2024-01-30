import React, { useState, useEffect, useReducer } from 'react';
import { Button, Typography } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  SupportButton,
  TableColumn,
} from '@backstage/core-components';
import { DefaultTable } from '../../utils/Table';
import { EditModal } from '../../utils/EditModal';
import {
  useApi,
  discoveryApiRef,
  fetchApiRef,
  alertApiRef,
} from '@backstage/core-plugin-api';
import { ArmsLengthBody } from '@internal/plugin-adp-backend';



export const AlbViewPageComponent = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [key, refetchArmsLengthBody] = useReducer(i => i + 1, 0);
  const alertApi = useApi(alertApiRef);


  const discoveryApi = useApi(discoveryApiRef);
  const { fetch } = useApi(fetchApiRef);

  const fetchTableData = async () => {
    try {
      const response = await fetch(
        `${await discoveryApi.getBaseUrl('adp')}/armsLengthBody`,
      );
      const data = await response.json();
      console.log(data);
      setTableData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [key]);

  useEffect(() => {
    // Clear the form data when the modal is closed
    if (!isModalOpen) {
      setFormData({});
    }
  }, [isModalOpen]);



  const handleEdit = (ArmsLengthBody: React.SetStateAction<{}>) => {
    setFormData(ArmsLengthBody);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setFormData({})
    setModalOpen(false);

  };

  const handleUpdate = async (armsLengthBody: ArmsLengthBody) => {
    
    try {
      console.log('Updating with data:', armsLengthBody);
      const response = await fetch(
        `${await discoveryApi.getBaseUrl('adp')}/armsLengthBody`,
        {
          method: 'PATCH',
          body: JSON.stringify({ ...armsLengthBody }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
       
      );
      if (!response.ok) {
        const { error } = await response.json();
        alertApi.post({
          message: error.message,
          severity: 'error',
        });
        setFormData({})
        return;
      }
      refetchArmsLengthBody();
    
    } catch (e: any) {
      console.error('Error updating arms length body:', e.message);
      alertApi.post({ message: e.message, severity: 'error' });

      setFormData({})
    }
    handleCloseModal();
  };

  const columns: TableColumn[] = [
    {
      title: 'Name',
      field: 'name',
      highlight: true,
      type: 'string',
    },
    {
      title: 'Short Name',
      field: 'short_name',
      highlight: true,
      type: 'string',
    },
    {
      title: 'Description',
      field: 'description',
      highlight: false,
      type: 'string',
    },
    {
      title: 'Last Edit',
      field: 'timestamp',
      highlight: false,
      type: 'date',
    },
  
    {
      title: 'Action',
      highlight: true,
      render: ArmsLengthBody => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleEdit(ArmsLengthBody)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Page themeId="tool">
      <Header title="Azure Development Platform: Data" subtitle="ADP Data" />
      <Content>
        <ContentHeader title="Arms Length Bodies">
          <SupportButton>
            View or manage units within the DEFRA delivery organization on the
            Azure Developer Platform.
          </SupportButton>
        </ContentHeader>
        <Typography paragraph>
          View or add Arms Length Bodies to the Azure Developer Platform.
        </Typography>
        <DefaultTable
          data={tableData}
          columns={columns}
          title="View all"
        />

        <EditModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleUpdate}
          initialValues={formData}
          fields={[
            { label: 'Name', name: 'name' },
            { label: 'Short Name', name: 'short_name' },
            { label: 'ALB Description', name: 'description' },

          ]}
          titleData={formData}
        />
      </Content>
    </Page>
  );
};
