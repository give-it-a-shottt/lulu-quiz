import { useParams, useNavigate } from 'react-router-dom';
import { quizzes } from '../data/quizData';

export default function SolutionPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const exam = quizzes.find((q) => q.id === Number(examId));

  if (!exam) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">시험을 찾을 수 없습니다</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-secondary hover:bg-yellow-400 text-gray-800 font-bold py-2 px-6 rounded-lg"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800">{exam.exam_title} - 해설</h1>
        </div>
      </div>

      {/* Solutions */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {exam.questions.map((question, index) => (
            <div key={question.number} className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {index + 1}. {question.question}
              </h2>

              {/* Context (if exists) */}
              {question.context && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {question.context}
                  </p>
                </div>
              )}

              {/* Single Image (if exists) */}
              {question.image && (
                <div className="mb-6 flex justify-center">
                  <img
                    src={question.image}
                    alt={`문제 ${index + 1} 이미지`}
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* Multiple Images (if exists) */}
              {question.images && question.images.length > 0 && (
                <div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-3">
                  {question.images.map((img, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <img
                        src={img}
                        alt={`선택지 ${idx + 1}`}
                        className="w-full h-auto rounded-lg shadow-md border-2 border-slate-200"
                      />
                      <span className="mt-2 font-bold text-slate-700">{["①", "②", "③", "④", "⑤"][idx]}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 mb-6">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`p-4 rounded-lg border-2 ${
                      optionIndex === question.answer - 1
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">
                        {["①", "②", "③", "④", "⑤"][optionIndex]} {option}
                      </span>
                      {optionIndex === question.answer - 1 && (
                        <span className="text-green-600 font-bold">✓ 정답</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {question.explanation && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h3 className="font-bold text-blue-800 mb-2">💡 해설</h3>
                  <p className="text-blue-900 whitespace-pre-line">{question.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate(`/exam/${exam.id}`)}
            className="bg-secondary hover:bg-yellow-400 text-gray-800 font-bold py-3 px-8 rounded-lg transition-colors"
          >
            다시 풀기
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-white hover:bg-gray-50 text-secondary border-2 border-secondary font-medium py-3 px-8 rounded-lg transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </main>
    </div>
  );
}
