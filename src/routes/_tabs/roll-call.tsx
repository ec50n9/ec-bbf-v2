import Header from "@/components/share/header";
import StudentList from "@/components/share/student-list";
import EcDataList from "@/components/share/ec-data-list";

export default function RollCall() {
  return (
    <div className="h-full grid grid-rows-[auto_1fr]">
      <Header title="点名" />
      {/* <StudentList /> */}
      <EcDataList />
    </div>
  );
}
