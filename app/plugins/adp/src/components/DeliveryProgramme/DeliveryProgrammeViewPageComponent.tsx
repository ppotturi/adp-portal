import React, { useState, useEffect, useReducer } from 'react';
import { Button ,Typography } from '@material-ui/core';
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
import CreateDeliveryProgramme from './CreateDeliveryProgramme';
import { DeliveryProgrammeClient } from './api/DeliveryProgrammeClient';
import { DeliveryProgrammeApi } from './api/DeliveryProgrammeApi';
import { DeliveryProgrammeFormFields } from './DeliveryProgrammeFormFields';



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
  const fields = DeliveryProgrammeFormFields;

 


  const deliveryprogClient: DeliveryProgrammeApi = new DeliveryProgrammeClient(
    discoveryApi,
    fetchApi,
  );



  const getAllDeliveryProgrammes = async () => {
    try {
      const data = await deliveryprogClient.getDeliveryProgrammes();
      console.log(data)
   
      setTableData(data);
    } catch (e: any) {
      errorApi.post(e);
    }
  };

  useEffect(() => {
    getAllDeliveryProgrammes()
    
  }, [key]);

  const handleEdit = async (deliveryProgramme: DeliveryProgramme) => {

    try {
      const detailedProgramme = await deliveryprogClient.getDeliveryProgrammeById(deliveryProgramme.id);
      setFormData(detailedProgramme);
      setIsModalOpen(true);
    } catch (e: any) {
      console.log(e)
      errorApi.post(e);
    }
  };

  console.log("form data ", formData)

  
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
        message: `The title '${deliveryProgramme.title}' is already in use. Please choose a different title.`,
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
    },

    {
      title: 'Description',
      field: 'description',
      highlight: false,
      type: 'string',
    },

    {
      title: 'Updated At',
      field: 'updated_at',
      highlight: false,
      type: 'datetime',
    },

    {
      width: '',
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

        <DefaultTable
          data={tableData}
          columns={columns}
          title="View all"
          isCompact={true}
        />

        {isModalOpen && (
          <ActionsModal
            open={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleUpdate}
            initialValues={formData}
            mode="edit"
            fields={fields}
          />
        )}


      </Content>
    </Page>
  );
};
