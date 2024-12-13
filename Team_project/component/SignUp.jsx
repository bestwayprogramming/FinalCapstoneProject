import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  Button,
  Alert,
  Typography,
  Row,
  Col,
  Modal,
  Divider,
} from "antd";
import { registerUser } from "../feature/auth/authSlice";

const { Text } = Typography;
const { Option } = Select;

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    accountType: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isVerificationModalVisible, setVerificationModalVisible] =
    useState(false);
  const [otpMethod, setOtpMethod] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, accountType: value });
  };

  const handleSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      return Alert.error("Passwords do not match!");
    }

    try {
      const result = await dispatch(registerUser(values));
      if (result.type === "auth/registerUser/fulfilled") {
        navigate("/verify", { state: { useremail: values.email } });
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const handleOtpMethodChange = (method) => {
    setOtpMethod(method);
    dispatch(
      sendOtp({
        contact: method === "email" ? formData.email : formData.mobile,
        method,
      })
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-xl p-10">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Sign Up
        </h2>
        {error && (
          <Alert message={error} type="error" showIcon className="mb-4" />
        )}
        <Form layout="vertical" onFinish={handleSubmit}>
          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  { required: true, message: "Please enter your first name!" },
                ]}
              >
                <Input type="text" placeholder="Enter your first name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  { required: true, message: "Please enter your last name!" },
                ]}
              >
                <Input type="text" placeholder="Enter your last name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Form.Item
                label="Mobile"
                name="mobile"
                rules={[
                  {
                    required: true,
                    message: "Please enter your mobile number!",
                  },
                ]}
              >
                <Input type="tel" placeholder="Enter your mobile number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Account Type"
                name="accountType"
                rules={[
                  {
                    required: true,
                    message: "Please select your account type!",
                  },
                ]}
              >
                <Select placeholder="Select account type">
                  <Option value="buyer">Buyer</Option>
                  <Option value="seller">Seller</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input type="email" placeholder="Enter your email" />
          </Form.Item>

          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password!" },
                ]}
              >
                <Input.Password placeholder="Enter your password" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[
                  { required: true, message: "Please confirm your password!" },
                ]}
              >
                <Input.Password placeholder="Confirm your password" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="w-full"
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <Text type="secondary">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Login here
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Signup;
