import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ExamPage from "./pages/ExamPage";
import SolutionPage from "./pages/SolutionPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 임의 키 경로*/}
        <Route path="/:key" element={<HomePage />} />
        <Route path="/:key/exam/:examId" element={<ExamPage />} />
        <Route path="/:key/solution/:examId" element={<SolutionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
