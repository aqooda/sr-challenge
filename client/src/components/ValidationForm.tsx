import React, { useCallback, useContext, useMemo, useState } from 'react';
import { AutoComplete, Button, Form, Modal } from 'antd';
import axios from 'axios';
import { ValidationContext } from '@/contexts/validation';
import type { EmailValidationResult, PhoneValidationResult, ValidationResponse } from '@/types/api';

interface FormValues {
  phone: string | undefined;
  email: string | undefined;
}

const initialValues: FormValues = {
  phone: undefined,
  email: undefined,
};

const normalizeValue = (value: string | undefined) => value?.trimStart() || undefined;

const ValidationForm: React.FC = () => {
  const { results, addResult } = useContext(ValidationContext);
  const [loading, setLoading] = useState(false);
  const phoneHistory = useMemo(() => results.filter(({ type }) => type === 'phone'), [results]);
  const emailHistory = useMemo(() => results.filter(({ type }) => type === 'email'), [results]);
  const onFinish = useCallback(async (formValues: FormValues) => {
    setLoading(true);

    try {
      const { data } = await axios.post<ValidationResponse>('/api/validate', formValues);

      if (formValues.email) {
        addResult({
          key: formValues.email,
          type: 'email',
          value: formValues.email,
          result: data.email as EmailValidationResult,
        });
      }
      if (formValues.phone) {
        addResult({
          key: formValues.phone,
          type: 'phone',
          value: formValues.phone,
          result: data.phone as PhoneValidationResult,
        });
      }
    } catch (err) {
      Modal.error({ content: 'Failed to validate' });
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Form layout="vertical" initialValues={initialValues} onFinish={onFinish}>
      <Form.Item label="Phone Number" name="phone" help="Suggested format: +852 2222 3333" normalize={normalizeValue}>
        <AutoComplete placeholder="Input a phone number or pick from history" options={phoneHistory} allowClear />
      </Form.Item>

      <Form.Item label="Email" name="email" normalize={normalizeValue}>
        <AutoComplete placeholder="Input an email or pick from history" options={emailHistory} allowClear />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading}>
        Validate
      </Button>
    </Form>
  );
};

export default ValidationForm;
