import React, { useState, useEffect } from 'react';
import { client } from '../../../auth/client';
import { uepStudentLogic } from '@tutorial-todo-aip-app/sdk';
import styles from './ToolEvaluation.module.css';

interface EvaluationResult {
  prompt: string;
  reference: string;
  response: string;
  precision: number;
  recall: number;
  f1: number;
}

export const ToolEvaluation: React.FC = () => {
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentProgress, setCurrentProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });

  const computeBertScore = async (candidate: string, reference: string) => {
    try {
      const response = await fetch('http://localhost:5000/compute-bert-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ candidate, reference }),
      });

      if (!response.ok) {
        throw new Error('Failed to compute BERT Score');
      }

      return await response.json();
    } catch (error) {
      console.error('Error computing BERT Score:', error);
      throw error;
    }
  };

  const runEvaluation = async () => {
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      // Fetch the default CSV file
      const response = await fetch('/src/data/evaluation_samples.csv');
      const text = await response.text();
      const rows = text.split('\n').slice(1); // Skip header row
      const evaluationResults: EvaluationResult[] = [];
      
      setCurrentProgress({ current: 0, total: rows.length });

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row.trim()) continue;
        
        const [prompt, reference] = row.split(',').map(cell => cell.trim());
        
        // Get AIP tool response
        const response = await client(uepStudentLogic).executeFunction({
          prompt,
          student2: 3, // Using a default student ID for evaluation
          teacher: 1,
          school: 3
        });

        // Compute BERT Score
        const bertScore = await computeBertScore(response, reference);

        const result = {
          prompt,
          reference,
          response,
          precision: bertScore.precision,
          recall: bertScore.recall,
          f1: bertScore.f1
        };

        evaluationResults.push(result);
        setResults([...evaluationResults]); // Update results in real-time
        setCurrentProgress({ current: i + 1, total: rows.length });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during evaluation');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate average scores
  const averageScores = results.length > 0 ? {
    precision: results.reduce((sum, r) => sum + r.precision, 0) / results.length,
    recall: results.reduce((sum, r) => sum + r.recall, 0) / results.length,
    f1: results.reduce((sum, r) => sum + r.f1, 0) / results.length
  } : null;

  return (
    <div className={styles.container}>
      <h1>AIP Tool Evaluation</h1>
      <div className={styles.controlSection}>
        <button 
          onClick={runEvaluation} 
          disabled={isLoading}
          className={styles.evaluateButton}
        >
          {isLoading ? 'Evaluating...' : 'Run Evaluation'}
        </button>
        {isLoading && (
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${(currentProgress.current / currentProgress.total) * 100}%` }}
            />
            <span className={styles.progressText}>
              {currentProgress.current} / {currentProgress.total}
            </span>
          </div>
        )}
        {error && <div className={styles.error}>{error}</div>}
      </div>

      {results.length > 0 && (
        <div className={styles.results}>
          <div className={styles.summarySection}>
            <h2>Summary</h2>
            {averageScores && (
              <div className={styles.scoreCards}>
                <div className={styles.scoreCard}>
                  <h3>Average Precision</h3>
                  <p>{averageScores.precision.toFixed(4)}</p>
                </div>
                <div className={styles.scoreCard}>
                  <h3>Average Recall</h3>
                  <p>{averageScores.recall.toFixed(4)}</p>
                </div>
                <div className={styles.scoreCard}>
                  <h3>Average F1 Score</h3>
                  <p>{averageScores.f1.toFixed(4)}</p>
                </div>
              </div>
            )}
          </div>

          <h2>Detailed Results</h2>
          <table className={styles.resultsTable}>
            <thead>
              <tr>
                <th>Prompt</th>
                <th>Reference</th>
                <th>Response</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>F1 Score</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.prompt}</td>
                  <td>{result.reference}</td>
                  <td>{result.response}</td>
                  <td>{result.precision.toFixed(4)}</td>
                  <td>{result.recall.toFixed(4)}</td>
                  <td>{result.f1.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}; 