import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../feature/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Layout,
  Space,
  ConfigProvider,
} from "antd";
import Notify from "../component/Notify"; // Import your Notify component

const { Text, Title } = Typography;
const { Content } = Layout;

const Login = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const navigation = useSelector((state) => state.navigation.filteredItems);

  const onFinish = (values) => {
    dispatch(loginUser(values)).then((response) => {
      if (response.type === "auth/loginUser/fulfilled") {
        const { userType } = response.payload;
        Notify({
          type: "success",
          message: "Login Successful",
          description: "You have successfully logged in!",
        });

        if (userType === "seller") {
          navigate("/home"); // Redirect to seller dashboard
        } else if (userType === "buyer") {
          navigate("/products"); // Redirect to buyer products page
        }
      } else if (response.type === "auth/loginUser/rejected") {
        Notify({
          type: "error",
          message: "Login Failed",
          description: error || "Invalid email or password.",
        });
      }
    });
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Card
          style={{ maxWidth: 500, width: "100%", padding: "24px" }}
          bordered
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <img
              alt="Your Company"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
              style={{ height: 40, width: "auto", margin: "0 auto" }}
            />
            <Title level={3} style={{ margin: 0, textAlign: "center" }}>
              Sign in to your account
            </Title>

            <div style={{ textAlign: "center" }}>
              <Title level={3}>Login</Title>
              <Text type="secondary">Access your account</Text>
            </div>

            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              initialValues={{ email: "", password: "" }}
              layout="vertical"
              style={{ marginTop: "16px" }}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password!" },
                ]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  block
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Form.Item>
            </Form>
            <div style={{ textAlign: "center" }}>
              <Text type="secondary">
                Don't have an account?{" "}
                <Link to="/register" style={{ color: "#1890ff" }}>
                  Register here
                </Link>
              </Text>
            </div>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default Login;
