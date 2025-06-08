import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react"
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const {user, setShowLogin} = useContext(AppContext)
  const navigate = useNavigate()
  const onCLickhandle = async () => {
    if(user) {
      navigate("/result")
    }else {
      setShowLogin(true)
    }
  }
  return (
    <motion.div className="flex flex-col items-center justify-center text-center my-20"
    initial={{opacity: 0, y: 100}}
    transition={{duration: 1}}
    whileInView={{opacity: 1, y: 0}}
    viewport={{once: true}}
    >
      <div className="text-stone-500 inline-flex text-center gap-2 bg-white px-6 py-3 rounded-full border border-neutral-500 text-base">
        <p>Trình tạo văn bản thành hình ảnh tốt nhất </p>
        <img src={assets.star_icon} alt="" />
      </div>
      <h1 className="text-2xl max-w-[300px] sm:text-4xl sm:max-w-[500px] mx-auto mt-10 text-center">
        Chuyển văn bản thành <span className="text-blue-600">hình ảnh</span> chỉ
        trong vài giây.
      </h1>
      <p className="text-center  mx-auto mt-5 text-2xl">
        Giải phóng khả năng sáng tạo của bạn với AI. Biến trí tưởng tượng của
        bạn thành nghệ thuật thị giác trong vài giây – chỉ cần gõ và xem điều kỳ
        diệu xảy ra.
      </p>
      <motion.button onClick={onCLickhandle} className="cursor-pointer text-white bg-black w-auto mt-8 px-12 py-4 flex items-center gap-2 rounded-full text-xl"
      whileTap={{scale: 0.95}}
      whileHover={{scale: 1.05}}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{default: {duration: 0.5}, opacity:{delay: 0.8, duration: 1}}}
      >
        Tạo ảnh bằng AI
        <img className="h-8" src={assets.star_group} alt="" />
      </motion.button>
      <div className="flex flex-wrap justify-center gap-3 mt-16">
        {Array(6)
          .fill("")
          .map((item, index) => {
            return (
              <img
                className="rounded hover:scale-105 transition-all duration-300 cursor-pointer max-sm:w-10"
                src={
                  index % 2 === 0 ? assets.sample_img_1 : assets.sample_img_2
                }
                alt=""
                key={index}
                width={70}
              />
            );
          })}
      </div>
      <p className="text-base text-neutral-600 mt-4">Hình ảnh được tạo từ tưởng tượng</p>
    </motion.div>
  );
};

export default Header;
