import React, { useEffect } from "react";
import { Dropdown, Avatar, Tooltip } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchuserprofile } from "../feature/auth/authSlice";

const UserMenu = () => {
  const email = localStorage.getItem("user");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userinfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const email = localStorage.getItem("user");
    if (email) {
      dispatch(fetchuserprofile({ email }));
    }
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const items = [
    {
      key: "1",
      label: <Link to={"/profile"}>Your Profile</Link>,
    },
    {
      key: "2",
      label: <Link to={"/chat"}>Chat</Link>,
    },
    {
      key: "3",
      label: (
        <div onClick={handleLogout} style={{ cursor: "pointer" }}>
          Sign Out
        </div>
      ),
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
      }}
      trigger={["click"]}
    >
      <button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
        {!userinfo?.profilePicture ? (
          <Avatar
            alt="User avatar"
            size={48}
            shape="circle"
            icon={<UserOutlined />}
          />
        ) : (
          <Tooltip placement="leftBottom" title={`Email: ${userinfo.email}\n Account: ${userinfo.accountType}`}>
          <Avatar
            alt="User avatar"
            size={48}
            shape="circle"
            src={userinfo?.profilePicture}
          />
          </Tooltip>
        )}
      </button>
    </Dropdown>
  );
};

export default UserMenu;
