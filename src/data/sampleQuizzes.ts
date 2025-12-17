import type { Exam } from '../types/quiz';

export const sampleQuizzes: Exam[] = [
  {
    id: 1,
    title: '24년형 CBT 모의고사 1회차',
    year: '2024',
    session: 1,
    duration: 90,
    questions: [
      {
        id: 1,
        question: '다음 중 JavaScript의 데이터 타입이 아닌 것은?',
        options: ['String', 'Number', 'Boolean', 'Character'],
        correctAnswer: 3,
        explanation: 'JavaScript에는 Character 타입이 없습니다. 문자는 String 타입으로 처리됩니다.',
      },
      {
        id: 2,
        question: 'React에서 상태 관리를 위해 사용하는 Hook은?',
        options: ['useEffect', 'useState', 'useContext', 'useRef'],
        correctAnswer: 1,
        explanation: 'useState는 React에서 컴포넌트의 상태를 관리하기 위한 Hook입니다.',
      },
      {
        id: 3,
        question: 'HTTP 상태 코드 중 성공을 나타내는 것은?',
        options: ['404', '500', '200', '301'],
        correctAnswer: 2,
        explanation: '200 OK는 요청이 성공적으로 처리되었음을 나타냅니다.',
      },
    ],
  },
  {
    id: 2,
    title: '24년형 CBT 모의고사 2회차',
    year: '2024',
    session: 2,
    duration: 90,
    questions: [
      {
        id: 1,
        question: 'CSS에서 요소를 가운데 정렬하는 방법이 아닌 것은?',
        options: ['margin: 0 auto;', 'text-align: center;', 'align: middle;', 'display: flex; justify-content: center;'],
        correctAnswer: 2,
        explanation: 'align: middle은 유효한 CSS 속성이 아닙니다.',
      },
      {
        id: 2,
        question: 'Git에서 변경사항을 저장소에 반영하는 명령어는?',
        options: ['git push', 'git commit', 'git add', 'git pull'],
        correctAnswer: 1,
        explanation: 'git commit은 변경사항을 로컬 저장소에 기록하는 명령어입니다.',
      },
    ],
  },
  {
    id: 3,
    title: '24년형 CBT 모의고사 3회차',
    year: '2024',
    session: 3,
    duration: 90,
    questions: [
      {
        id: 1,
        question: 'TypeScript의 장점이 아닌 것은?',
        options: ['정적 타입 체크', '코드 자동완성', '런타임 성능 향상', '에러 사전 발견'],
        correctAnswer: 2,
        explanation: 'TypeScript는 컴파일 시점의 타입 체크를 제공하지만, 런타임 성능을 직접적으로 향상시키지는 않습니다.',
      },
    ],
  },
  {
    id: 4,
    title: '24년형 CBT 모의고사 4회차',
    year: '2024',
    session: 4,
    duration: 90,
    questions: [
      {
        id: 1,
        question: 'REST API의 HTTP 메서드 중 리소스 생성에 사용되는 것은?',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        correctAnswer: 1,
        explanation: 'POST는 새로운 리소스를 생성할 때 사용하는 HTTP 메서드입니다.',
      },
    ],
  },
  {
    id: 5,
    title: '24년형 CBT 모의고사 5회차',
    year: '2024',
    session: 5,
    duration: 90,
    questions: [
      {
        id: 1,
        question: 'npm에서 패키지를 전역으로 설치하는 명령어는?',
        options: ['npm install -g', 'npm install --global', 'npm i -g', '위 모두 정답'],
        correctAnswer: 3,
        explanation: 'npm install -g, npm install --global, npm i -g 모두 전역 설치 명령어입니다.',
      },
    ],
  },
];
