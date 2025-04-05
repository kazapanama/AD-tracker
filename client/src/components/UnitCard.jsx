import React from 'react';
import { Link } from 'react-router-dom';
import styles from './UnitCard.module.css';

const getStatusLabel = (status) => {
  switch (status) {
    case 'Accepted Request': return 'Прийнята заявка';
    case 'Users Created': return 'Створені користувачі';
    case 'Jira Request Made': return 'Зроблена заявка в Jira';
    case 'Domain Added': return 'Заведено в домен';
    case 'Quarantine - 1': return 'Карантин - 1';
    case 'Quarantine - 2': return 'Карантин - 2';
    case 'Quarantine - 3': return 'Карантин - 3';
    case 'Completed': return 'Виконано';
    default: return status;
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Accepted Request': return styles.acceptedRequest;
    case 'Users Created': return styles.usersCreated;
    case 'Jira Request Made': return styles.jiraRequestMade;
    case 'Domain Added': return styles.domainAdded;
    case 'Quarantine - 1': return styles.quarantine1;
    case 'Quarantine - 2': return styles.quarantine2;
    case 'Quarantine - 3': return styles.quarantine3;
    case 'Completed': return styles.completed;
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