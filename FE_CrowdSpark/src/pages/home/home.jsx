import React, { useEffect, useState } from "react";
import { Button, Avatar, Dropdown, Badge, Input, Modal } from "antd";
import {
  PlusOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  FireOutlined,
  ClockCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import {
  addQuestionFunction,
  getAllQuestions,
  logoutFunction,
} from "../../services/apiServices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("home");
  const userName = "John Doe";
  const [questionsList, setQuestionsList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  console.log(questionsList);

  const fetchQuestions = async () => {
    try {
      const res = await getAllQuestions();
      setQuestionsList(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutFunction();
      toast.success("Logout success!");
      navigate("/");
      sessionStorage.clear();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAskQuestion = () => {
    setIsModalOpen(true);
  };

  const handleAddQuestion = async (content) => {
    const payload = { question: content };
    try {
      const newQuestion = await addQuestionFunction(payload);

      if (!newQuestion) {
        toast.error("Cannot add new question!");
      } else {
        toast.success("New question addes!");
        setIsModalOpen(false);
        fetchQuestions();
      }
    } catch (error) {
      console.error("Failed to add question:", error);
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      label: "My Profile",
      icon: <UserOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
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
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      {/* Sidebar */}
      <motion.div
        className="bg-white shadow-xl flex flex-col relative"
        variants={sidebarVariants}
        animate={collapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-4 top-6 bg-blue-500 text-white rounded-full p-2 shadow-lg hover:bg-blue-600 z-10"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>

        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <motion.div
              className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl relative"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <motion.div
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                variants={sparkVariants}
                initial="initial"
                animate="animate"
                style={{ top: 4, right: 4 }}
              />
              <QuestionCircleOutlined className="text-white text-xl" />
            </motion.div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="overflow-hidden"
                >
                  <h1 className="text-xl font-bold text-gray-800">
                    CrowdSpark
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Welcome Message */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200"
            >
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold text-gray-800">{userName}! 👋</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Menu */}
        <div className="flex-1 p-4 overflow-y-auto">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAskQuestion}
              className={`${
                collapsed ? "w-12 h-12" : "w-full h-12"
              } bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 rounded-xl font-semibold shadow-lg mb-4`}
            >
              {!collapsed && "Ask Question"}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              icon={<QuestionCircleOutlined />}
              onClick={() => setSelectedMenu("myQuestions")}
              className={`${
                collapsed ? "w-12 h-12" : "w-full h-12"
              } rounded-xl font-semibold mb-3 ${
                selectedMenu === "myQuestions"
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              {!collapsed && "My Questions"}
            </Button>
          </motion.div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className={`${
                collapsed ? "w-12 h-12" : "w-full h-12"
              } rounded-xl font-semibold`}
            >
              {!collapsed && "Logout"}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <div className="flex-1 max-w-2xl">
            <Input
              size="large"
              placeholder="Search questions..."
              prefix={<SearchOutlined className="text-gray-400" />}
              className="rounded-xl"
            />
          </div>
          <div className="flex items-center gap-4 ml-8">
            <Badge count={3} offset={[-5, 5]}>
              <Button
                type="text"
                icon={<BellOutlined className="text-xl" />}
                className="rounded-full w-10 h-10"
              />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar
                size={40}
                className="bg-gradient-to-br from-blue-500 to-blue-600 cursor-pointer"
              >
                {userName.charAt(0)}
              </Avatar>
            </Dropdown>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Trending Questions
              </h2>
              <p className="text-gray-600">
                Discover the most popular questions in the community
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-3 mb-6">
              <Button
                type="primary"
                icon={<FireOutlined />}
                className="bg-gradient-to-r from-blue-500 to-blue-600 border-0 rounded-lg"
              >
                Trending
              </Button>
              <Button icon={<ClockCircleOutlined />} className="rounded-lg">
                Recent
              </Button>
              <Button className="rounded-lg">Unanswered</Button>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {questionsList?.map((question, index) => (
                <motion.div
                  onClick={() => navigate(`/join/${question.id}`)}
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Avatar
                      size={48}
                      className="bg-gradient-to-br from-blue-400 to-blue-600"
                    >
                      {question?.hostName?.charAt(0)}
                    </Avatar>

                    {/* Question Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                          {question.question}
                        </h3>
                        {question.trending && (
                          <FireOutlined className="text-orange-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Asked by{" "}
                        <span className="font-medium">{question.hostName}</span>{" "}
                        • {question.time}
                      </p>

                      {/* QR Code */}
                      {question.qrCode && (
                        <img
                          src={question.qrCode}
                          alt="QR Code"
                          className="w-24 h-24 mt-2 border rounded-md"
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ask Question Modal */}
      <Modal
        title="Ask a Question"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => handleAddQuestion(newQuestion)}
      >
        <Input
          placeholder="Question title"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="mb-3"
        />
      </Modal>
    </div>
  );
};

export default Home;
