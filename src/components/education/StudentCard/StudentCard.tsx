import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './StudentCard.module.css';

interface StudentCardProps {
  id: string;
  name: string;
  progress: number;
  attendance: number;
  lastAssessment: string;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  id,
  name,
  progress,
  attendance,
  lastAssessment,
}) => {
  const navigate = useNavigate();
  const { schoolId } = useParams<{ schoolId: string }>();

  const handleClick = () => {
    navigate(`/education/${schoolId}/student/${id}`);
  };

  const getProgressColor = (value: number) => {
    if (value >= 90) return '#4CAF50';
    if (value >= 70) return '#FFC107';
    return '#F44336';
  };

  const getAttendanceColor = (value: number) => {
    if (value >= 90) return '#4CAF50';
    if (value >= 75) return '#FFC107';
    return '#F44336';
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.header}>
        <h3 className={styles.name}>{name}</h3>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Progress</span>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ 
                width: `${progress}%`,
                backgroundColor: getProgressColor(progress)
              }}
            />
          </div>
          <span className={styles.metricValue}>{progress}%</span>
        </div>

        <div className={styles.metric}>
          <span className={styles.metricLabel}>Attendance</span>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ 
                width: `${attendance}%`,
                backgroundColor: getAttendanceColor(attendance)
              }}
            />
          </div>
          <span className={styles.metricValue}>{attendance}%</span>
        </div>

        <div className={styles.metric}>
          <span className={styles.metricLabel}>Last Assessment</span>
          <span className={styles.assessment}>{lastAssessment}</span>
        </div>
      </div>
    </div>
  );
}; 