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
import { armsLengthBodyClient } from '../../api/AlbClient';
import { armsLengthBodyApi } from '../../api/AlbApi';

export const AlbViewPageComponent = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [tableData, setTableData] = useState<ArmsLengthBody[]>([]);
  const [key, refetchArmsLengthBody] = useReducer(i => i + 1, 0);
  const alertApi = useApi(alertApiRef);

  const discoveryApi = useApi(discoveryApiRef);
  const fetchApi = useApi(fetchApiRef);

  const albClient: armsLengthBodyApi = new armsLengthBodyClient(
    discoveryApi,
    fetchApi,
  );

  const getAllArmsLengthBodies = async () => {
    try {
      const data = await albClient.getArmsLengthBodies();
      setTableData(data);
    } catch (error) {
      console.error('Errors fetching data', error);
    }
  };

  useEffect(() => {
    getAllArmsLengthBodies();
  }, [key]);

  const handleEdit = (ArmsLengthBody: React.SetStateAction<{}>) => {
    setFormData(ArmsLengthBody);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setFormData({});
    setModalOpen(false);
  };

  const handleUpdate = async (armsLengthBody: ArmsLengthBody) => {
    try {
      await albClient.updateArmsLengthBody(armsLengthBody);

      refetchArmsLengthBody();
      handleCloseModal();
    } catch (e: any) {
      console.error('Error updating arms length body', e.message);

      alertApi.post({ message: e.message, severity: 'error' });
    }
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
      title: 'Created at',
      field: 'timestamp',
      highlight: false,
      type: 'date',
    },

    {
      title: 'Action',
      highlight: true,
      render: rowData => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleEdit(rowData)}
        >
          Edit
        </Button>
      ),
    },
  ];

  const fields = [
    {
      label: 'Name',
      name: 'name',
      helperText:
        'This must be unique - use letters, numbers, or separators such as "_", "-"',
      validations: {
        required: true,
        pattern: {
          value: /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+$/,
          message:
            'Invalid ALB name format. Use letters, numbers, or "-", "_", "." as separators.',
        },
      },
    },
    {
      label: 'Short Name',
      name: 'short_name',
      helperText: 'Optional - a short form name to identify the body',
    },
    {
      label: 'ALB Description',
      name: 'description',
      helperText: 'Max 200 Chars',
      validations: {
        required: true,
        maxLength: 200,
      },
      multiline: true,
      maxRows: 4,
    },
  ];

  return (
    <Page themeId="tool">
      <Header
        title="Azure Development Platform: Data"
        subtitle="ADP Platform Configuration"
      />
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
        <DefaultTable data={tableData} columns={columns} title="View all" />
        {isModalOpen && (
          <EditModal
            open={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleUpdate}
            initialValues={formData}
            fields={fields}
          />
        )}
      </Content>
    </Page>
  );
};
