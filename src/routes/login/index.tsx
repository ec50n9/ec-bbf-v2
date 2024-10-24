import { useState, useRef, useEffect } from "react";
import { LuSchool2, LuBookPlus, LuBadgeCheck } from "react-icons/lu";
import Header from "@/components/share/header";
import Step from "./components/step";
import ClassForm from "./steps/class-form";
import SubjectForm from "./steps/subject-form";
import EverythingReady from "./steps/everything-ready";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

const steps = [
  {
    name: "创建班级",
    icon: LuSchool2,
    content: ClassForm,
    title: "您好，初次见面！",
    description: "请允许我更好地了解您，让我们从下方的问题开始吧",
  },
  {
    name: "添加课程",
    icon: LuBookPlus,
    content: SubjectForm,
    title: "放轻松，马上就绪",
    description: "在此之前，让我再了解您多一点",
  },
  {
    name: "准备就绪",
    icon: LuBadgeCheck,
    content: EverythingReady,
    title: "一切就绪！",
    description: "“启元“已经准备好开始新的教学方式了，您呢？",
  },
] as const;

export default function LoginView() {
  const [current, setCurrent] = useState(0);

  const swiperRef = useRef<SwiperType>();
  useEffect(() => {
    swiperRef.current?.slideTo(current);
  }, [current]);

  return (
    <div className="">
      <Header
        className="max-w-xl mx-auto"
        title={steps[current].title}
        description={steps[current].description}
      />
      <Step className="max-w-xl mx-auto mt-9" steps={steps} current={current} />
      <Swiper
        autoHeight
        allowTouchMove={false}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {steps.map((step) => (
          <SwiperSlide
            key={step.name}
            className="relative w-full overflow-x-hidden"
          >
            <step.content onSuccess={() => setCurrent(current + 1)} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
