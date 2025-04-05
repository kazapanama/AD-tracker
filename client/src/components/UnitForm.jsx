import React, { useState, useEffect } from 'react';
import styles from './UnitForm.module.css';

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
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="name_of_unit">Назва підрозділу</label>
          <input
            className={styles.input}
            type="text"
            id="name_of_unit"
            name="name_of_unit"
            value={formData.name_of_unit}
            onChange={handleChange}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="brigade_or_higher">Бригада або вище</label>
          <input
            className={styles.input}
            type="text"
            id="brigade_or_higher"
            name="brigade_or_higher"
            value={formData.brigade_or_higher}
            onChange={handleChange}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="mil_unit">Військова частина*</label>
          <input
            className={styles.input}
            type="text"
            id="mil_unit"
            name="mil_unit"
            value={formData.mil_unit}
            onChange={handleChange}
            required
          />
          {errors.mil_unit && <div className={styles.errorMessage}>{errors.mil_unit}</div>}
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="email">Електронна пошта</label>
          <input
            className={styles.input}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="computer_name">Ім'я комп'ютера*</label>
          <input
            className={styles.input}
            type="text"
            id="computer_name"
            name="computer_name"
            value={formData.computer_name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="status">Статус</label>
          <select
            className={styles.select}
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
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="date_when_finished">Дата завершення</label>
          <input
            className={styles.input}
            type="date"
            id="date_when_finished"
            name="date_when_finished"
            value={formData.date_when_finished}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="description">Опис</label>
        <textarea
          className={styles.textArea}
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      
      <div className={styles.formGroup}>
        <div className={styles.checkboxContainer}>
          <label className={styles.checkboxLabel}>
            <input
              className={styles.checkbox}
              type="checkbox"
              name="sended_to_legend"
              checked={formData.sended_to_legend === 1}
              onChange={handleChange}
            />
            Відправлено в легенду
          </label>
        </div>
      </div>
      
      <div className={styles.buttonGroup}>
        {onCancel && (
          <button className={styles.cancelButton} type="button" onClick={onCancel}>
            Скасувати
          </button>
        )}
        <button className={styles.submitButton} type="submit">
          {unit ? 'Оновити' : 'Створити'}
        </button>
      </div>
    </form>
  );
};

export default UnitForm;