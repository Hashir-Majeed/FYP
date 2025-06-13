import React, { useState } from 'react';
import { client } from '../../../auth/client';
import { uepStudentLogic } from '@tutorial-todo-aip-app/sdk';
import styles from './SentimentAnalysis.module.css';

interface SentimentResult {
  prompt: string;
  response: string;
  reference: string;
  responseSentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  referenceSentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export const SentimentAnalysis: React.FC = () => {
  const [results, setResults] = useState<SentimentResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentProgress, setCurrentProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });

  const analyzeSentiment = async (text: string) => {
    try {
      const response = await fetch('http://localhost:5000/analyze-sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze sentiment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw error;
    }
  };

  const runAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      // Fetch the sentiment samples CSV file
      const response = await fetch('/src/data/sentiment_samples.csv');
      const text = await response.text();
      const rows = text.split('\n').slice(1); // Skip header row
      const analysisResults: SentimentResult[] = [];
      
      setCurrentProgress({ current: 0, total: rows.length });

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row.trim()) continue;
        
        const [prompt, reference] = row.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
        
        // Get AIP tool response
        const response = await client(uepStudentLogic).executeFunction({
          prompt,
          student2: 2,
          teacher: 1,
          school: 2
        });

        // Analyze sentiment for both reference and response
        const [referenceSentiment, responseSentiment] = await Promise.all([
          analyzeSentiment(reference),
          analyzeSentiment(response)
        ]);

        const result = {
          prompt,
          response,
          reference,
          responseSentiment,
          referenceSentiment
        };

        analysisResults.push(result);
        setResults([...analysisResults]); // Update results in real-time
        setCurrentProgress({ current: i + 1, total: rows.length });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate average sentiment scores
  const averageSentiment = results.length > 0 ? {
    response: {
      positive: results.reduce((sum, r) => sum + r.responseSentiment.positive, 0) / results.length,
      negative: results.reduce((sum, r) => sum + r.responseSentiment.negative, 0) / results.length,
      neutral: results.reduce((sum, r) => sum + r.responseSentiment.neutral, 0) / results.length
    },
    reference: {
      positive: results.reduce((sum, r) => sum + r.referenceSentiment.positive, 0) / results.length,
      negative: results.reduce((sum, r) => sum + r.referenceSentiment.negative, 0) / results.length,
      neutral: results.reduce((sum, r) => sum + r.referenceSentiment.neutral, 0) / results.length
    }
  } : null;

  return (
    <div className={styles.container}>
      <h1>Sentiment Analysis Evaluation</h1>
      <div className={styles.controlSection}>
        <button 
          onClick={runAnalysis} 
          disabled={isLoading}
          className={styles.analyzeButton}
        >
          {isLoading ? 'Analyzing...' : 'Run Analysis'}
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
            {averageSentiment && (
              <>
                <h3>Response Sentiment</h3>
                <div className={styles.sentimentCards}>
                  <div className={styles.sentimentCard}>
                    <h3>Average Positive</h3>
                    <p>{averageSentiment.response.positive.toFixed(4)}</p>
                  </div>
                  <div className={styles.sentimentCard}>
                    <h3>Average Negative</h3>
                    <p>{averageSentiment.response.negative.toFixed(4)}</p>
                  </div>
                  <div className={styles.sentimentCard}>
                    <h3>Average Neutral</h3>
                    <p>{averageSentiment.response.neutral.toFixed(4)}</p>
                  </div>
                </div>

                <h3>Reference Sentiment</h3>
                <div className={styles.sentimentCards}>
                  <div className={styles.sentimentCard}>
                    <h3>Average Positive</h3>
                    <p>{averageSentiment.reference.positive.toFixed(4)}</p>
                  </div>
                  <div className={styles.sentimentCard}>
                    <h3>Average Negative</h3>
                    <p>{averageSentiment.reference.negative.toFixed(4)}</p>
                  </div>
                  <div className={styles.sentimentCard}>
                    <h3>Average Neutral</h3>
                    <p>{averageSentiment.reference.neutral.toFixed(4)}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <h2>Detailed Results</h2>
          <table className={styles.resultsTable}>
            <thead>
              <tr>
                <th>Prompt</th>
                <th>Response</th>
                <th>Reference</th>
                <th>Response Sentiment</th>
                <th>Reference Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.prompt}</td>
                  <td>{result.response}</td>
                  <td>{result.reference}</td>
                  <td>
                    <div>Positive: {result.responseSentiment.positive.toFixed(4)}</div>
                    <div>Negative: {result.responseSentiment.negative.toFixed(4)}</div>
                    <div>Neutral: {result.responseSentiment.neutral.toFixed(4)}</div>
                  </td>
                  <td>
                    <div>Positive: {result.referenceSentiment.positive.toFixed(4)}</div>
                    <div>Negative: {result.referenceSentiment.negative.toFixed(4)}</div>
                    <div>Neutral: {result.referenceSentiment.neutral.toFixed(4)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}; 