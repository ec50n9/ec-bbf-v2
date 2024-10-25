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
    stuNo: string;
    classId: number;
    subjectId: number;
  }) {
    return new Student(
      data.id,
      data.name,
      data.stuNo,
      data.classId,
      data.subjectId,
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
    subjectId: number;
    studentIds: number[];
  }) {
    return new StudentGroup(
      data.id,
      data.name,
      data.subjectId,
      data.studentIds,
    );
  }
}

export type MixedData = Student | StudentGroup;
