// 班课模型
export interface Course {
  id: number;
  cover: string;
  code: string;
  name: string;
  school: string;
  academy: string;
  major: string;
  teacher: string;
  schoolId: number;
  academyId: number;
  majorId: number;
  teacherId: number;

  term: string;
  join: string;
  status: string;
  lesson: string;
}
