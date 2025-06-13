import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ClassView.module.css';
import { StudentCard } from '../../../components/education/StudentCard/StudentCard';
import { ProgressChart } from '../../../components/education/ProgressChart/ProgressChart';
import { UpcomingEvents } from '../../../components/education/UpcomingEvents/UpcomingEvents';
import useStudents from '../../../api/useStudents';
import useTeachers from '../../../api/useTeachers';
import { Student } from '../../../interfaces/Student';
import { Teacher } from '../../../interfaces/Teacher';

interface Event {
  id: string;
  title: string;
  date: string;
  type: 'assignment' | 'exam' | 'other';
}

const ClassView: React.FC = () => {
  const { classId, schoolId } = useParams<{ classId: string; schoolId: string }>();
  const { students, isLoading: studentsLoading } = useStudents();
  const { teachers, isLoading: teachersLoading } = useTeachers();

  const teacher = teachers?.find(t => t.teacherId.toString() === classId);
  const classStudents = students?.filter(s => s.subjects.includes(teacher?.subjectId || 0) && s.previousSchool?.toString() === schoolId) || [];

  // Calculate class statistics
  const classData = {
    id: classId,
    name: teacher ? `${teacher.subject} Class` : 'Class',
    subject: teacher?.subject || 'Subject',
    progress: 75, // This would need to be calculated from actual data
    studentCount: classStudents.length,
    averageAttendance: 92, // This would need to be calculated from actual data
  };

  // Convert students to the format expected by StudentCard
  const studentsForDisplay = classStudents.map(student => ({
    id: student.studentId.toString(),
    name: `${student.firstName} ${student.lastName}`,
    progress: 85, // This would need to be calculated from actual data
    attendance: 95, // This would need to be calculated from actual data
    lastAssessment: 'A' // This would need to be calculated from actual data
  }));

  // Mock events data as it's not available in our current data model
  const events: Event[] = [
    { id: '1', title: 'Algebra Test', date: '2024-03-15', type: 'exam' },
    { id: '2', title: 'Geometry Assignment', date: '2024-03-20', type: 'assignment' },
    { id: '3', title: 'Parent-Teacher Meeting', date: '2024-03-25', type: 'other' },
  ];

  if (studentsLoading || teachersLoading) {
    return <div>Loading...</div>;
  }

  if (!teacher) {
    return <div>Class not found</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.classInfo}>
          <h1>{classData.name}</h1>
          <span className={styles.subject}>{classData.subject}</span>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Class Progress</span>
            <span className={styles.statValue}>{classData.progress}%</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Students</span>
            <span className={styles.statValue}>{classData.studentCount}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Average Attendance</span>
            <span className={styles.statValue}>{classData.averageAttendance}%</span>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          <section className={styles.studentsSection}>
            <h2>Students</h2>
            <div className={styles.studentsGrid}>
              {studentsForDisplay.map((student) => (
                <StudentCard
                  key={student.id}
                  id={student.id}
                  name={student.name}
                  progress={student.progress}
                  attendance={student.attendance}
                  lastAssessment={student.lastAssessment}
                />
              ))}
            </div>
          </section>
        </div>

        <aside className={styles.sidebar}>
          <section className={styles.progressSection}>
            <h2>Class Progress</h2>
            <ProgressChart data={studentsForDisplay} />
          </section>

          <section className={styles.eventsSection}>
            <h2>Upcoming Events</h2>
            <UpcomingEvents events={events} />
          </section>
        </aside>
      </div>
    </div>
  );
};

export default ClassView; 