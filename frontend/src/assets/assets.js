import logo from "./logo.svg";
import logo_icon from "./logo_icon.svg";
import facebook_icon from "./facebook_icon.svg";
import instagram_icon from "./instagram_icon.svg";
import twitter_icon from "./twitter_icon.svg";
import star_icon from "./star_icon.svg";
import rating_star from "./rating_star.svg";
import sample_img_1 from "./sample_img_1.png";
import sample_img_2 from "./sample_img_2.png";
import profile_img_1 from "./profile_img_1.png";
import profile_img_2 from "./profile_img_2.png";
import step_icon_1 from "./step_icon_1.svg";
import step_icon_2 from "./step_icon_2.svg";
import step_icon_3 from "./step_icon_3.svg";
import email_icon from "./email_icon.svg";
import lock_icon from "./lock_icon.svg";
import cross_icon from "./cross_icon.svg";
import star_group from "./star_group.png";
import credit_star from "./credit_star.svg";
import profile_icon from "./profile_icon.png";
import qr_code from "./qrcode.jpg"

export const assets = {
  logo,
  logo_icon,
  facebook_icon,
  instagram_icon,
  twitter_icon,
  star_icon,
  rating_star,
  sample_img_1,
  sample_img_2,
  email_icon,
  lock_icon,
  cross_icon,
  star_group,
  credit_star,
  profile_icon,
  qr_code
};

export const stepsData = [
  {
    title: "Mô tả tầm nhìn của bạn",
    description: "Nhập cụm từ, câu hoặc đoạn mô tả hình ảnh bạn muốn tạo.",
    icon: step_icon_1,
  },
  {
    title: "Xem phép thuật",
    description:
      "Công cụ hỗ trợ AI của chúng tôi sẽ biến văn bản của bạn thành hình ảnh độc đáo, chất lượng cao chỉ trong vài giây.",
    icon: step_icon_2,
  },
  {
    title: "Tải xuống và chia sẻ",
    description:
      "Tải xuống ngay tác phẩm của bạn hoặc chia sẻ nó với mọi người trực tiếp từ nền tảng của chúng tôi.",
    icon: step_icon_3,
  },
];

export const testimonialsData = [
  {
    image: profile_img_1,
    name: "Nhân vật 1",
    role: "Thiết kế đồ họa",
    stars: 5,
    text: `Trang web này thật ấn tượng! AI tạo ra những bức ảnh sắc nét và sáng tạo, rất hữu ích cho những ai cần hình ảnh nhanh chóng mà vẫn đẹp mắt.`,
  },
  {
    image: profile_img_2,
    name: "Nhân vật 2",
    role: "Nhà sáng tạo nội dung",
    stars: 5,
    text: `Tính năng tùy chỉnh khá linh hoạt, nhưng nếu có thêm nhiều phong cách nghệ thuật hơn nữa thì sẽ tuyệt vời hơn!`,
  },
  {
    image: profile_img_1,
    name: "Nhân vật 3",
    role: "Thiết kế trang web",
    stars: 5,
    text: `AI tạo ảnh rất nhanh, tuy nhiên đôi khi một số chi tiết chưa thật sự chính xác. Hy vọng sẽ có bản cập nhật cải thiện điều này!`,
  },
];

export const plans = [
  {
    id: "Cơ bản",
    price: 10000,
    credits: 100,
    desc: "Sử dụng tốt cho cá nhân.",
  },
  {
    id: "Ưu tiên",
    price: 50000,
    credits: 500,
    desc: "Tốt nhất dành cho kinh doanh.",
  },
  { 
    id: "Cao cấp",
    price: 250000,
    credits: 5000,
    desc: "Tốt nhất cho doanh nghiệm sử dụng.",
  },
];
