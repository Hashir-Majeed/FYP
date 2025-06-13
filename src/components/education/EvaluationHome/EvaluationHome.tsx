import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EvaluationHome.module.css';

const EvaluationHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1>Evaluation Tools</h1>
      <div className={styles.buttonContainer}>
        <button 
          className={styles.evalButton}
          onClick={() => navigate('/tool-evaluation/bertscore')}
        >
          <h2>BERT Score Evaluation</h2>
          <p>Evaluate responses using BERT Score to measure semantic similarity with reference texts</p>
        </button>

        <button 
          className={styles.evalButton}
          onClick={() => navigate('/tool-evaluation/sentiment')}
        >
          <h2>Sentiment Analysis</h2>
          <p>Analyze the sentiment of responses and compare with reference texts</p>
        </button>

        <button 
          className={styles.evalButton}
          onClick={() => navigate('/tool-evaluation/stereotypes')}
        >
          <h2>Stereotype Detection</h2>
          <p>Detect potential stereotypes in responses using the StereoSet model</p>
        </button>
      </div>
    </div>
  );
};

export default EvaluationHome; 