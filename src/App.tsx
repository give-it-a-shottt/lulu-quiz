import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ExamPage from './pages/ExamPage';
import SolutionPage from './pages/SolutionPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exam/:examId" element={<ExamPage />} />
        <Route path="/solution/:examId" element={<SolutionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
