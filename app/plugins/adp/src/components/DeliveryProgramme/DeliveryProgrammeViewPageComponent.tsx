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
import { ActionsModal } from '../../utils/ActionsModal';
import {
  useApi,
  discoveryApiRef,
  fetchApiRef,
  alertApiRef,
  errorApiRef,
} from '@backstage/core-plugin-api';
import { DeliveryProgramme } from '@internal/plugin-adp-common';
import { DeliveryProgrammeFormFields } from './DeliveryProgrammeFormFields';
import CreateDeliveryProgramme from './CreateDeliveryProgramme';
import { DeliveryProgrammeClient } from './api/DeliveryProgrammeClient';
import { DeliveryProgrammeApi } from './api/DeliveryProgrammeApi';
import { useArmsLengthBodyList } from '../../hooks/useArmsLengthBodyList';


export const DeliveryProgrammeViewPageComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [tableData, setTableData] = useState<DeliveryProgramme[]>([]);
  const [key, refetchDeliveryProgramme] = useReducer(i => {
    return i + 1;
  }, 0);
  
  const alertApi = useApi(alertApiRef);
  const errorApi = useApi(errorApiRef);
  const discoveryApi = useApi(discoveryApiRef);
  const fetchApi = useApi(fetchApiRef);
  const getArmsLengthBodyDropDown = useArmsLengthBodyList();

  const deliveryprogClient: DeliveryProgrammeApi = new DeliveryProgrammeClient(
    discoveryApi,
    fetchApi,
  );

  const getAlbOptionFields = () => {
    return DeliveryProgrammeFormFields.map(field => {
      if (field.name === 'arms_length_body') {
        return { ...field, options: getArmsLengthBodyDropDown };
        
      }
      return field;
    });
  };

  const getAllDeliveryProgrammes = async () => {
    try {
      const data = await deliveryprogClient.getDeliveryProgrammes();
      setTableData(data);
    } catch (e: any) {
      errorApi.post(e);
    }
  };

  useEffect(() => {
    getAllDeliveryProgrammes();
  }, [key]);

  const handleEdit = (DeliveryProgramme: React.SetStateAction<{}>) => {
    setFormData(DeliveryProgramme);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setFormData({});
    setIsModalOpen(false);
  };

  const isNameUnique = (title: string, id: string) => {
    return !tableData.some(
      item =>
        item.title.toLowerCase() === title.toLowerCase() && item.id !== id,
    );
  };

  const handleUpdate = async (deliveryProgramme: DeliveryProgramme) => {
    if (!isNameUnique(deliveryProgramme.title, deliveryProgramme.id)) {
      setIsModalOpen(true);

      alertApi.post({
        message: `The name '${deliveryProgramme.title}' is already in use. Please choose a different name.`,
        severity: 'error',
        display: 'permanent',
      });

      return;
    }

    try {
      await deliveryprogClient.updateDeliveryProgramme(deliveryProgramme);
      alertApi.post({
        message: `Updated`,
        severity: 'success',
        display: 'transient',
      });
      refetchDeliveryProgramme();
    } catch (e: any) {
      errorApi.post(e);
    }
  };

  const columns: TableColumn[] = [
    {
      title: 'Title',
      field: 'title',
      highlight: true,
      type: 'string',
    },
    {
      title: 'Alias',
      field: 'alias',
      highlight: false,
      type: 'string',
    },

    {
      title: 'Arms Length Body',
      field: 'arms_length_body',
      highlight: false,
      type: 'string',
      render: rowData => {
        const label = getArmsLengthBodyDropDown.find(option => option.value === rowData.arms_length_body)?.label;
        return label 
      }
    },

    {
      title: 'Programme Manager',
      field: 'programme_manager',
      highlight: false,
      type: 'string',
    },

    {
      title: 'Description',
      field: 'delivery_programme_code',
      highlight: false,
      type: 'string',
    },

    {
      title: 'Updated At',
      field: 'updated_at',
      render: (data: {}) => {
        const e = data as DeliveryProgramme;
        if (e.updated_at === undefined) {
          return 'No date available'; 
        }
        const date = new Date(e.updated_at);
        return date.toLocaleString();
      },
      highlight: false,
      type: 'date',
    },

    {
      title: '',
      highlight: true,
      render: rowData => {
        return (
          <Button
            variant="contained"
            color="default"
            onClick={() => handleEdit(rowData)}
            data-testid={`delivery-programme-edit-button-${rowData.id}`}
          >
            Edit
          </Button>
        );
      },
    },
  ];

  return (
    <Page themeId="tool">
      <Header
        title="Azure Development Platform: Data"
        subtitle="ADP Platform Configuration"
      />
      <Content>
        <ContentHeader title="Delivery Programmes">
          <CreateDeliveryProgramme
            refetchDeliveryProgramme={refetchDeliveryProgramme}
          />
          <SupportButton>
            View or manage units within the DEFRA delivery organization on the
            Azure Developer Platform.
          </SupportButton>
        </ContentHeader>
        <Typography paragraph>
          View or add Delivery Programmes to the Azure Developer Platform.
        </Typography>

        <DefaultTable data={tableData} columns={columns} title="View all" />

        {isModalOpen && (
          <ActionsModal
            open={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleUpdate}
            initialValues={formData}
            mode="edit"
            fields={getAlbOptionFields()}
          />
        )}
      </Content>
    </Page>
  );
};
