import { useNavigate } from 'react-router-dom';
import styles from './SchoolSelection.module.css';

const SCHOOLS = [
  { id: 1, name: "King's College School Wimbledon" },
  { id: 2, name: "West Kirby Grammar School" },
  { id: 3, name: "Wycombe Abbey School" }
];

const SchoolSelection = () => {
  const navigate = useNavigate();

  const handleSchoolSelect = (schoolId: number) => {
    navigate(`/education/${schoolId}`);
  };

  return (
    <div className={styles.container}>
      <h1>Select Your School</h1>
      <div className={styles.schoolGrid}>
        {SCHOOLS.map((school) => (
          <button
            key={school.id}
            className={styles.schoolButton}
            onClick={() => handleSchoolSelect(school.id)}
          >
            {school.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SchoolSelection; 