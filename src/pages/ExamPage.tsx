import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizzes } from "../data/quizData";

export default function ExamPage() {
  const { key, examId } = useParams<{ key: string; examId: string }>();
  const navigate = useNavigate();
  const exam = quizzes.find((q) => q.id === Number(examId));

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
  const [showAnswerSheet, setShowAnswerSheet] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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
      <div className="min-h-screen bg-primary flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            시험을 찾을 수 없습니다
          </h1>
          <button
            onClick={() => navigate(`/${key}`)}
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
        <div className="bg-dark text-white py-3 md:py-4 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="bg-primary rounded-full w-8 h-8 md:w-12 md:h-12 flex items-center justify-center font-bold text-sm md:text-xl">
                01
              </div>
              <div className="text-xs md:text-sm">
                응시번호: {String(examNumber).padStart(4, "0")}
              </div>
            </div>
            <h1 className="text-base md:text-xl font-bold">
              {exam.exam_title}
            </h1>
            <div className="text-right text-xs md:text-sm">
              <div>현재 날짜: {formatDate(currentTime)}</div>
              <div>현재 시각: {formatTime(currentTime)}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-6 md:py-12">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-12 border border-slate-200">
            <h2 className="text-xl md:text-3xl font-bold text-center mb-4 md:mb-8 text-dark">
              응시하기 버튼을 클릭하면 시험이 시작됩니다.
            </h2>

            <p className="text-center text-sm md:text-base text-slate-600 mb-6 md:mb-8">
              실제 자격증 시험에서는 시작시간에
              <br />
              맞추어 자동으로 시험이 시작됩니다.
            </p>

            <div className="bg-slate-50 rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-slate-200">
              <table className="w-full text-sm md:text-base">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 md:py-3 px-2 md:px-4 font-semibold text-dark text-center bg-slate-100">
                      시험명
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-slate-700 text-center">
                      {exam.exam_title}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 md:py-3 px-2 md:px-4 font-semibold text-dark text-center bg-slate-100">
                      교시
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-slate-700 text-center">
                      1교시
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 md:py-3 px-2 md:px-4 font-semibold text-dark text-center bg-slate-100">
                      시작 시간
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-slate-700 text-center">
                      09:00
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 md:py-3 px-2 md:px-4 font-semibold text-dark text-center bg-slate-100">
                      종료 시간
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-slate-700 text-center">
                      10:30
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setIsStarted(true)}
                className="bg-primary hover:bg-[#0284C7] text-white font-bold py-3 md:py-4 px-8 md:px-12 rounded-xl text-base md:text-lg transition-all duration-200 shadow-lg hover:shadow-xl">
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
    const isCorrect = userAnswer === question.answer - 1;

    return (
      <div className="h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="bg-dark text-white py-2 md:py-3 px-4 md:px-6 shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="bg-primary rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <div className="text-xs md:text-sm">
                <div>응시번호: {String(examNumber).padStart(4, "0")}</div>
                <div className="hidden md:block">성명: 정성훈</div>
              </div>
            </div>
            <h1 className="text-sm md:text-xl font-bold">{exam.exam_title}</h1>
            <div className="text-right text-xs md:text-sm">
              <div className="hidden md:block">
                현재 날짜: {formatDate(currentTime)}
              </div>
              <div>시각: {formatTime(currentTime)}</div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white border-b border-slate-200 py-2 md:py-3 px-4 md:px-6 shadow-sm">
          <div className="flex justify-center gap-4 md:gap-8 text-xs md:text-base">
            {(() => {
              // Calculate theory score (questions 1-35, indices 0-34)
              const theoryCorrect = answers.filter(
                (a, i) => i <= 34 && a === exam.questions[i].answer - 1
              ).length;
              const theoryTotal = 35;
              const theoryPass = theoryCorrect >= 21; // 60% of 35

              // Calculate practical score (questions 36-80, indices 35-79)
              const practicalCorrect = answers.filter(
                (a, i) => i >= 35 && a === exam.questions[i].answer - 1
              ).length;
              const practicalTotal = 45;
              const practicalPass = practicalCorrect >= 27; // 60% of 45

              // Determine overall pass/fail
              const overallPass = theoryPass && practicalPass;

              // Determine which sections failed
              const failedSections = [];
              if (!theoryPass) failedSections.push("필기");
              if (!practicalPass) failedSections.push("실기");

              return (
                <>
                  <div className="text-center">
                    <span className="text-slate-600 font-medium">필기</span>
                    <span
                      className={`ml-1 md:ml-2 font-bold ${
                        theoryPass ? "text-primary" : "text-red-600"
                      }`}>
                      {theoryCorrect}/{theoryTotal}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-slate-600 font-medium">실기</span>
                    <span
                      className={`ml-1 md:ml-2 font-bold ${
                        practicalPass ? "text-primary" : "text-red-600"
                      }`}>
                      {practicalCorrect}/{practicalTotal}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-slate-600 font-medium">합격여부</span>
                    <span
                      className={`ml-1 md:ml-2 font-bold ${
                        overallPass ? "text-green-600" : "text-red-600"
                      }`}>
                      {overallPass ? "합격" : "불합격"}
                    </span>
                  </div>
                  <div className="text-center hidden md:block">
                    <span className="text-slate-600 font-medium">과락</span>
                    <span className="ml-2 font-bold text-dark">
                      {failedSections.length > 0
                        ? failedSections.join(", ")
                        : "없음"}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Question Content */}
          <div className="flex-1 px-4 md:px-6 lg:px-36 py-4 overflow-y-auto bg-white">
            <div>
              <div className="flex items-start gap-2 md:gap-4 mb-4">
                <div
                  className={`text-4xl md:text-7xl shrink-0 ${
                    isCorrect ? "text-primary" : "text-red-500"
                  }`}>
                  {isCorrect ? "○" : "✕"}
                </div>
                <div className="flex-1">
                  <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3 text-dark">
                    {solutionQuestionIndex + 1}. {question.question}
                  </h3>
                  <p className="text-primary text-sm md:text-lg font-semibold">
                    정답 :{" "}
                    <span className="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/10 text-primary font-bold ml-2">
                      {question.answer}
                    </span>
                  </p>
                </div>
              </div>

              {/* Context (if exists) */}
              {question.context && (
                <div className="bg-blue-50 p-3 md:p-4 rounded-xl mb-4 border border-blue-200">
                  <p className="text-slate-700 text-sm md:text-base whitespace-pre-line leading-relaxed">
                    {question.context}
                  </p>
                </div>
              )}

              {/* Single Image (if exists) */}
              {question.image && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={question.image}
                    alt={`문제 ${solutionQuestionIndex + 1} 이미지`}
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* Multiple Images (if exists) */}
              {question.images && question.images.length > 0 && (
                <div className="mb-4 grid grid-cols-2 md:grid-cols-5 gap-3">
                  {question.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                        idx === question.answer - 1
                          ? "ring-4 ring-primary bg-primary/5"
                          : userAnswer === idx
                          ? "ring-4 ring-red-500 bg-red-50"
                          : ""
                      }`}>
                      <div className="w-full aspect-square">
                        <img
                          src={img}
                          alt={`선택지 ${idx + 1}`}
                          className={`w-full h-full object-contain rounded-lg shadow-md border-2 transition-all ${
                            idx === question.answer - 1
                              ? "border-primary"
                              : userAnswer === idx
                              ? "border-red-500"
                              : "border-slate-200"
                          }`}
                        />
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            idx === question.answer - 1
                              ? "text-primary"
                              : userAnswer === idx
                              ? "text-red-500"
                              : "text-slate-700"
                          }`}>
                          {["①", "②", "③", "④", "⑤"][idx]}
                        </span>
                        {idx === question.answer - 1 && (
                          <span className="text-primary font-bold">✓</span>
                        )}
                        {userAnswer === idx && idx !== question.answer - 1 && (
                          <span className="text-red-500 font-bold">✕</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Explanation Box */}
              {question.explanation && (
                <div className="bg-slate-50 p-3 md:p-4 rounded-xl mb-4 border border-slate-200">
                  <p className="text-slate-700 text-sm md:text-base whitespace-pre-line leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              )}

              {/* Options (only show if no images) */}
              {(!question.images || question.images.length === 0) && (
                <div className="space-y-2 mb-6">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`p-2 md:p-3 rounded-xl border-2 transition-all ${
                        optIndex === question.answer - 1
                          ? "bg-primary/5 border-primary"
                          : "border-slate-200"
                      }`}>
                      <span className="text-slate-800 text-sm md:text-base">
                        <span className="font-bold mr-2">
                          {["①", "②", "③", "④", "⑤"][optIndex]}
                        </span>
                        {option}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Video Button */}
              <div>
                <button
                  onClick={() => setShowExplanationModal(true)}
                  className="w-full bg-primary hover:bg-[#0284C7] text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-sm md:text-base">
                  문제 해설보기
                </button>
              </div>

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-center gap-4 md:gap-8">
                <button
                  onClick={() =>
                    setSolutionQuestionIndex((prev) => Math.max(0, prev - 1))
                  }
                  disabled={solutionQuestionIndex === 0}
                  className="px-4 md:px-6 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm md:text-lg backdrop-blur-md bg-white/50 border border-white/60 rounded-lg shadow-sm hover:shadow-md transition-all">
                  ◀ 이전
                </button>
                <span className="text-base md:text-xl font-bold text-dark">
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
                  className="px-4 md:px-6 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm md:text-lg backdrop-blur-md bg-white/50 border border-white/60 rounded-lg shadow-sm hover:shadow-md transition-all">
                  다음 ▶
                </button>
              </div>
            </div>
          </div>

          {/* Right: Answer Sheet Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:flex lg:flex-col w-96 bg-dark text-white shadow-xl">
            <div className="p-6 pb-3">
              <h3 className="text-center font-bold text-lg pb-3 border-b border-white/20">
                답안 표기란
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4">
              <div className="space-y-3">
                {exam.questions.map((q, qIndex) => {
                  const qUserAnswer = answers[qIndex];
                  const qIsCorrect = qUserAnswer === q.answer - 1;

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
                                ? optIndex === q.answer - 1
                                  ? "bg-primary border-primary"
                                  : "bg-red-500 border-red-500"
                                : optIndex === q.answer - 1
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
            <div className="p-6 pt-0">
              <button
                onClick={() => navigate(`/${key}`)}
                className="w-full bg-primary hover:bg-[#0284C7] text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                다시 풀기
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Answer Sheet Button */}
        <button
          onClick={() => setShowAnswerSheet(true)}
          className="lg:hidden fixed bottom-20 right-4 bg-dark text-white p-4 rounded-full shadow-2xl z-40">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Mobile Answer Sheet Modal */}
        {showAnswerSheet && (
          <div className="lg:hidden fixed inset-0 bg-dark text-white z-50 flex flex-col">
            <div className="p-4 border-b border-white/20 flex justify-between items-center">
              <h3 className="font-bold text-lg">답안 표기란</h3>
              <button
                onClick={() => setShowAnswerSheet(false)}
                className="text-2xl">
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {exam.questions.map((q, qIndex) => {
                  const qUserAnswer = answers[qIndex];
                  const qIsCorrect = qUserAnswer === q.answer - 1;

                  return (
                    <div
                      key={qIndex}
                      onClick={() => {
                        setSolutionQuestionIndex(qIndex);
                        setShowAnswerSheet(false);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                        solutionQuestionIndex === qIndex
                          ? "bg-white/10"
                          : "bg-white/5"
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
                                ? optIndex === q.answer - 1
                                  ? "bg-primary border-primary"
                                  : "bg-red-500 border-red-500"
                                : optIndex === q.answer - 1
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
            <div className="p-4 border-t border-white/20">
              <button
                onClick={() => {
                  setShowAnswerSheet(false);
                  navigate(`/${key}`);
                }}
                className="w-full bg-primary hover:bg-[#0284C7] text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                다시 풀기
              </button>
            </div>
          </div>
        )}

        {/* Explanation Modal */}
        {showExplanationModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 md:p-8 border border-slate-200 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 text-dark">
                문제 해설
              </h2>

              <div className="mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-bold text-dark mb-3">
                  표준교재 38P
                </h3>
                <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-2 bg-slate-50 p-4 rounded-xl">
                  <p>
                    1.지역사회 보살핌과 보호를 받아야 한다. 건강 보호 서비스를
                    이용할 수 있어야 한다.
                  </p>
                  <p>
                    2.사회에 통합, 봉사 기회 얻고 개별, 사회운동 및 단체 조직
                  </p>
                  <p>
                    3.목체적, 정신적 학대로부터 자유로워야 한다. 공정하게
                    대우받아야한다.
                  </p>
                  <p>5.착취적 계발할 수 있는 기회가 있어야 한다.</p>
                </div>
              </div>

              <button
                onClick={() => setShowExplanationModal(false)}
                className="w-full bg-primary hover:bg-[#0284C7] text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-sm md:text-base">
                확인
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }

  // Show End Screen (after submit confirmation)
  if (showEndScreen) {
    const hasTimeLeft = timeLeft > 0;

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-dark text-white py-3 md:py-4 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="bg-primary rounded-full w-8 h-8 md:w-12 md:h-12 flex items-center justify-center font-bold text-sm md:text-xl">
                01
              </div>
              <div className="text-xs md:text-sm">
                응시번호: {String(examNumber).padStart(4, "0")}
              </div>
            </div>
            <h1 className="text-base md:text-xl font-bold">
              {exam.exam_title}
            </h1>
            <div className="text-right text-xs md:text-sm">
              <div>현재 날짜: {formatDate(currentTime)}</div>
              <div>현재 시각: {formatTime(currentTime)}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-6 md:py-12">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-12 border border-slate-200">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-dark">
              교시 종료 대기
            </h2>

            <p className="text-center text-lg md:text-xl font-bold text-dark mb-4">
              수고하셨습니다.
              <br />
              작성하신 답안이 정상적으로 제출되었습니다.
            </p>

            <p className="text-center text-sm md:text-base text-slate-600 mb-2">
              교시 종료 시까지 자리에서 대기해주세요
            </p>

            <p className="text-center text-primary text-sm md:text-base mb-2 font-semibold">
              시험시간 내에서는 언제든지 문제풀이 화면으로 되돌아가실 수
              있습니다.
            </p>

            <p className="text-center text-red-600 font-bold mb-6 md:mb-8 text-sm md:text-base">
              시험 종료 버튼을 누르시면 접수와 해답을 확인하실 수 있습니다.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-4">
              {hasTimeLeft && (
                <button
                  onClick={handleBackToExam}
                  className="bg-primary hover:bg-[#0284C7] text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl text-base md:text-lg transition-all duration-200 shadow-md hover:shadow-lg">
                  시험 보러 가기
                </button>
              )}
              <button
                onClick={handleFinalSubmit}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl text-base md:text-lg transition-all duration-200 shadow-md hover:shadow-lg">
                시험종료 해답보기
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full border border-slate-200">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 text-dark">
              알림
            </h2>
            <p className="text-center text-slate-700 mb-2 text-sm md:text-base">
              안 푼 문제가{" "}
              <span className="font-bold text-primary">
                {exam.questions.length -
                  answers.filter((a) => a !== undefined).length}
              </span>
              개 남아 있습니다.
            </p>
            <p className="text-center text-slate-700 mb-6 md:mb-8 text-sm md:text-base">
              그래도 답안을 제출하시겠습니까?
            </p>
            <div className="flex gap-3 md:gap-4">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-dark font-bold py-2 md:py-3 px-4 md:px-6 rounded-xl transition-all text-sm md:text-base">
                취소
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="flex-1 bg-primary hover:bg-[#0284C7] text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-xl transition-all shadow-md hover:shadow-lg text-sm md:text-base">
                답안 제출
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-dark">설정</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-2xl text-slate-400 hover:text-slate-600">
                ×
              </button>
            </div>

            {/* Font Size Controls */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-600 mb-3">
                글자 크기
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setFontSize("small")}
                  className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${
                    fontSize === "small"
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}>
                  작게
                  <br />
                  80%
                </button>
                <button
                  onClick={() => setFontSize("medium")}
                  className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${
                    fontSize === "medium"
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}>
                  보통
                  <br />
                  100%
                </button>
                <button
                  onClick={() => setFontSize("large")}
                  className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${
                    fontSize === "large"
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}>
                  크게
                  <br />
                  125%
                </button>
              </div>
            </div>

            {/* Layout Controls - Only show on desktop */}
            <div className="hidden md:block mb-6">
              <h3 className="text-sm font-semibold text-slate-600 mb-3">
                화면 보기
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("single")}
                  className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${
                    viewMode === "single"
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}>
                  1문 보기
                </button>
                <button
                  onClick={() => setViewMode("double")}
                  className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${
                    viewMode === "double"
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}>
                  2칸 보기
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full bg-primary hover:bg-[#0284C7] text-white font-bold py-3 rounded-xl transition-all">
              확인
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-dark text-white py-2 md:py-3 px-3 md:px-6 shadow-lg">
        <div className="flex justify-between items-center">
          {/* Left: Exam Number */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-primary rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <div className="text-xs md:text-sm">
              <div>응시번호: {String(examNumber).padStart(4, "0")}</div>
            </div>
          </div>

          {/* Center: Title */}
          <h1 className="text-xs md:text-xl font-bold truncate max-w-[120px] md:max-w-none">
            {exam.exam_title}
          </h1>

          {/* Right: Controls and Time */}
          <div className="flex items-center gap-2 md:gap-6">
            {/* Settings Button (Mobile) */}
            <button
              onClick={() => setShowSettings(true)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-all">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            {/* Font Size Controls (Desktop) */}
            <div className="hidden md:flex gap-2 text-sm">
              <button
                onClick={() => setFontSize("large")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  fontSize === "large"
                    ? "bg-primary"
                    : "bg-white/10 hover:bg-white/20"
                }`}>
                크게
                <br />
                125%
              </button>
              <button
                onClick={() => setFontSize("medium")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  fontSize === "medium"
                    ? "bg-primary"
                    : "bg-white/10 hover:bg-white/20"
                }`}>
                크기
                <br />
                100%
              </button>
              <button
                onClick={() => setFontSize("small")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  fontSize === "small"
                    ? "bg-primary"
                    : "bg-white/10 hover:bg-white/20"
                }`}>
                작게
                <br />
                80%
              </button>
            </div>

            {/* Layout Controls (Desktop) */}
            <div className="hidden md:flex gap-2 text-sm">
              <button
                onClick={() => setViewMode("single")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  viewMode === "single"
                    ? "bg-primary"
                    : "bg-white/10 hover:bg-white/20"
                }`}>
                1문 보기
              </button>
              <button
                onClick={() => setViewMode("double")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  viewMode === "double"
                    ? "bg-primary"
                    : "bg-white/10 hover:bg-white/20"
                }`}>
                2칸 보기
              </button>
            </div>

            {/* Time */}
            <div className="text-right text-xs md:text-sm">
              <div className="hidden md:block">
                현재 시각: {formatTime(currentTime)}
              </div>
              <div className="text-red-400 font-bold">
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Question Area */}
        <div
          className={`flex-1 p-4 md:p-8 overflow-auto bg-white ${getFontSizeClass()}`}>
          {viewMode === "single" || window.innerWidth < 768 ? (
            // Single Question View (Always on mobile)
            <div className="max-w-4xl mx-auto">
              {/* Instruction */}
              <p className="text-green-600 font-medium mb-4 md:mb-6 text-sm md:text-base">
                가장 적합한 답 하나만 고르시오
              </p>

              {/* Question */}
              <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-800">
                {currentQuestionIndex + 1}. {currentQuestion.question}
              </h2>

              {/* Context (if exists) */}
              {currentQuestion.context && (
                <div className="bg-slate-50 p-3 md:p-4 rounded-xl mb-4 border border-slate-200">
                  <p className="text-slate-700 text-sm md:text-base whitespace-pre-line leading-relaxed">
                    {currentQuestion.context}
                  </p>
                </div>
              )}

              {/* Single Image (if exists) */}
              {currentQuestion.image && (
                <div className="mb-4 md:mb-6 flex justify-center">
                  <img
                    src={currentQuestion.image}
                    alt={`문제 ${currentQuestionIndex + 1} 이미지`}
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* Multiple Images (if exists) - for option images */}
              {currentQuestion.images && currentQuestion.images.length > 0 && (
                <div className="mb-4 md:mb-6 grid grid-cols-2 md:grid-cols-5 gap-3">
                  {currentQuestion.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(idx)}
                      className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                        answers[currentQuestionIndex] === idx
                          ? "ring-4 ring-primary bg-primary/5"
                          : "hover:bg-gray-50"
                      }`}>
                      <div className="w-full aspect-square">
                        <img
                          src={img}
                          alt={`선택지 ${idx + 1}`}
                          className={`w-full h-full object-contain rounded-lg shadow-md border-2 transition-all ${
                            answers[currentQuestionIndex] === idx
                              ? "border-primary"
                              : "border-slate-200"
                          }`}
                        />
                      </div>
                      <div
                        className={`mt-2 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold transition-all ${
                          answers[currentQuestionIndex] === idx
                            ? "border-gray-800 bg-gray-800 text-white"
                            : "border-gray-400 text-gray-700"
                        }`}>
                        {["①", "②", "③", "④", "⑤"][idx]}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Options (only show if no images) */}
              {(!currentQuestion.images ||
                currentQuestion.images.length === 0) && (
                <div className="space-y-2 md:space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className="w-full text-left flex items-center gap-3 p-3 md:p-4 hover:bg-gray-50 transition-colors rounded-lg active:bg-gray-100">
                      <div
                        className={`w-6 h-6 md:w-7 md:h-7 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          answers[currentQuestionIndex] === index
                            ? "border-gray-800"
                            : "border-gray-400"
                        }`}>
                        {answers[currentQuestionIndex] === index && (
                          <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gray-800"></div>
                        )}
                      </div>
                      <span className="text-gray-700 text-sm md:text-base">
                        <span className="font-medium mr-2">
                          {["①", "②", "③", "④", "⑤"][index]}
                        </span>
                        {option}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-center gap-4 md:gap-8">
                <button
                  onClick={() =>
                    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentQuestionIndex === 0}
                  className="px-4 md:px-6 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm md:text-lg backdrop-blur-md bg-white/50 border border-white/60 rounded-lg shadow-sm hover:shadow-md transition-all">
                  ◀ 이전
                </button>
                <span className="text-base md:text-xl font-bold text-dark">
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
                  className="px-4 md:px-6 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm md:text-lg backdrop-blur-md bg-white/50 border border-white/60 rounded-lg shadow-sm hover:shadow-md transition-all">
                  다음 ▶
                </button>
              </div>
            </div>
          ) : (
            // Double Question View (Desktop only)
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
              <div className="mt-8 flex items-center justify-center gap-4 md:gap-8">
                <button
                  onClick={() =>
                    setCurrentQuestionIndex((prev) => Math.max(0, prev - 2))
                  }
                  disabled={currentQuestionIndex === 0}
                  className="px-4 md:px-6 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm md:text-lg backdrop-blur-md bg-white/50 border border-white/60 rounded-lg shadow-sm hover:shadow-md transition-all">
                  ◀ 이전
                </button>
                <span className="text-base md:text-xl font-bold text-dark">
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
                  className="px-4 md:px-6 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm md:text-lg backdrop-blur-md bg-white/50 border border-white/60 rounded-lg shadow-sm hover:shadow-md transition-all">
                  다음 ▶
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Answer Sheet Sidebar (Desktop only) */}
        <div className="hidden lg:flex lg:flex-col w-96 bg-dark text-white shadow-xl">
          <div className="p-6 pb-3">
            <h3 className="text-center font-bold text-lg pb-3 border-b border-white/20">
              답안 표기란
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6">
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
          </div>

          {/* Submit Button */}
          <div className="p-6 pt-0">
            <button
              onClick={handleSubmit}
              className="w-full mt-8 bg-primary hover:bg-[#0284C7] text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
              답안 제출
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden bg-white border-t border-slate-200 py-3 px-4 shadow-lg flex items-center justify-between">
        <button
          onClick={() => setShowAnswerSheet(true)}
          className="bg-dark text-white px-4 py-2 rounded-lg font-semibold text-sm">
          답안 표기란
        </button>
        <span className="text-sm font-bold text-gray-800">
          {String(currentQuestionIndex + 1).padStart(2, "0")}/
          {String(exam.questions.length).padStart(2, "0")}
        </span>
        <button
          onClick={handleSubmit}
          className="bg-primary text-white px-4 py-2 rounded-lg font-semibold text-sm">
          답안 제출
        </button>
      </div>

      {/* Mobile Answer Sheet Modal */}
      {showAnswerSheet && (
        <div className="lg:hidden fixed inset-0 bg-dark text-white z-50 flex flex-col">
          <div className="p-4 border-b border-white/20 flex justify-between items-center">
            <h3 className="font-bold text-lg">답안 표기란</h3>
            <button
              onClick={() => setShowAnswerSheet(false)}
              className="text-3xl leading-none">
              ×
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {exam.questions.map((_, qIndex) => (
                <div
                  key={qIndex}
                  onClick={() => {
                    setCurrentQuestionIndex(qIndex);
                    setShowAnswerSheet(false);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    currentQuestionIndex === qIndex
                      ? "bg-white/10"
                      : "bg-white/5"
                  }`}>
                  <div className="w-12 text-right font-bold">
                    {String(qIndex + 1).padStart(2, "0")}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {[0, 1, 2, 3, 4].map((optIndex) => (
                      <div
                        key={optIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          const newAnswers = [...answers];
                          newAnswers[qIndex] = optIndex;
                          setAnswers(newAnswers);
                        }}
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm transition-all ${
                          answers[qIndex] === optIndex
                            ? "bg-primary border-primary"
                            : "border-white/30 active:border-white/70"
                        }`}>
                        {optIndex + 1}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-white/20">
            <button
              onClick={() => setShowAnswerSheet(false)}
              className="w-full bg-primary hover:bg-[#0284C7] text-white font-bold py-3 rounded-xl transition-all">
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
