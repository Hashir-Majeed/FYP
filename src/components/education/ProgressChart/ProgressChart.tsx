import React from 'react';
import styles from './ProgressChart.module.css';

interface Student {
  id: string;
  name: string;
  progress: number;
  attendance: number;
  lastAssessment: string;
}

interface ProgressChartProps {
  data: Student[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  const progressRanges = [
    { min: 0, max: 20, label: '0-20%' },
    { min: 21, max: 40, label: '21-40%' },
    { min: 41, max: 60, label: '41-60%' },
    { min: 61, max: 80, label: '61-80%' },
    { min: 81, max: 100, label: '81-100%' },
  ];

  const calculateDistribution = () => {
    return progressRanges.map(range => {
      const count = data.filter(student => 
        student.progress >= range.min && student.progress <= range.max
      ).length;
      return {
        ...range,
        count,
        percentage: (count / data.length) * 100
      };
    });
  };

  const distribution = calculateDistribution();
  const maxCount = Math.max(...distribution.map(d => d.count));

  return (
    <div className={styles.chart}>
      <div className={styles.bars}>
        {distribution.map((range, index) => (
          <div key={index} className={styles.barContainer}>
            <div 
              className={styles.bar}
              style={{ 
                height: `${(range.count / maxCount) * 100}%`,
                backgroundColor: range.min >= 81 ? '#4CAF50' :
                               range.min >= 61 ? '#8BC34A' :
                               range.min >= 41 ? '#FFC107' :
                               range.min >= 21 ? '#FF9800' :
                               '#F44336'
              }}
            />
            <span className={styles.barLabel}>{range.count}</span>
          </div>
        ))}
      </div>
      <div className={styles.labels}>
        {distribution.map((range, index) => (
          <span key={index} className={styles.label}>{range.label}</span>
        ))}
      </div>
    </div>
  );
}; 