import React, { useEffect, useState } from "react";
import { Input, Button, Avatar, Tag, Divider, message } from "antd";
import {
  SendOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  MessageOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router";
import { answerQuestion, getAllQuestions } from "../../services/apiServices";
import toast from "react-hot-toast";

const { TextArea } = Input;

const Answer = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const res = await getAllQuestions();
      const ques = res?.find((q) => roomId.toString() === q.id.toString());
      setQuestion(ques);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast.error("Please write your answer before submitting");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        roomId,
        content: answer,
      };
      const res = await answerQuestion(payload);

      if (!res) {
        toast.error("Cannot answer this question!");
      } else {
        toast.success("Answer post success!");
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            <CheckCircleOutlined className="text-white text-5xl" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Answer Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for contributing to the community
          </p>
          {/* Fixed Submit Buttons */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl flex gap-3"
          >
            <motion.div whileTap={{ scale: 0.97 }} className="flex-1">
              <Button
                type="primary"
                size="large"
                icon={<SendOutlined />}
                loading={loading}
                onClick={handleSubmit}
                disabled={!answer.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 rounded-xl h-14 text-base font-semibold shadow-lg disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Answer"}
              </Button>
            </motion.div>

            <motion.div whileTap={{ scale: 0.97 }} className="flex-1">
              <Button
                type="default"
                size="large"
                onClick={() => navigate("/home")}
                className="w-full border-0 rounded-xl h-14 text-base font-semibold bg-gray-200 hover:bg-gray-300"
              >
                Skip Answer
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="bg-white shadow-md sticky top-0 z-10"
      >
        <div className="px-4 py-4 flex items-center gap-3">
          <motion.div
            className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl relative flex-shrink-0"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <motion.div
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              variants={sparkVariants}
              initial="initial"
              animate="animate"
              style={{ top: 4, right: 4 }}
            />
            <QuestionCircleOutlined className="text-white text-lg" />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">CrowdSpark</h1>
            <p className="text-xs text-gray-500">Answer this question</p>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="p-4 pb-24">
        {/* Question Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-lg p-5 mb-4"
        >
          {/* Question Header */}
          <div className="flex items-start gap-3 mb-4">
            <Avatar
              size={48}
              className="bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0"
            >
              {question?.hostName?.charAt(0)}
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm mb-1">
                {question?.hostName}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <ClockCircleOutlined />
                <span>{question?.createAt}</span>
              </div>
            </div>
          </div>

          {/* Question Title */}
          <h2 className="text-xl font-bold text-gray-800 mb-3 leading-snug">
            {question?.question}
          </h2>

          {/* Question Stats */}
          <Divider className="my-3" />
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <EyeOutlined />
              <span>{question?.views} views</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageOutlined />
              <span>{question?.answers} answers</span>
            </div>
          </div>
        </motion.div>

        {/* Answer Section */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
            <h3 className="font-semibold mb-1 flex items-center gap-2">
              <SendOutlined />
              Your Answer
            </h3>
            <p className="text-sm text-blue-100">
              Share your knowledge and help the community
            </p>
          </div>

          {/* Answer Input */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl shadow-lg p-4"
          >
            <TextArea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write your answer here...

Tip: Be clear and specific. Include examples or code snippets if relevant."
              rows={8}
              className="rounded-xl text-base resize-none"
              maxLength={5000}
            />
            <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
              <span>{answer.length}/5000 characters</span>
              <span className="text-blue-600">Markdown supported</span>
            </div>
          </motion.div>

          {/* Tips Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <h4 className="font-semibold text-gray-800 text-sm mb-2">
              💡 Tips for a great answer
            </h4>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>Be clear and concise</li>
              <li>Include code examples if applicable</li>
              <li>Explain your reasoning</li>
              <li>Link to helpful resources</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Fixed Submit Button */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl"
      >
        <motion.div whileTap={{ scale: 0.97 }}>
          <Button
            type="primary"
            size="large"
            icon={<SendOutlined />}
            loading={loading}
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 rounded-xl h-14 text-base font-semibold shadow-lg disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Answer"}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Answer;
