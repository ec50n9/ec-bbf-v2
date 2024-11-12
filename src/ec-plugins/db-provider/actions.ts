import { LuTrash } from "react-icons/lu";
import type { ActionConfig } from "@/types/plugin";
import { Student, StudentGroup } from "@/services/types";
import { useDbProviderStore } from "./store";

export const actions: ActionConfig<Student | StudentGroup>[] = [
    {
        key: "delete",
        label: "删除",
        icon: LuTrash,
        supportedTypes: [Student, StudentGroup],
        action: (data: Student | StudentGroup) => {
            console.log(`Deleting ${data.name}`);
            if (data instanceof Student) {
                useDbProviderStore.getState().delStudent(data.id);
            } else {
                console.log("删除分组");
            }
        },
    },
];
