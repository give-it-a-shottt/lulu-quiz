export interface Question {
  number: number;
  question: string;
  context?: string;
  options: string[];
  answer: number;
  image?: string;
  images?: string[];
  explanation?: string;
}

export interface Exam {
  exam_title: string;
  institution: string;
  total_questions: number;
  theory_questions: number;
  practical_questions: number;
  questions: Question[];
}
