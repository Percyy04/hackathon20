const Groq = require('groq-sdk');
require('dotenv').config();

// Init Client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * Hàm phân tích ý kiến khán giả
 * @param {string} question - Câu hỏi gốc của Host
 * @param {Array} comments - Danh sách các object comment { content: "..." }
 */
async function analyzeComments(question, comments) {
    // 1. Validate đầu vào
    if (!comments || comments.length === 0) return null;

    console.log(`🤖 AI Processing: ${comments.length} comments...`);

    // 2. Chuẩn bị Prompt
    // Gom text lại thành list gạch đầu dòng
    const listText = comments.map(c => `- ${c.content}`).join('\n');

    const prompt = `
    Context: Khán giả đang trả lời câu hỏi: "${question}"
    Danh sách câu trả lời:
    ${listText}

    Nhiệm vụ của bạn:
    1. Gom nhóm các ý kiến tương đồng (Clustering).
    2. Đếm số lượng mỗi nhóm.
    3. Xác định cảm xúc (positive/negative/neutral).
    4. Viết một câu tóm tắt ngắn gọn bằng tiếng Việt.

    OUTPUT FORMAT (JSON ONLY):
    {
      "clusters": [
        { "topic": "Tên chủ đề ngắn (Tiếng Việt)", "count": 10, "sentiment": "positive" }
      ],
      "summary": "Câu tóm tắt ngắn gọn 15-20 từ."
    }
    `;

    try {
        // 3. Gọi Groq API (Llama-3-70b - Con này thông minh nhất của Groq)
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that outputs strict JSON. Do not output any markdown or explanation."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama3-70b-8192",

            // QUAN TRỌNG: Ép kiểu JSON để đỡ phải parse string bằng tay
            response_format: { type: "json_object" },

            temperature: 0.5, // 0.5 để cân bằng giữa sáng tạo và chính xác
            max_tokens: 1024,
        });

        // 4. Xử lý kết quả
        const rawContent = completion.choices[0]?.message?.content;
        console.log("✅ Groq Output:", rawContent);

        return JSON.parse(rawContent);

    } catch (error) {
        console.error("🔥 Groq Error:", error.message);

        // Fallback: Nếu AI lỗi, trả về null hoặc mock data để app không chết
        return null;
    }
}

module.exports = { analyzeComments };
