import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './StudentView.module.css';
import { AIPTool } from '../../../components/education/AIPTool/AIPTool';
import useStudents from '../../../api/useStudents';
import useReports from '../../../api/useReports';
import useTeachers from '../../../api/useTeachers';
import useSchools from '../../../api/useSchools';
import { Student } from '../../../interfaces/Student';
import { Report } from '../../../interfaces/Report';

interface Assessment {
  id: string;
  title: string;
  date: string;
  grade: string;
  feedback: string;
}

interface Attendance {
  date: string;
  status: 'present' | 'absent' | 'late';
  reason?: string;
}

const StudentView: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const { students, isLoading: studentsLoading } = useStudents();
  const { reports, isLoading: reportsLoading } = useReports();
  const { teachers, isLoading: teachersLoading } = useTeachers();
  const { schools, isLoading: schoolsLoading } = useSchools();

  const student = students?.find(s => s.studentId.toString() === studentId);
  const studentReports = reports?.filter(r => r.studentId.toString() === studentId) || [];
  
  // Get the student's tutor (teacher)
  const tutor = teachers?.find(t => t.teacherId === student?.tutor);
  
  // Get the student's previous school
  const previousSchool = schools?.find(s => s.schoolId === student?.previousSchool);

  // Convert reports to assessments
  const assessments: Assessment[] = studentReports.map((report, index) => ({
    id: index.toString(),
    title: `Report ${index + 1}`,
    date: new Date().toISOString().split('T')[0], // Using current date as placeholder
    grade: report.sentimentAnalysis > 0 ? 'A' : 'B', // Using sentiment as a simple grade indicator
    feedback: report.reportSummarisation
  }));

  // Mock attendance data as it's not available in our current data model
  const recentAttendance: Attendance[] = [
    { date: '2024-03-10', status: 'present' },
    { date: '2024-03-09', status: 'late', reason: 'Medical appointment' },
    { date: '2024-03-08', status: 'present' },
  ];

  if (studentsLoading || reportsLoading || teachersLoading || schoolsLoading) {
    return <div>Loading...</div>;
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.studentInfo}>
          <h1>{`${student.firstName} ${student.lastName}`}</h1>
          <div className={styles.studentDetails}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Student ID:</span>
              <span className={styles.detailValue}>{student.studentId}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Year Group:</span>
              <span className={styles.detailValue}>Year {student.yearGroup}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Date of Birth:</span>
              <span className={styles.detailValue}>{student.dateOfBirth}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Address:</span>
              <span className={styles.detailValue}>{student.address}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>House:</span>
              <span className={styles.detailValue}>{student.house}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Enrollment Date:</span>
              <span className={styles.detailValue}>{student.enrollmentDate}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Exam Candidate Number:</span>
              <span className={styles.detailValue}>{student.examCandidateNumber}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>UCI:</span>
              <span className={styles.detailValue}>{student.uci}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Previous School:</span>
              <span className={styles.detailValue}>{previousSchool?.schoolName || 'N/A'}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Tutor:</span>
              <span className={styles.detailValue}>{tutor ? `${tutor.firstName} ${tutor.lastName}` : 'N/A'}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Subjects:</span>
              <span className={styles.detailValue}>{student.subjects.join(', ')}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Photo Consent:</span>
              <span className={styles.detailValue}>{student.photoConsent ? 'Yes' : 'No'}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Trip Consent:</span>
              <span className={styles.detailValue}>{student.tripConsent ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Overall Progress</span>
            <span className={styles.statValue}>85%</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Attendance</span>
            <span className={styles.statValue}>95%</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Overall Grade</span>
            <span className={styles.statValue}>A-</span>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          <section className={styles.assessmentsSection}>
            <h2>Recent Assessments</h2>
            <div className={styles.assessmentsList}>
              {assessments.map((assessment) => (
                <div key={assessment.id} className={styles.assessment}>
                  <div className={styles.assessmentHeader}>
                    <h3>{assessment.title}</h3>
                    <span className={styles.grade}>{assessment.grade}</span>
                  </div>
                  <div className={styles.assessmentDetails}>
                    <span className={styles.date}>{assessment.date}</span>
                    <p className={styles.feedback}>{assessment.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.attendanceSection}>
            <h2>Recent Attendance</h2>
            <div className={styles.attendanceList}>
              {recentAttendance.map((record, index) => (
                <div key={index} className={styles.attendanceRecord}>
                  <span className={styles.date}>{record.date}</span>
                  <span className={`${styles.status} ${styles[record.status]}`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                  {record.reason && (
                    <span className={styles.reason}>{record.reason}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className={styles.sidebar}>
          <section className={styles.aiToolSection}>
            <h2>AI Assistant</h2>
            <AIPTool 
              studentId={studentId || ''} 
              teacherId={tutor?.teacherId.toString()}
              schoolId={student?.previousSchool?.toString()}
            />
          </section>
        </aside>
      </div>
    </div>
  );
};

export default StudentView; 