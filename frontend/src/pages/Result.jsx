import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { Image } from "antd";
import { Flex, Spin } from "antd";

const Result = () => {
  const [image, setImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const { generateImage } = useContext(AppContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (input) {
      const image = await generateImage(input);
      if (image) {
        setImageLoaded(true);
        setImage(image);
      }
    }
    setLoading(false);
  };
  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative w-full max-w-xl mx-auto">
        <div className="flex items-center justify-center">
          <img
            className="max-w-full rounded h-[500px] w-2xl relative border-2 border-dashed border-gray-500 p-4"
            src={image}
          />
          {!image && (
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm text-gray-400">
              Hãy nhập nội dung bạn muốn tạo ảnh
            </span>
          )}
        </div>
        <div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-r-full">
          <p
            onClick={() => setImageLoaded(false)}
            className="hover:scale-105 transition-all duration-300 bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer"
          >
            Tạo ảnh khác
          </p>
          <a
            href={image}
            download
            className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer hover:scale-105 transition-all duration-300"
          >
            Tải xuống
          </a>
        </div>
      </div>
    </form>
  );
};

export default Result;
