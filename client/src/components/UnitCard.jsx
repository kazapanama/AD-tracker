import React from 'react';
import { Link } from 'react-router-dom';
import styles from './UnitCard.module.css';

const getStatusLabel = (status) => {
  switch (status) {
    case 'Створені користувачі': return 'Створені користувачі';
    case 'Заявка в jira': return 'Заявка в jira';
    case 'Прикінцева конфігурація': return 'Прикінцева конфігурація';
    case 'finita': return 'finita';
    case 'відхилено': return 'відхилено';
    default: return status;
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Створені користувачі': return styles.usersCreated;
    case 'Заявка в jira': return styles.jiraRequestMade;
    case 'Прикінцева конфігурація': return styles.domainAdded;
    case 'finita': return styles.completed;
    case 'відхилено': return styles.rejected;
    default: return styles.defaultStatus;
  }
};

const UnitCard = ({ unit }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{unit.name_of_unit || 'Підрозділ'}</h3>
        <span className={`${styles.statusBadge} ${getStatusClass(unit.status)}`}>
          {getStatusLabel(unit.status)}
        </span>
      </div>
      
      <div className={styles.cardBody}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Військова частина:</span>
          <span className={styles.infoValue}>{unit.mil_unit}</span>
        </div>
        
        {unit.brigade_or_higher && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Бригада:</span>
            <span className={styles.infoValue}>{unit.brigade_or_higher}</span>
          </div>
        )}
        
        {unit.email && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Email:</span>
            <span className={styles.infoValue}>{unit.email}</span>
          </div>
        )}
        
        {unit.date_when_finished && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Дата завершення:</span>
            <span className={styles.infoValue}>{unit.date_when_finished}</span>
          </div>
        )}
        
        {unit.description && (
          <p className={styles.description}>{unit.description}</p>
        )}
      </div>
      
      <div className={styles.cardActions}>
        <Link className={styles.viewButton} to={`/units/${unit.id}`}>Детальніше</Link>
      </div>
    </div>
  );
};

export default UnitCard;