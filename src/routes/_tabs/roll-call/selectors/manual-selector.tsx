import type { MixedData } from "@/services/types";
import { create } from "zustand";

interface Selector {
  allDataList: MixedData[];
  selectedDataList: MixedData[];
  updateSelectedDataList: (val: MixedData[]) => void;
  onSelect: (item: MixedData) => void;
}

export class ManualSelector implements Selector {
  constructor(
    public allDataList: MixedData[],
    public selectedDataList: MixedData[],
    public updateSelectedDataList: (val: MixedData[]) => void,
  ) {}

  onSelect(item: MixedData) {
    console.log("hello");
  }
}
