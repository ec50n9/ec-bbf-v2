import { LuSchool2, LuBookPlus, LuBadgeCheck } from "react-icons/lu";
import Header from "@/components/share/header";
import Step from "@/components/login/step";
import ClassForm from "@/components/login/class-form";

export default function LoginView() {
  return (
    <div className="max-w-xl mx-auto">
      <Header
        className="mx-5"
        title="您好！初次见面"
        description="请允许我更好地了解您，让我们从下方的问题开始吧"
      />
      <Step
        className="mx-5 mt-9"
        steps={[
          { name: "创建班级", icon: LuSchool2 },
          { name: "添加课程", icon: LuBookPlus },
          { name: "启动！！", icon: LuBadgeCheck },
        ]}
        current={0}
      />
      <div className="my-9 mx-auto w-96">
        <ClassForm />
      </div>
    </div>
  );
}
