export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Exam {
  id: number;
  title: string;
  year: string;
  session: number;
  questions: Question[];
  duration: number;
}
