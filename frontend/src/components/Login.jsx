import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex } from "antd";
import { MdOutlineEmail } from "react-icons/md";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Login");
  const { setShowLogin, backendUrl, setToken, setUser } =
    useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onFinish = async (values) => {
    try {
      if (state === "Login") {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email: values.email,
          password: values.password,
        });
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          localStorage.setItem("email", email);
          setShowLogin(false);
          toast.success("Đăng nhập thành công");
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const password = values.password;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);

        if (password.length < 6) {
          toast.error("Mật khẩu phải lớn hơn 6 ký tự");
          return;
        }
        if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
          let errorMessage = "Mật khẩu phải có ít nhất ";
          if (!hasUpperCase) errorMessage += "1 chữ in hoa, ";
          if (!hasLowerCase) errorMessage += "1 chữ thường, ";
          if (!hasNumbers) errorMessage += "1 chữ số, ";
          toast.error(errorMessage.slice(0, -2));
          return;
        }

        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name: values.username,
          email: values.email,
          password: values.password,
        });
        if (data.success) {
          toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
          setState("Login");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <Form onFinish={onFinish} className="relative bg-white !p-10 rounded-xl text-slate-500">
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          {state === "Login" ? "Đăng nhập" : "Đăng ký"}
        </h1>
        <p className="text-sm mb-10">
          {state === "Login"
            ? "Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục"
            : "Tạo tài khoản mới"}
        </p>
        {state !== "Login" && (
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              onChange={(e) => setName(e.target.value)}
              value={name}
              prefix={<UserOutlined />}
              placeholder="Username"
            />
          </Form.Item>
        )}

        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            prefix={<MdOutlineEmail />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input.Password
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            prefix={<LockOutlined />}
            placeholder="Password"
            visibilityToggle={{
              visible: passwordVisible,
              onVisibleChange: setPasswordVisible,
            }}
          />
        </Form.Item>
        <Form.Item>
          <Flex justify="space-between" align="center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <a href="">Quên mật khẩu?</a>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            {state === "Login" ? "Đăng nhập" : "Đăng ký"}
          </Button>
          Hoặc{" "}
          {state === "Login" ? (
            <a onClick={() => setState("Signup")}>Đăng ký ngay!</a>
          ) : (
            <a onClick={() => setState("Login")}>Đăng nhập</a>
          )}
        </Form.Item>
        <img
          onClick={() => setShowLogin(false)}
          src={assets.cross_icon}
          alt=""
          className="absolute top-5 right-5 cursor-pointer"
        />
      </Form>
    </div>
  );
};

export default Login;
