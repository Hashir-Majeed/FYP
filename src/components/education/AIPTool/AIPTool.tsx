import React, { useState } from 'react';
import styles from './AIPTool.module.css';
import { client } from '../../../auth/client';
import { uepStudentLogic } from '@tutorial-todo-aip-app/sdk';

interface AIPToolProps {
  studentId: string;
  teacherId?: string;
  schoolId?: string;
}

export const AIPTool: React.FC<AIPToolProps> = ({ studentId, teacherId, schoolId }) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call the AI logic function
      const result = await client(uepStudentLogic).executeFunction({
        prompt: input,
        student2: parseInt(studentId),
        teacher: teacherId ? parseInt(teacherId) : 0,
        school: schoolId ? parseInt(schoolId) : 0
      });

      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: result }]);
    } catch (error) {
      console.error('Error calling AI logic:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error while processing your request.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatContainer}>
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`${styles.message} ${styles[message.role]}`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className={`${styles.message} ${styles.assistant}`}>
            Thinking...
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className={styles.input}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
}; 