import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ClassCard.module.css';

interface ClassCardProps {
  id: string;
  name: string;
  subject: string;
  progress: number;
  studentCount: number;
  upcomingEvents: number;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  id,
  name,
  subject,
  progress,
  studentCount,
  upcomingEvents,
}) => {
  const navigate = useNavigate();
  const { schoolId } = useParams<{ schoolId: string }>();

  const handleClick = () => {
    navigate(`/education/${schoolId}/class/${id}`);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.header}>
        <h3 className={styles.name}>{name}</h3>
        <span className={styles.subject}>{subject}</span>
      </div>
      
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={styles.progressText}>{progress}% Complete</span>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Students</span>
          <span className={styles.statValue}>{studentCount}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Upcoming Events</span>
          <span className={styles.statValue}>{upcomingEvents}</span>
        </div>
      </div>
    </div>
  );
}; 