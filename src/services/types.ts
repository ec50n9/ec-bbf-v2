import type { BaseDataType } from "@/types/plugin";

export class Student implements BaseDataType {
  constructor(
    public id: number,
    public name: string,
    public stuNo: string,
    public clazzId: number,
    public subjectId: number,
  ) {}

  static fromJSON(data: {
    id: number;
    name: string;
    stu_no: string;
    class_id: number;
    subject_id: number;
  }) {
    return new Student(
      data.id,
      data.name,
      data.stu_no,
      data.class_id,
      data.subject_id,
    );
  }
}

export class StudentGroup implements BaseDataType {
  constructor(
    public id: number,
    public name: string,
    public subjectId: number,
    public studentIds: number[],
  ) {}

  static fromJSON(data: {
    id: number;
    name: string;
    subject_id: number;
    student_ids: number[];
  }) {
    return new StudentGroup(
      data.id,
      data.name,
      data.subject_id,
      data.student_ids,
    );
  }
}

export type MixedData = Student | StudentGroup;
