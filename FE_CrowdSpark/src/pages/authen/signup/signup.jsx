import React, { useState } from "react";
import { Input, Button, Divider, Checkbox, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { signupFunction } from "../../../services/apiServices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreement: false,
  });
  const [errors, setErrors] = useState({});

  const validateUsername = (value) => {
    if (!value) return "Please enter your username";
    if (value.length < 3) return "Username must be at least 3 characters";
    if (value.length > 20) return "Username must be less than 20 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(value))
      return "Username can only contain letters, numbers and underscore";
    return null;
  };

  const validateEmail = (value) => {
    if (!value) return "Please enter your email";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Please enter a valid email";
    return null;
  };

  const validatePassword = (value) => {
    if (!value) return "Please enter your password";
    if (value.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const validateConfirmPassword = (value) => {
    if (!value) return "Please confirm your password";
    if (value !== formData.password) return "Passwords do not match";
    return null;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};
    newErrors.username = validateUsername(formData.username);
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    newErrors.confirmPassword = validateConfirmPassword(
      formData.confirmPassword
    );

    if (!formData.agreement) {
      newErrors.agreement = "Please accept the terms and conditions";
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== null);
    if (hasErrors) {
      message.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      const res = await signupFunction(payload);

      if (!res) {
        toast.error("Signup failed!");
      } else {
        toast.success("Signup success!");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setTimeout(() => {
      console.log("Google signup initiated");
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
              Join CrowdSpark
            </h1>
            <p className="text-gray-500 text-sm">
              Create your account to get started
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Input
                prefix={<UserOutlined className="text-blue-500" />}
                placeholder="Username"
                size="large"
                className="rounded-lg"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                status={errors.username ? "error" : ""}
              />
              {errors.username && (
                <div className="text-red-500 text-xs mt-1 ml-1">
                  {errors.username}
                </div>
              )}
            </div>

            <div>
              <Input
                prefix={<MailOutlined className="text-blue-500" />}
                placeholder="Email address"
                size="large"
                className="rounded-lg"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                status={errors.email ? "error" : ""}
              />
              {errors.email && (
                <div className="text-red-500 text-xs mt-1 ml-1">
                  {errors.email}
                </div>
              )}
            </div>

            <div>
              <Input.Password
                prefix={<LockOutlined className="text-blue-500" />}
                placeholder="Password"
                size="large"
                className="rounded-lg"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                status={errors.password ? "error" : ""}
              />
              {errors.password && (
                <div className="text-red-500 text-xs mt-1 ml-1">
                  {errors.password}
                </div>
              )}
            </div>

            <div>
              <Input.Password
                prefix={<LockOutlined className="text-blue-500" />}
                placeholder="Confirm password"
                size="large"
                className="rounded-lg"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                status={errors.confirmPassword ? "error" : ""}
              />
              {errors.confirmPassword && (
                <div className="text-red-500 text-xs mt-1 ml-1">
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            <div>
              <Checkbox
                checked={formData.agreement}
                onChange={(e) =>
                  handleInputChange("agreement", e.target.checked)
                }
                className="text-sm text-gray-600"
              >
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </a>
              </Checkbox>
              {errors.agreement && (
                <div className="text-red-500 text-xs mt-1 ml-1">
                  {errors.agreement}
                </div>
              )}
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="primary"
                size="large"
                loading={loading}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 rounded-lg h-12 text-base font-semibold shadow-lg"
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </motion.div>
          </div>

          <Divider className="text-gray-400 text-sm my-6">
            or sign up with
          </Divider>

          {/* Google Signup */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="large"
              icon={<GoogleOutlined />}
              onClick={handleGoogleSignup}
              loading={googleLoading}
              className="w-full rounded-lg h-12 text-base font-semibold border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600"
            >
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </Button>
          </motion.div>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <span className="text-gray-600 text-sm">
              Already have an account?{" "}
            </span>
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              Sign in
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

export default Signup;
