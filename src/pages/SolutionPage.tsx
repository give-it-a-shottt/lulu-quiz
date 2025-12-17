import { useParams, useNavigate } from 'react-router-dom';
import { sampleQuizzes } from '../data/sampleQuizzes';

export default function SolutionPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const exam = sampleQuizzes.find((q) => q.id === Number(examId));

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
          <h1 className="text-2xl font-bold text-gray-800">{exam.title} - 해설</h1>
        </div>
      </div>

      {/* Solutions */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {exam.questions.map((question, index) => (
            <div key={question.id} className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {index + 1}. {question.question}
              </h2>

              <div className="space-y-3 mb-6">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`p-4 rounded-lg border-2 ${
                      optionIndex === question.correctAnswer
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">
                        {optionIndex + 1}. {option}
                      </span>
                      {optionIndex === question.correctAnswer && (
                        <span className="text-green-600 font-bold">✓ 정답</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-bold text-blue-800 mb-2">💡 해설</h3>
                <p className="text-blue-900">{question.explanation}</p>
              </div>
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
