import React from 'react';
import { Typography } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  SupportButton,
  TableColumn,
} from '@backstage/core-components';
import { DefaultTable } from '../../utils/Table';

export const AlbViewPageComponent = () => {
  const columns: TableColumn[] = [
    {
      title: 'Name',
      field: 'col1',
      highlight: true,
      type: 'string',
    },
    {
      title: 'Short-Form Name',
      field: 'col2',
      highlight: true,
      type: 'string',
    },
    {
      title: 'Owner',
      field: 'col3',
      highlight: true,
      type: 'string',
    },
    {
      title: 'Last Edit',
      field: 'date',
      highlight: false,
      type: 'date',
    },
  ];

  const testData10 = Array.from({ length: 7 }, (_, index) => ({
    col1: `ALB-Name-${index}`,
    col2: `Short-Form-Name_${index}`,
    col3: `Owner_Name${index}`,
    date: new Date(Math.abs(Math.sin(index)) * 10000000000000),
  }));

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
        <DefaultTable data={testData10} columns={columns} title="View all" />
      </Content>
    </Page>
  );
};
