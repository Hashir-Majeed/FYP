import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './TeacherDashboard.module.css';
import { ClassCard } from '../../../components/education/ClassCard/ClassCard';
import useReports from '../../../api/useReports';
import useSchools from '../../../api/useSchools';
import useStudents from '../../../api/useStudents';
import useTeachers from '../../../api/useTeachers';
import { Report } from '../../../interfaces/Report';
import { School } from '../../../interfaces/School';
import { Student } from '../../../interfaces/Student';
import { Teacher } from '../../../interfaces/Teacher';

interface Class {
  id: string;
  name: string;
  subject: string;
  progress: number;
  studentCount: number;
  upcomingEvents: number;
}

interface TutorGroup {
  id: string;
  name: string;
  studentCount: number;
}

const TeacherDashboard: React.FC = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const { reports, isLoading: reportsLoading } = useReports();
  const { schools, isLoading: schoolsLoading } = useSchools();
  const { students, isLoading: studentsLoading } = useStudents();
  const { teachers, isLoading: teachersLoading } = useTeachers();

  const currentSchool = schools?.find(s => s.schoolId?.toString() === schoolId);


  // Filter students and teachers for the current school
  const schoolStudents = students?.filter(student => student.previousSchool?.toString() === schoolId) || [];
  const schoolTeachers = teachers || [];
  // Calculate classes based on teachers and their subjects
  const classes: Class[] = schoolTeachers.map(teacher => ({
    id: teacher.teacherId.toString(),
    name: `${teacher.subject} Class`,
    subject: teacher.subject,
    progress: 75, // This would need to be calculated from actual data
    studentCount: schoolStudents.filter(student => student.subjects.includes(teacher.subjectId))?.length || 0,
    upcomingEvents: 0 // This would need to be calculated from actual data
  }));
  console.log(classes);
  // Calculate tutor group based on students
  const tutorGroup: TutorGroup = {
    id: '1',
    name: 'Year 10 Tutor Group',
    studentCount: schoolStudents.filter(student => student.yearGroup === 10)?.length || 0,
  };

  if (schoolsLoading || studentsLoading || teachersLoading || reportsLoading) {
    return <div>Loading...</div>;
  }

  if (!currentSchool) {
    return <div>School not found</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{currentSchool.schoolName}</h1>
        <div className={styles.tutorGroup}>
          <h2>Tutor Group</h2>
          <div className={styles.tutorGroupCard}>
            <h3>{tutorGroup.name}</h3>
            <p>{tutorGroup.studentCount} Students</p>
          </div>
        </div>
      </header>

      <section className={styles.classesSection}>
        <h2>My Classes</h2>
        <div className={styles.classesGrid}>
          {classes.map((classItem) => (
            <ClassCard
              key={classItem.id}
              id={classItem.id}
              name={classItem.name}
              subject={classItem.subject}
              progress={classItem.progress}
              studentCount={classItem.studentCount}
              upcomingEvents={classItem.upcomingEvents}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default TeacherDashboard; 