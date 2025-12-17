import { Link } from "react-router-dom";
import { sampleQuizzes } from "../data/sampleQuizzes";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-dark shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🐰</div>
            <h1 className="text-2xl font-bold text-white">
              롤루 요양보호사교육원
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-dark mb-2">CBT 모의고사</h2>
          <p className="text-slate-600">원하는 회차를 선택하여 학습을 시작하세요</p>
        </div>

        <div className="space-y-4">
          {sampleQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-dark mb-1">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {quiz.questions.length}문항 · {quiz.duration}분
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/exam/${quiz.id}`}
                    className="bg-primary hover:bg-[#0284C7] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
                    시험 응시
                  </Link>

                  <Link
                    to={`/solution/${quiz.id}`}
                    className="bg-white hover:bg-slate-50 text-primary border-2 border-primary font-semibold py-3 px-6 rounded-xl transition-all duration-200">
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
