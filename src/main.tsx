import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SchoolSelection from './pages/education/SchoolSelection/SchoolSelection';
import TeacherDashboard from './pages/education/TeacherDashboard/TeacherDashboard';
import ClassView from './pages/education/ClassView/ClassView';
import StudentView from './pages/education/StudentView/StudentView';
import { AIPTool } from './components/education/AIPTool/AIPTool';
import { ToolEvaluation } from './components/education/ToolEvaluation/ToolEvaluation';
import { SentimentAnalysis } from './components/education/SentimentAnalysis/SentimentAnalysis';
import EvaluationHome from './components/education/EvaluationHome/EvaluationHome';
import { StereotypeDetection } from './components/education/StereotypeDetection/StereotypeDetection';
import Login from './pages/Login';
import AuthCallback from './auth/AuthCallback';
import AuthenticatedRoute from './auth/AuthenticatedRoute';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Protected Routes */}
        <Route element={<AuthenticatedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/school-selection" element={<SchoolSelection />} />
          <Route path="/education/:schoolId" element={<TeacherDashboard />} />
          <Route path="/education/:schoolId/class/:classId" element={<ClassView />} />
          <Route path="/education/:schoolId/student/:studentId" element={<StudentView />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/ai-tool" element={<AIPTool studentId="default" />} />
          <Route path="/tool-evaluation" element={<EvaluationHome />} />
          <Route path="/tool-evaluation/bertscore" element={<ToolEvaluation />} />
          <Route path="/tool-evaluation/sentiment" element={<SentimentAnalysis />} />
          <Route path="/tool-evaluation/stereotypes" element={<StereotypeDetection />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
