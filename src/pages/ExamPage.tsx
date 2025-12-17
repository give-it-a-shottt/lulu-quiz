import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sampleQuizzes } from "../data/sampleQuizzes";

export default function ExamPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const exam = sampleQuizzes.find((q) => q.id === Number(examId));

  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(exam ? exam.duration * 60 : 0); // seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [examNumber] = useState(() => {
    // Generate random exam number 001-100
    return Math.floor(Math.random() * 100) + 1;
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const [viewMode, setViewMode] = useState<"single" | "double">("single");
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [solutionQuestionIndex, setSolutionQuestionIndex] = useState(0);
  const [showExplanationModal, setShowExplanationModal] = useState(false);

  useEffect(() => {
    if (!exam || !isStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [exam, isStarted]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!exam) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            시험을 찾을 수 없습니다
          </h1>
          <button
            onClick={() => navigate("/")}
            className="bg-secondary hover:bg-yellow-400 text-gray-800 font-bold py-2 px-6 rounded-lg">
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Font size classes
  const getFontSizeClass = () => {
    switch (fontSize) {
      case "small":
        return "text-sm";
      case "large":
        return "text-lg";
      default:
        return "text-base";
    }
  };

  // Format current time
  const formatDate = (date: Date) => {
    const year = date.getFullYear().toString().slice(2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Exam start screen
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-dark text-white py-4 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                01
              </div>
              <div>
                <div className="text-sm">
                  응시번호: {String(examNumber).padStart(4, "0")}
                </div>
              </div>
            </div>
            <h1 className="text-xl font-bold">{exam.title}</h1>
            <div className="text-right text-sm">
              <div>현재 날짜: {formatDate(currentTime)}</div>
              <div>현재 시각: {formatTime(currentTime)}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-slate-200">
            <h2 className="text-3xl font-bold text-center mb-8 text-dark">
              응시하기 버튼을 클릭하면 시험이 시작됩니다.
            </h2>

            <p className="text-center text-slate-600 mb-8">
              실제 자격증 시험에서는 시작시간에
              <br />
              맞추어 자동으로 시험이 시작됩니다.
            </p>

            <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-200">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-3 px-4 font-semibold text-dark text-center bg-slate-100">
                      시험명
                    </td>
                    <td className="py-3 px-4 text-slate-700 text-center">
                      {exam.title}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-3 px-4 font-semibold text-dark text-center bg-slate-100">
                      교시
                    </td>
                    <td className="py-3 px-4 text-slate-700 text-center">
                      1교시
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-3 px-4 font-semibold text-dark text-center bg-slate-100">
                      시작 시간
                    </td>
                    <td className="py-3 px-4 text-slate-700 text-center">
                      09:00
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-dark text-center bg-slate-100">
                      종료 시간
                    </td>
                    <td className="py-3 px-4 text-slate-700 text-center">
                      10:30
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setIsStarted(true)}
                className="bg-primary hover:bg-[#0284C7] text-white font-bold py-4 px-12 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                시험 응시하기
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setShowSubmitConfirm(true);
  };

  const handleConfirmSubmit = () => {
    setShowSubmitConfirm(false);
    setShowEndScreen(true);
  };

  const handleBackToExam = () => {
    setShowEndScreen(false);
  };

  const handleFinalSubmit = () => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    const question = exam.questions[solutionQuestionIndex];
    const userAnswer = answers[solutionQuestionIndex];
    const isCorrect = userAnswer === question.correctAnswer;

    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="bg-dark text-white py-3 px-6 shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center font-bold">
                01
              </div>
              <div className="text-sm">
                <div>응시번호: {String(examNumber).padStart(4, "0")}</div>
                <div>성명: 정성훈</div>
              </div>
            </div>
            <h1 className="text-xl font-bold">{exam.title}</h1>
            <div className="text-right text-sm">
              <div>현재 날짜: {formatDate(currentTime)}</div>
              <div>현재 시각: {formatTime(currentTime)}</div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white border-b border-slate-200 py-3 px-6 shadow-sm">
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <span className="text-slate-600 font-medium">필기</span>
              <span className="ml-2 font-bold text-dark">
                {
                  answers.filter(
                    (a, i) => a === exam.questions[i].correctAnswer
                  ).length
                }
                /{exam.questions.length}
              </span>
            </div>
            <div className="text-center">
              <span className="text-slate-600 font-medium">실기</span>
              <span className="ml-2 font-bold text-dark">0/45</span>
            </div>
            <div className="text-center">
              <span className="text-slate-600 font-medium">합격여부</span>
              <span className="ml-2 font-bold text-red-600">불합격</span>
            </div>
            <div className="text-center">
              <span className="text-slate-600 font-medium">과락</span>
              <span className="ml-2 font-bold text-dark">필기, 실기</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Question Content */}
          <div className="flex-1 px-6 py-4 overflow-y-auto bg-white mx-80">
            <div>
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`text-7xl shrink-0 ${
                    isCorrect ? "text-primary" : "text-red-500"
                  }`}>
                  {isCorrect ? "○" : "✕"}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-dark">
                    {solutionQuestionIndex + 1}. {question.question}
                  </h3>
                  <p className="text-primary text-lg font-semibold">
                    정답 :{" "}
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold ml-2">
                      {question.correctAnswer + 1}
                    </span>
                  </p>
                </div>
              </div>

              {/* Explanation Box */}
              <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-200">
                <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                  {question.explanation}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2 mb-6">
                {question.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      optIndex === question.correctAnswer
                        ? "bg-primary/5 border-primary"
                        : "border-slate-200"
                    }`}>
                    <span className="text-slate-800">
                      <span className="font-bold mr-2">
                        {["①", "②", "③", "④", "⑤"][optIndex]}
                      </span>
                      {option}
                    </span>
                  </div>
                ))}
              </div>

              {/* Video Button */}
              <div>
                <button
                  onClick={() => setShowExplanationModal(true)}
                  className="w-full bg-primary hover:bg-[#0284C7] text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
                  문제 해설보기
                </button>
              </div>
            </div>
          </div>

          {/* Explanation Modal */}
          {showExplanationModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-8 border border-slate-200">
                <h2 className="text-2xl font-bold text-center mb-6 text-dark">
                  문제 해설
                </h2>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-dark mb-3">표준교재 38P</h3>
                  <div className="text-slate-700 leading-relaxed space-y-2 bg-slate-50 p-4 rounded-xl">
                    <p>1.지역사회 보살핌과 보호를 받아야 한다. 건강 보호 서비스를 이용할 수 있어야 한다.</p>
                    <p>2.사회에 통합, 봉사 기회 얻고 개별, 사회운동 및 단체 조직</p>
                    <p>3.목체적, 정신적 학대로부터 자유로워야 한다. 공정하게 대우받아야한다.</p>
                    <p>5.착취적 계발할 수 있는 기회가 있어야 한다.</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowExplanationModal(false)}
                  className="w-full bg-primary hover:bg-[#0284C7] text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
                  확인
                </button>
              </div>
            </div>
          )}

          {/* Right: Answer Sheet Sidebar */}
          <div className="w-96 bg-dark text-white flex flex-col shadow-xl">
            <div className="p-6 flex-1 overflow-y-auto">
              <h3 className="text-center font-bold text-lg mb-6 pb-3 border-b border-white/20">
                답안 표기란
              </h3>

              <div className="space-y-3">
                {exam.questions.map((q, qIndex) => {
                  const qUserAnswer = answers[qIndex];
                  const qIsCorrect = qUserAnswer === q.correctAnswer;

                  return (
                    <div
                      key={qIndex}
                      onClick={() => setSolutionQuestionIndex(qIndex)}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer hover:bg-white/5 ${
                        solutionQuestionIndex === qIndex ? "bg-white/10" : ""
                      }`}>
                      <div
                        className={`text-2xl ${
                          qIsCorrect ? "text-primary" : "text-red-400"
                        }`}>
                        {qIsCorrect ? "○" : "✕"}
                      </div>
                      <div className="w-10 text-right font-bold">
                        {qIndex + 1}
                      </div>
                      <div className="flex gap-2">
                        {[0, 1, 2, 3, 4].map((optIndex) => (
                          <div
                            key={optIndex}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm transition-all ${
                              qUserAnswer === optIndex
                                ? optIndex === q.correctAnswer
                                  ? "bg-primary border-primary"
                                  : "bg-red-500 border-red-500"
                                : optIndex === q.correctAnswer
                                ? "border-primary/60 text-primary/60"
                                : "border-white/30"
                            }`}>
                            {optIndex + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="p-6 border-t border-white/20">
              <button
                onClick={() => navigate("/")}
                className="w-full bg-primary hover:bg-[#0284C7] text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                다시 풀기
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-slate-200 py-4 shadow-lg">
          <div className="flex items-center justify-center gap-8">
            <button
              onClick={() =>
                setSolutionQuestionIndex((prev) => Math.max(0, prev - 1))
              }
              disabled={solutionQuestionIndex === 0}
              className="px-6 py-2 text-dark hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed font-bold text-lg transition-colors">
              ◀ 이전
            </button>
            <span className="text-xl font-bold text-dark">
              {String(solutionQuestionIndex + 1).padStart(2, "0")}/
              {String(exam.questions.length).padStart(2, "0")}
            </span>
            <button
              onClick={() =>
                setSolutionQuestionIndex((prev) =>
                  Math.min(exam.questions.length - 1, prev + 1)
                )
              }
              disabled={solutionQuestionIndex === exam.questions.length - 1}
              className="px-6 py-2 text-dark hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed font-bold text-lg transition-colors">
              다음 ▶
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show End Screen (after submit confirmation)
  if (showEndScreen) {
    const hasTimeLeft = timeLeft > 0;

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-dark text-white py-4 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                01
              </div>
              <div>
                <div className="text-sm">
                  응시번호: {String(examNumber).padStart(4, "0")}
                </div>
              </div>
            </div>
            <h1 className="text-xl font-bold">{exam.title}</h1>
            <div className="text-right text-sm">
              <div>현재 날짜: {formatDate(currentTime)}</div>
              <div>현재 시각: {formatTime(currentTime)}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-slate-200">
            <h2 className="text-3xl font-bold text-center mb-8 text-dark">
              교시 종료 대기
            </h2>

            <p className="text-center text-xl font-bold text-dark mb-4">
              수고하셨습니다.
              <br />
              작성하신 답안이 정상적으로 제출되었습니다.
            </p>

            <p className="text-center text-slate-600 mb-2">
              교시 종료 시까지 자리에서 대기해주세요
            </p>

            <p className="text-center text-primary mb-2 font-semibold">
              시험시간 내에서는 언제든지 문제풀이 화면으로 되돌아가실 수
              있습니다.
            </p>

            <p className="text-center text-red-600 font-bold mb-8">
              시험 종료 버튼을 누르시면 접수와 해답을 확인하실 수 있습니다.
            </p>

            <div className="flex justify-center gap-4">
              {hasTimeLeft && (
                <button
                  onClick={handleBackToExam}
                  className="bg-primary hover:bg-[#0284C7] text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 shadow-md hover:shadow-lg">
                  시험 보러 가기
                </button>
              )}
              <button
                onClick={handleFinalSubmit}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 shadow-md hover:shadow-lg">
                시험종료 해답보기
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-slate-200">
            <h2 className="text-2xl font-bold text-center mb-6 text-dark">
              알림
            </h2>
            <p className="text-center text-slate-700 mb-2">
              안 푼 문제가{" "}
              <span className="font-bold text-primary">
                {exam.questions.length -
                  answers.filter((a) => a !== undefined).length}
              </span>
              개 남아 있습니다.
            </p>
            <p className="text-center text-slate-700 mb-8">
              그래도 답안을 제출하시겠습니까?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-dark font-bold py-3 px-6 rounded-xl transition-all">
                취소
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="flex-1 bg-primary hover:bg-[#0284C7] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg">
                답안 제출
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-dark text-white py-3 px-6 shadow-lg">
        <div className="flex justify-between items-center">
          {/* Left: Exam Number */}
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center font-bold">
              01
            </div>
            <div className="text-sm">
              <div>응시번호: {String(examNumber).padStart(4, "0")}</div>
            </div>
          </div>

          {/* Center: Title */}
          <h1 className="text-xl font-bold">{exam.title}</h1>

          {/* Right: Controls and Time */}
          <div className="flex items-center gap-6">
            {/* Font Size Controls */}
            <div className="flex gap-2 text-sm">
              <button
                onClick={() => setFontSize("large")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  fontSize === "large" ? "bg-primary" : "bg-white/10 hover:bg-white/20"
                }`}>
                크게
                <br />
                125%
              </button>
              <button
                onClick={() => setFontSize("medium")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  fontSize === "medium" ? "bg-primary" : "bg-white/10 hover:bg-white/20"
                }`}>
                크기
                <br />
                100%
              </button>
              <button
                onClick={() => setFontSize("small")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  fontSize === "small" ? "bg-primary" : "bg-white/10 hover:bg-white/20"
                }`}>
                작게
                <br />
                80%
              </button>
            </div>

            {/* Layout Controls */}
            <div className="flex gap-2 text-sm">
              <button
                onClick={() => setViewMode("single")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  viewMode === "single" ? "bg-primary" : "bg-white/10 hover:bg-white/20"
                }`}>
                1문 보기
              </button>
              <button
                onClick={() => setViewMode("double")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  viewMode === "double" ? "bg-primary" : "bg-white/10 hover:bg-white/20"
                }`}>
                2칸 보기
              </button>
            </div>

            {/* Time */}
            <div className="text-right text-sm">
              <div>현재 시각: {formatTime(currentTime)}</div>
              <div className="text-red-400 font-bold">
                남은 시간: {String(minutes).padStart(2, "0")}분{" "}
                {String(seconds).padStart(2, "0")}초
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Question Area */}
        <div className={`flex-1 p-8 overflow-auto bg-white ${getFontSizeClass()}`}>
          {viewMode === "single" ? (
            // Single Question View
            <div className="max-w-4xl mx-auto">
              {/* Instruction */}
              <p className="text-green-600 font-medium mb-6">
                가장 적합한 답 하나만 고르시오
              </p>

              {/* Question */}
              <h2 className="text-xl font-bold mb-6 text-gray-800">
                {currentQuestionIndex + 1}. {currentQuestion.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className="w-full text-left flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        answers[currentQuestionIndex] === index
                          ? "border-gray-800"
                          : "border-gray-400"
                      }`}>
                      {answers[currentQuestionIndex] === index && (
                        <div className="w-4 h-4 rounded-full bg-gray-800"></div>
                      )}
                    </div>
                    <span className="text-gray-700">
                      <span className="font-medium mr-2">
                        {["①", "②", "③", "④", "⑤"][index]}
                      </span>
                      {option}
                    </span>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  onClick={() =>
                    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed">
                  &lt; 이전
                </button>
                <span className="text-lg font-bold text-gray-800">
                  {String(currentQuestionIndex + 1).padStart(2, "0")}/
                  {String(exam.questions.length).padStart(2, "0")}
                </span>
                <button
                  onClick={() =>
                    setCurrentQuestionIndex((prev) =>
                      Math.min(exam.questions.length - 1, prev + 1)
                    )
                  }
                  disabled={currentQuestionIndex === exam.questions.length - 1}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed">
                  다음 &gt;
                </button>
              </div>
            </div>
          ) : (
            // Double Question View
            <div className="max-w-7xl mx-auto">
              <p className="text-green-600 font-medium mb-6">
                가장 적합한 답 하나만 고르시오
              </p>

              <div className="grid grid-cols-2 gap-8">
                {/* First Question */}
                {exam.questions[currentQuestionIndex] && (
                  <div className="border-r pr-8">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">
                      {currentQuestionIndex + 1}.{" "}
                      {exam.questions[currentQuestionIndex].question}
                    </h2>
                    <div className="space-y-3">
                      {exam.questions[currentQuestionIndex].options.map(
                        (option, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              const newAnswers = [...answers];
                              newAnswers[currentQuestionIndex] = index;
                              setAnswers(newAnswers);
                            }}
                            className="w-full text-left flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                answers[currentQuestionIndex] === index
                                  ? "border-gray-800"
                                  : "border-gray-400"
                              }`}>
                              {answers[currentQuestionIndex] === index && (
                                <div className="w-4 h-4 rounded-full bg-gray-800"></div>
                              )}
                            </div>
                            <span className="text-gray-700">
                              <span className="font-medium mr-2">
                                {["①", "②", "③", "④", "⑤"][index]}
                              </span>
                              {option}
                            </span>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Second Question */}
                {exam.questions[currentQuestionIndex + 1] && (
                  <div className="pl-8">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">
                      {currentQuestionIndex + 2}.{" "}
                      {exam.questions[currentQuestionIndex + 1].question}
                    </h2>
                    <div className="space-y-3">
                      {exam.questions[currentQuestionIndex + 1].options.map(
                        (option, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              const newAnswers = [...answers];
                              newAnswers[currentQuestionIndex + 1] = index;
                              setAnswers(newAnswers);
                            }}
                            className="w-full text-left flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                answers[currentQuestionIndex + 1] === index
                                  ? "border-gray-800"
                                  : "border-gray-400"
                              }`}>
                              {answers[currentQuestionIndex + 1] === index && (
                                <div className="w-4 h-4 rounded-full bg-gray-800"></div>
                              )}
                            </div>
                            <span className="text-gray-700">
                              <span className="font-medium mr-2">
                                {["①", "②", "③", "④", "⑤"][index]}
                              </span>
                              {option}
                            </span>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  onClick={() =>
                    setCurrentQuestionIndex((prev) => Math.max(0, prev - 2))
                  }
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed">
                  &lt; 이전
                </button>
                <span className="text-lg font-bold text-gray-800">
                  {String(currentQuestionIndex + 1).padStart(2, "0")}-
                  {String(
                    Math.min(currentQuestionIndex + 2, exam.questions.length)
                  ).padStart(2, "0")}
                  /{String(exam.questions.length).padStart(2, "0")}
                </span>
                <button
                  onClick={() =>
                    setCurrentQuestionIndex((prev) =>
                      Math.min(exam.questions.length - 1, prev + 2)
                    )
                  }
                  disabled={currentQuestionIndex >= exam.questions.length - 1}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed">
                  다음 &gt;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Answer Sheet Sidebar */}
        <div className="w-96 bg-dark text-white p-6 overflow-auto shadow-xl">
          <h3 className="text-center font-bold text-lg mb-6 pb-3 border-b border-white/20">
            답안 표기란
          </h3>

          <div className="space-y-3">
            {exam.questions.map((_, qIndex) => (
              <div
                key={qIndex}
                onClick={() => setCurrentQuestionIndex(qIndex)}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer hover:bg-white/5 ${
                  currentQuestionIndex === qIndex ? "bg-white/10" : ""
                }`}>
                <div className="w-12 text-right font-bold">
                  {String(qIndex + 1).padStart(2, "0")}
                </div>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4].map((optIndex) => (
                    <div
                      key={optIndex}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm transition-all ${
                        answers[qIndex] === optIndex
                          ? "bg-primary border-primary"
                          : "border-white/30 hover:border-white/50"
                      }`}>
                      {optIndex + 1}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full mt-8 bg-primary hover:bg-[#0284C7] text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
            💾 답안 제출
          </button>
        </div>
      </div>
    </div>
  );
}
