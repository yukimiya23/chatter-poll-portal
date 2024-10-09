import React from 'react';
import { Form } from 'react-bootstrap';
import { useTheme } from '../contexts/ThemeContext';

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <Form.Check
      type="switch"
      id="dark-mode-switch"
      label="Dark Mode"
      checked={isDarkMode}
      onChange={toggleDarkMode}
    />
  );
};

export default DarkModeToggle;