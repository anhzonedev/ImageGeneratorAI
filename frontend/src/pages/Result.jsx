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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center w-full min-h-[90vh]"
    >
      <div>
        <div className="relative">
          <Image
            className="!max-w-full !rounded !h-[500px] !w-2xl !relative !border-2 !border-dashed !border-gray-500 !p-4"
            src={image}
          />
          {!image && (
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm text-gray-400">
              Hãy nhập nội dung của bạn muốn tạo ảnh
            </span>
          )}
        </div>
        <Flex align="center" gap="middle">
          {loading && (
            <Spin
              size="large"
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2${
                loading ? "w-full transition-all duration-[10s]" : "w-0"
              }`}
            />
          )}
        </Flex>
      </div>
      {!imageLoaded && (
        <div className="flex  w-full max-w-xl bg-neutral-500 text-white text-sm rounded-full mt-10 p-0.5">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Mô tả những gì bạn muốn tạo ra"
            className="flex-1 bg-transparent outline-none ml-8 max-sm:w-20"
          />
          <button
            type="submit"
            className="bg-zinc-900 px-10 sm:px-16 py-3 rounded-full text-white cursor-pointer hover:scale-105 transition-all duration-300"
          >
            Tạo Ảnh
          </button>
        </div>
      )}
      {imageLoaded && (
        <div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-r-full">
          <p
            onClick={() => setImageLoaded(false)}
            className="hover:scale-105 transition-all duration-300 bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer"
          >
            Tạo một cái khác
          </p>
          <a
            href={image}
            download
            className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer hover:scale-105 transition-all duration-300"
          >
            Tải xuống
          </a>
        </div>
      )}
    </form>
  );
};

export default Result;
