import { quiz1 } from './quizzes-1';
import { quiz2 } from './quizzes-2';
import { quiz3 } from './quizzes-3';

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
  },
  {
    id: 3,
    ...quiz3,
    duration: 90, // 시험 시간 (분)
  }
];
