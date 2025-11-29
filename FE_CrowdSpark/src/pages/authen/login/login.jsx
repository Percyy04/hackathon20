import React, { useState, lazy, Suspense } from "react";
import { Form, Input, Button, Divider, Checkbox } from "antd";
import {
  MailOutlined,
  LockOutlined,
  GoogleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { loginFunction } from "../../../services/apiServices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        email: values.email,
        password: values.password,
      };

      const res = await loginFunction(payload);

      if (!res) {
        toast.error("Login failed!");
      } else {
        toast.success("Login success!");
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    // Simulate Google OAuth
    setTimeout(() => {
      console.log("Google login initiated");
      setGoogleLoading(false);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const sparkVariants = {
    initial: { scale: 0, rotate: 0 },
    animate: {
      scale: [0, 1, 0.8, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 3,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-blue-300 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 relative"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="absolute w-3 h-3 bg-yellow-400 rounded-full"
                variants={sparkVariants}
                initial="initial"
                animate="animate"
                style={{ top: 8, right: 8 }}
              />
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              CrowdSpark
            </h1>
            <p className="text-gray-500 text-sm">
              Ask questions, spark conversations
            </p>
          </div>

          {/* Form */}
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-blue-500" />}
                placeholder="Email address"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-blue-500" />}
                placeholder="Password"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <div className="flex items-center justify-between mb-6">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-sm text-gray-600">
                  Remember me
                </Checkbox>
              </Form.Item>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot password?
              </a>
            </div>

            <Form.Item>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 rounded-lg h-12 text-base font-semibold shadow-lg"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </motion.div>
            </Form.Item>
          </Form>

          <Divider className="text-gray-400 text-sm">or continue with</Divider>

          {/* Google Login */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="large"
              icon={<GoogleOutlined />}
              onClick={handleGoogleLogin}
              loading={googleLoading}
              className="w-full rounded-lg h-12 text-base font-semibold border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600"
            >
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </Button>
          </motion.div>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <span className="text-gray-600 text-sm">
              Don't have an account?{" "}
            </span>
            <a
              href="/signup"
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              Sign up
            </a>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          className="text-center mt-6 text-gray-500 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>© 2024 CrowdSpark. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
