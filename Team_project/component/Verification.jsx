import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Statistic,
  Spin,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../feature/auth/authSlice";
import Notify from "../component/Notify"; // Import your custom Notify component

const { Title, Text } = Typography;
const { Countdown } = Statistic;

const Verification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState(null);
  const [canResend, setCanResend] = useState(false);

  const {
    user,
    loading,
    error: backendError,
  } = useSelector((state) => state.auth);

  const location = useLocation();
  const email = location.state?.useremail;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deadline = Date.now() + 60 * 1000;

  const handleInputChange = (value, index) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Automatically move to the next input field
      if (value !== "" && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleVerify = async () => {
    if (otp.join("").length < 6) {
      setError("Please enter the complete OTP.");
      Notify({
        type: "error",
        message: "Incomplete OTP",
        description: "Please enter all 6 digits of the OTP.",
      });
      return;
    }
    setError(null);
    const resultAction = await dispatch(
      verifyOtp({ email, otp: otp.join("") })
    );

    if (verifyOtp.fulfilled.match(resultAction)) {
      Notify({
        type: "success",
        message: "Verification Successful",
        description: "Your email has been successfully verified.",
      });
      // Navigate to the homepage on success
      navigate("/");
    } else if (verifyOtp.rejected.match(resultAction)) {
      Notify({
        type: "error",
        message: "Verification Failed",
        description: resultAction.payload || "Invalid OTP. Please try again.",
      });
    }
  };

  const handleResend = () => {
    setCanResend(false);
    Notify({
      type: "info",
      message: "OTP Resent",
      description: "A new OTP has been sent to your email.",
    });
    // Call backend to resend OTP and reset countdown
  };

  const onFinishTimer = () => {
    setCanResend(true);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
      <div style={{ textAlign: "center", maxWidth: "400px", width: "100%" }}>
        <img
          alt="Your Company"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
          style={{ display: "block", margin: "0 auto 16px", height: "40px" }}
        />

        <Card style={{ padding: "12px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Title level={3}>Email Verification</Title>
            <Text type="secondary">
              Please enter the 6-digit OTP sent to your email.
            </Text>
            <br />
            <Text type="secondary">{user?.email || email}</Text>
          </div>

          <Row justify="center" gutter={16} style={{ marginBottom: "24px" }}>
            {otp.map((_, index) => (
              <Col key={index}>
                <Input
                  id={`otp-input-${index}`}
                  value={otp[index]}
                  maxLength={1}
                  style={{
                    width: "40px",
                    height: "40px",
                    textAlign: "center",
                  }}
                  onChange={(e) => handleInputChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyPress(e, index)}
                />
              </Col>
            ))}
          </Row>

          <Form name="verification" layout="vertical">
            <Form.Item>
              <Button
                type="primary"
                size="large"
                style={{ width: "100%" }}
                onClick={handleVerify}
                disabled={loading}
              >
                {loading ? <Spin /> : "Verify OTP"}
              </Button>
            </Form.Item>
          </Form>

          <Countdown
            title="Resend OTP in"
            value={deadline}
            onFinish={onFinishTimer}
            format="mm:ss"
            style={{ textAlign: "center", marginBottom: "16px" }}
          />

          <Button
            type="primary"
            onClick={handleResend}
            size="large"
            disabled={!canResend}
            style={{ width: "100%", marginTop: "16px" }}
          >
            Resend OTP
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Verification;
