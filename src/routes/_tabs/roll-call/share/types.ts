import type { BaseDataType } from "@/components/share/ec-data-list";

export class Student implements BaseDataType {
  constructor(
    public id: string,
    public name: string,
    public age: number,
    public gender: "Male" | "Female",
    public score: number,
  ) {}
}

export class StudentGroup implements BaseDataType {
  constructor(
    public id: string,
    public name: string,
    public studentIds: number[],
  ) {}
}

export type MixedData = Student | StudentGroup;
