// 班课模型
export interface Course {
  id: number;
  cover: string;
  code: string;
  name: string;
  school: string;
  academy: string;
  teacher: string;
  schoolId: number;
  academyId: number;
  teacherId: number;

  term: string;
  termId: number;
  join: boolean;
  status: boolean;
  lesson: string;
  lessonId: number;
}
