import React, { useContext } from 'react';
import { Table, Typography } from 'antd';
import { ValidationContext } from '@/contexts/validation';
import type { EmailValidationResult, PhoneValidationResult } from '@/types/api';

const renderTableTitle = () => <Typography.Text strong>Validation History</Typography.Text>;

const renderTableFooter = () => (
  <Typography.Text type="secondary">Only 1 record will be shown for same value</Typography.Text>
);

const renderTypeColumn = (type: 'email' | 'phone') => (type === 'email' ? 'Email' : 'Phone Number');

const renderResultColumn = (result: EmailValidationResult | PhoneValidationResult) => (
  <Typography.Paragraph>
    <pre>{JSON.stringify(result, undefined, 2)}</pre>
  </Typography.Paragraph>
);

const ValidationResult: React.FC = () => {
  const { results } = useContext(ValidationContext);

  return (
    <Table
      title={renderTableTitle}
      footer={renderTableFooter}
      dataSource={results}
      locale={{ emptyText: 'No validation result.' }}
      bordered
    >
      <Table.Column dataIndex="type" title="Type" render={renderTypeColumn} />
      <Table.Column dataIndex="value" title="Value" />
      <Table.Column dataIndex="result" title="Result" render={renderResultColumn} />
    </Table>
  );
};

export default ValidationResult;
