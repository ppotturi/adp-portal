import React from 'react';
import { Table, TableColumn } from '@backstage/core-components';

type DefaultTableProps = {
  data: Array<{}>;
  columns: TableColumn[];
  title: string;
};

export const DefaultTable = ({ data, columns, title }: DefaultTableProps) => {
  return (
    <Table
      options={{ paging: false }}
      data={data}
      columns={columns}
      title={title}
    />
  );
};
