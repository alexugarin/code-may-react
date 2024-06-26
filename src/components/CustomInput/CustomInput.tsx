import React, { useState } from 'react';

interface CustomInputProps {
  placeholder?: string;
  onChange: (value: string) => void; // Функция обратного вызова для обработки изменений
}

const CustomInput: React.FC<CustomInputProps> = ({ placeholder, onChange }) => {
  const [value, setValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    onChange(newValue); // Вызываем функцию обратного вызова с новым значением
  };

  return (
    <input
    type="text"
    value={value}
    placeholder={placeholder}
    onChange={handleChange}
  />
  );
};

export default CustomInput;
