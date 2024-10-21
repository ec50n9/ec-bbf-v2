import type { BaseDataType } from "@/components/share/ec-data-list";

export class Student implements BaseDataType {
  constructor(
    public id: string,
    public name: string,
    public stuNo: string,
    public classId: number,
    public subjectId: number,
  ) {}
}

export class StudentGroup implements BaseDataType {
  constructor(
    public id: string,
    public name: string,
    public subjectId: number,
    public studentIds: number[],
  ) {}
}

export type MixedData = Student | StudentGroup;
