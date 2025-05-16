import React, { useState, useEffect } from 'react';
import styles from './UnitForm.module.css';

const UnitForm = ({ unit, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name_of_unit: '',
    brigade_or_higher: '',
    mil_unit: '',
    description: '',
    email: '',
    status: 'Створені користувачі',
    date_when_finished: '',
    computer_name: '',
    ip_address: ''
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
        status: unit.status || 'Створені користувачі',
        date_when_finished: unit.date_when_finished || '',
        computer_name: unit.computer_name || '',
        ip_address: unit.ip_address || ''
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
    { value: 'Створені користувачі', label: 'Створені користувачі' },
    { value: 'Заявка в jira', label: 'Заявка в jira' },
    { value: 'Прикінцева конфігурація', label: 'Прикінцева конфігурація' },
    { value: 'finita', label: 'finita' },
    { value: 'відхилено', label: 'відхилено' }
  ];
  
  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="name_of_unit">Позивний</label>
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
          <label className={styles.label} htmlFor="brigade_or_higher">Дійсна назва</label>
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
        <label className={styles.label} htmlFor="ip_address">IP адреса</label>
        <input
          className={styles.input}
          type="text"
          id="ip_address"
          name="ip_address"
          value={formData.ip_address}
          onChange={handleChange}
        />
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