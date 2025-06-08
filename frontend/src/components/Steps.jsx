import React from "react";
import { stepsData } from "../assets/assets";

const Steps = () => {
  return (
    <div className="flex flex-col items-center my-32 justify-center">
      <h1 className="text-3xl sm:text-4xl font-semibold mb-2">
        Nó hoạt động như thế nào
      </h1>
      <p className="text-lg mb-8 text-gray-600">
        Biến đổi từ ngữ thành hình ảnh tuyệt đẹp
      </p>
      <div  className="space-y-4 w-full max-w-3xl text-sm">
        {stepsData.map((step, index) => (
          <div key={index} className="flex items-center gap-4 p-5 px-8 bg-white/20 shadow-md rounded-lg border cursor-pointer hover:scale-[1.02] transition-all duration-300">
            <img src={step.icon} alt="" />
            <div>
                <h2 className="text-xl font-medium">{step.title}</h2>
                <p className="text-gray-500">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Steps;
