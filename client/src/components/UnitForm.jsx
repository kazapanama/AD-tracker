import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FormContainer = styled.form`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  
  &:focus {
    border-color: #4b0082;
    outline: none;
    box-shadow: 0 0 0 2px rgba(75, 0, 130, 0.2);
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
  accent-color: #4b0082;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    border-color: #4b0082;
    outline: none;
    box-shadow: 0 0 0 2px rgba(75, 0, 130, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em;
  
  &:focus {
    border-color: #4b0082;
    outline: none;
    box-shadow: 0 0 0 2px rgba(75, 0, 130, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SubmitButton = styled.button`
  background-color: #4b0082;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  
  &:hover {
    background-color: #9370db;
    transform: translateY(-1px);
  }
`;

const CancelButton = styled.button`
  background-color: white;
  color: #4b0082;
  border: 1px solid #4b0082;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const UnitForm = ({ unit, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name_of_unit: '',
    brigade_or_higher: '',
    mil_unit: '',
    description: '',
    email: '',
    status: 'Accepted Request',
    date_when_finished: '',
    sended_to_legend: 0,
    computer_name: ''
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (unit) {
      setFormData({
        name_of_unit: unit.name_of_unit || '',
        brigade_or_higher: unit.brigade_or_higher || '',
        mil_unit: unit.mil_unit || '',
        description: unit.description || '',
        email: unit.email || '',
        status: unit.status || 'Accepted Request',
        date_when_finished: unit.date_when_finished || '',
        sended_to_legend: unit.sended_to_legend || 0,
        computer_name: unit.computer_name || ''
      });
    }
  }, [unit]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
    
    // Clear error for the field when it's being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.mil_unit.trim()) {
      newErrors.mil_unit = 'Поле "Військова частина" є обов\'язковим';
    }
    
    if (!formData.computer_name.trim()) {
      newErrors.computer_name = 'Поле "Ім\'я комп\'ютера" є обов\'язковим';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Невірний формат електронної пошти';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  const statusOptions = [
    { value: 'Accepted Request', label: 'Прийнята заявка' },
    { value: 'Users Created', label: 'Створені користувачі' },
    { value: 'Jira Request Made', label: 'Зроблена заявка в Jira' },
    { value: 'Quarantine - 1', label: 'Карантин - 1' },
    { value: 'Quarantine - 2', label: 'Карантин - 2' },
    { value: 'Quarantine - 3', label: 'Карантин - 3' },
    { value: 'Domain Added', label: 'Заведено в домен' },
    { value: 'Completed', label: 'Виконано' },
    { value: 'Rejected', label: 'Відхилено' }
  ];
  
  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGrid>
        <FormGroup>
          <Label htmlFor="name_of_unit">Назва підрозділу</Label>
          <Input
            type="text"
            id="name_of_unit"
            name="name_of_unit"
            value={formData.name_of_unit}
            onChange={handleChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="brigade_or_higher">Бригада або вище</Label>
          <Input
            type="text"
            id="brigade_or_higher"
            name="brigade_or_higher"
            value={formData.brigade_or_higher}
            onChange={handleChange}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="mil_unit">Військова частина*</Label>
          <Input
            type="text"
            id="mil_unit"
            name="mil_unit"
            value={formData.mil_unit}
            onChange={handleChange}
            required
          />
          {errors.mil_unit && <ErrorMessage>{errors.mil_unit}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">Електронна пошта</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="computer_name">Ім'я комп'ютера*</Label>
          <Input
            type="text"
            id="computer_name"
            name="computer_name"
            value={formData.computer_name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="status">Статус</Label>
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="date_when_finished">Дата завершення</Label>
          <Input
            type="date"
            id="date_when_finished"
            name="date_when_finished"
            value={formData.date_when_finished}
            onChange={handleChange}
          />
        </FormGroup>
      </FormGrid>
      
      <FormGroup>
        <Label htmlFor="description">Опис</Label>
        <TextArea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </FormGroup>
      
      <FormGroup>
        <CheckboxContainer>
          <CheckboxLabel>
            <Checkbox
              type="checkbox"
              name="sended_to_legend"
              checked={formData.sended_to_legend === 1}
              onChange={handleChange}
            />
            Відправлено в легенду
          </CheckboxLabel>
        </CheckboxContainer>
      </FormGroup>
      
      <ButtonGroup>
        {onCancel && (
          <CancelButton type="button" onClick={onCancel}>
            Скасувати
          </CancelButton>
        )}
        <SubmitButton type="submit">
          {unit ? 'Оновити' : 'Створити'}
        </SubmitButton>
      </ButtonGroup>
    </FormContainer>
  );
};

export default UnitForm;