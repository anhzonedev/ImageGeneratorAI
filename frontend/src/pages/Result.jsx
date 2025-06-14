import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { Image, Input, Button, Spin } from "antd";

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

  const handleCreateAnother = () => {
    setImage(null);
    setImageLoaded(false);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative min-h-screen">
      <div className="relative w-full max-w-xl mx-auto pt-8">
        <div className="flex items-center justify-center mb-6">
          {loading ? (
            <div className="h-[500px] w-full flex items-center justify-center border-2 border-dashed border-gray-500 rounded">
              <Spin size="large" />
            </div>
          ) : (
            <div className="relative w-full">
              {image ? (
                <img
                  className="max-w-full rounded h-[500px] w-full object-contain border-2 border-dashed border-gray-500 p-4"
                  src={image}
                  alt="Generated"
                />
              ) : (
                <div className="h-[500px] w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded p-4">
                  <span className="text-sm text-gray-400 mb-4">
                    Hãy nhập nội dung bạn muốn tạo ảnh
                  </span>
                  <Input.TextArea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Mô tả chi tiết hình ảnh bạn muốn tạo..."
                    className="w-3/4 mb-4"
                    rows={4}
                  />
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={!input.trim()}
                  >
                    Tạo ảnh
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {image && (
          <div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-6">
            <button
              type="button"
              onClick={handleCreateAnother}
              className="hover:scale-105 transition-all duration-300 bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer"
            >
              Tạo ảnh khác
            </button>
            <a
              href={image}
              download
              className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
            >
              Tải xuống
            </a>
          </div>
        )}
      </div>
    </form>
  );
};

export default Result;
