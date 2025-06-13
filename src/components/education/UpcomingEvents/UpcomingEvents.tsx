import React from 'react';
import styles from './UpcomingEvents.module.css';

interface Event {
  id: string;
  title: string;
  date: string;
  type: 'assignment' | 'exam' | 'other';
}

interface UpcomingEventsProps {
  events: Event[];
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'assignment':
        return '📝';
      case 'exam':
        return '📚';
      case 'other':
        return '📅';
      default:
        return '📅';
    }
  };

  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'assignment':
        return '#2196F3';
      case 'exam':
        return '#F44336';
      case 'other':
        return '#9C27B0';
      default:
        return '#757575';
    }
  };

  return (
    <div className={styles.eventsList}>
      {events.map((event) => (
        <div 
          key={event.id} 
          className={styles.event}
          style={{ borderLeftColor: getEventColor(event.type) }}
        >
          <div className={styles.eventIcon}>
            {getEventIcon(event.type)}
          </div>
          <div className={styles.eventContent}>
            <h4 className={styles.eventTitle}>{event.title}</h4>
            <span className={styles.eventDate}>{formatDate(event.date)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}; 