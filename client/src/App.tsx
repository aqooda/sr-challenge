import React from 'react';
import { Divider, Typography } from 'antd';
import ValidationForm from './components/ValidationForm';
import ValidationResult from './components/ValidationResult';
import { ValidationContextProvider } from './contexts/validation';

import styles from './styles.module.css';

const App: React.FC = () => (
  <div className={styles.container}>
    <Typography.Title level={3}>Validate phone number or email</Typography.Title>

    <ValidationContextProvider>
      <ValidationForm />

      <Divider />

      <ValidationResult />
    </ValidationContextProvider>
  </div>
);

export default App;
