import { quiz1 } from './quizzes-1';
import { quiz2 } from './quizzes-2';

export const quizzes = [
  {
    id: 1,
    ...quiz1,
    duration: 90, // 시험 시간 (분)
  },
  {
    id: 2,
    ...quiz2,
    duration: 90, // 시험 시간 (분)
  }
];
