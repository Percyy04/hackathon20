const Groq = require('groq-sdk');
const { ENV } = require('../lib/env');

const groq = new Groq({ apiKey: ENV.GROQ_API_KEY });

// Hàm làm sạch JSON (quan trọng để tránh lỗi 500)
const cleanJsonString = (str) => {
    if (!str) return "";

    // 1. Xóa các dòng ``````
    let cleaned = str.replace(/``````/g, "");

    // 2. Trim khoảng trắng đầu cuối
    cleaned = cleaned.trim();

    // 3. (Quan trọng) Đôi khi AI trả về text dư ở đầu/cuối ngoài JSON
    // Tìm dấu mở ngoặc { đầu tiên và dấu đóng ngoặc } cuối cùng
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    return cleaned;
};

const analyzeComments = async (question, comments) => {
    if (!comments || comments.length === 0) return null;

    const commentText = comments.map(c => `- ${c.content}`).join('\n');

    const prompt = `
    Phân tích ý kiến về câu hỏi: "${question}"
    Dữ liệu:
    ${commentText}

    Yêu cầu: Trả về kết quả JSON thuần túy. Giọng văn giống con người nhất có thể
    Cấu trúc:
    {
        "summary": "Tóm tắt 3-5 câu",
        "sentiment": "Positive/Negative/Neutral/Mixed",
        "clusters": [
            { "topic": "Chủ đề 1", "count": 10, "sentiment": "Positive" }
        ]
    }
    `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],

            // --- SỬA DÒNG NÀY ---
            model: "openai/gpt-oss-120b",
            // --------------------

            temperature: 0.3,
            max_completion_tokens: 4096,
            top_p: 1,
            stream: false
        });

        const content = completion.choices[0]?.message?.content;
        console.log("🤖 AI Output:", content); // Log để check

        if (!content) return null;

        return JSON.parse(cleanJsonString(content));

    } catch (error) {
        console.error("🔥 Groq Error:", error.message); // Sẽ hiện rõ lỗi nếu có
        return null;
    }
};

module.exports = { analyzeComments };
