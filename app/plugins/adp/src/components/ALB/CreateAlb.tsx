import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { EditModal } from '../../utils/EditModal';
import { ArmsLengthBody } from '@internal/plugin-adp-common';
import {
  alertApiRef,
  discoveryApiRef,
  errorApiRef,
  fetchApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { armsLengthBodyClient } from '../../api/AlbClient';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { albFormFields } from './AlbFormFields';

interface CreateAlbProps {
  refetchArmsLengthBody: () => void;
}

const CreateAlb: React.FC<CreateAlbProps> = ({ refetchArmsLengthBody }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const alertApi = useApi(alertApiRef);
  const discoveryApi = useApi(discoveryApiRef);
  const fetchApi = useApi(fetchApiRef);
  const errorApi = useApi(errorApiRef);
  const fields = albFormFields;

  const albClient = new armsLengthBodyClient(discoveryApi, fetchApi);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (armsLengthBody: ArmsLengthBody) => {
    try {
      await albClient.createArmsLengthBody(armsLengthBody);
      alertApi.post({
        message: 'ALB created successfully.',
        severity: 'success',
        display: 'transient',
      });
      refetchArmsLengthBody();
      handleCloseModal();
    } catch (e: any) {
      errorApi.post(e);
      alertApi.post({
        message: `The name '${armsLengthBody.name}' is already in use. Please choose a different name.`,
        severity: 'error',
        display: 'permanent',
      });
      throw e;
    }
  };

  return (
    <>
      <Button
        variant="contained"
        size="large"
        color="primary"
        startIcon={<AddBoxIcon />}
        onClick={handleOpenModal}
      >
        Add ALB
      </Button>
      {isModalOpen && (
        <EditModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialValues={{}}
          mode="create"
          fields={fields}
        />
      )}
    </>
  );
};

export default CreateAlb;
