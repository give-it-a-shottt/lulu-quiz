import { Link } from "react-router-dom";
import { quizzes } from "../data/quizData";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-dark shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="text-3xl md:text-4xl">🐰</div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              롤루 요양보호사교육원
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-2">CBT 모의고사</h2>
          <p className="text-sm md:text-base text-slate-600">원하는 회차를 선택하여 학습을 시작하세요</p>
        </div>

        <div className="space-y-3 md:space-y-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 border border-slate-200">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-dark mb-1">
                    {quiz.exam_title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500">
                    {quiz.total_questions}문항 (필기 {quiz.theory_questions}문항 + 실기 {quiz.practical_questions}문항) · {quiz.duration}분
                  </p>
                </div>

                <div className="flex gap-2 md:gap-3 w-full md:w-auto">
                  <Link
                    to={`/exam/${quiz.id}`}
                    className="flex-1 md:flex-initial bg-primary hover:bg-[#0284C7] text-white font-semibold py-2.5 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-center text-sm md:text-base">
                    시험 응시
                  </Link>

                  <Link
                    to={`/solution/${quiz.id}`}
                    className="flex-1 md:flex-initial bg-white hover:bg-slate-50 text-primary border-2 border-primary font-semibold py-2.5 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl transition-all duration-200 text-center text-sm md:text-base">
                    해설 보기
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
