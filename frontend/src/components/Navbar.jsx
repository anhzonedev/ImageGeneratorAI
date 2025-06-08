import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AntDesignOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Space, Dropdown, message } from "antd";
import { createStyles } from "antd-style";
import { UserOutlined } from "@ant-design/icons";
import { FiLogOut } from "react-icons/fi";
import { MdStars } from "react-icons/md";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { user, setShowLogin, logout, credit } = useContext(AppContext);
  const { styles } = useStyle();
  const navigate = useNavigate();
  const menuProps = {
    items: [
      {
        key: "logout",
        label: "Đăng xuất",
        onClick: () => logout(),
        icon: <FiLogOut />,
      },
    ],
  };
  return (
    <div className="flex items-center justify-between py-4">
      <Link to="/">
        <img src={assets.logo} alt="" className="w-4xl sm:w-32 lg:w-40" />
      </Link>

      {user ? (
        <div className="flex items-center gap-2 sm:gap-5">
          <ConfigProvider
            button={{
              className: styles.linearGradientButton,
            }}
          >
            <Space>
              <Button
                className="w-[200px] !flex !items-center !justify-center !rounded-full"
                type="primary"
                size="large"
              >
                <MdStars className="text-white text-base z-50" />
                Tín dụng còn lại : {credit}
              </Button>
            </Space>
          </ConfigProvider>
          <Dropdown.Button
            menu={menuProps}
            placement="bottom"
            icon={<UserOutlined />}
          >
            <p className="max-sm:hidden">Hi, {user.name}</p>
          </Dropdown.Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-5">
          <p
            onClick={() => navigate("/buy")}
            className="cursor-pointer text-base"
          >
            Pricing
          </p>
          <ConfigProvider
            button={{
              className: styles.linearGradientButton,
            }}
          >
            <Space>
              <Button
                type="primary"
                size="large"
                onClick={() => setShowLogin(true)}
                icon={<AntDesignOutlined />}
              >
                Đăng Nhập
              </Button>
            </Space>
          </ConfigProvider>
        </div>
      )}
    </div>
  );
};

export default Navbar;

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(
        .${prefixCls}-btn-dangerous
      ) {
      > span {
        position: relative;
      }

      &::before {
        content: "";
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));
