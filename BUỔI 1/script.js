// Sử dụng thư viện OpenAI SDK chính thức qua esm.sh để chạy mượt mà ngay trên Browser //
import OpenAI from "https://esm.sh/openai";

// Cấu hình API Override
const API_KEY = "sk-4bd27113b7dc78d1-lh6jld-f4f9c69f";
const BASE_URL = "https://9router.vuhai.io.vn/v1";
const MODEL_NAME = "ces-chatbot-gpt-5.4";

// Khởi tạo SDK
const openai = new OpenAI({
    baseURL: BASE_URL,
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true // Bắt buộc khi gọi SDK từ phía client.
});

// State & History
let systemPromptText = "";
let messages = [];

// DOM References
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const closeBtn = document.getElementById('close-btn');
const refreshBtn = document.getElementById('refresh-btn');
const chatBody = document.getElementById('chat-body');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

// --- 1. CORE LOGIC: Load chatbot_data.txt và tạo SYSTEM PROMPT ---
async function initializeKnowledgeBase() {
    try {
        const response = await fetch('./chatbot_data.txt');
        if (!response.ok) throw new Error("Network response was not ok");
        const kbData = await response.text();
        
        systemPromptText = `
Vai trò: AI trợ lý độc quyền cho chuyên gia tâm lý MINH CHÂU.
Chỉ được trả lời dựa trên Knowledge Base bên dưới.
Phải trả lời bằng cú pháp Markdown đẹp mắt.
Luôn luôn tuân thủ 3 nguyên tắc sau:
1. Chào hỏi thân thiện ở đầu câu.
2. Trả lời rõ ràng, rành mạch.
3. Kết thúc bằng lời mời/hỏi thêm.

Nếu câu hỏi nằm ngoài phạm vi Knowledge Base -> Vui lòng từ chối nhẹ nhàng và hướng dẫn khách hàng liên hệ chuyên gia qua email (centalux@gmail.com) hoặc Zalo (0839998300).

--- KNOWLEDGE BASE ---
${kbData}
`;
        
        // Khởi tạo Lịch sử Chat mang theo Logic System
        resetChatHistory();
        initDefaultMessage();
    } catch (error) {
        console.error("Lỗi khi load chatbot_data.txt:", error);
        addBotMessage("**Lỗi hệ thống:** Không thể tải dữ liệu Knowledge Base nội bộ!");
    }
}

function resetChatHistory() {
    messages = [
        { role: 'system', content: systemPromptText }
    ];
}

function initDefaultMessage() {
    chatBody.innerHTML = '';
    const greeting = "Xin chào! Mình là trợ lý AI của chuyên gia **MINH CHÂU**.\n\nMình có thể hỗ trợ thông tin gì cho bạn về các khóa học hoặc workshop trị liệu tâm lý hôm nay?";
    addBotMessage(greeting);
    messages.push({ role: 'assistant', content: greeting });
}

// --- 2. GIAO DIỆN & TƯƠNG TÁC ---
marked.setOptions({ breaks: true, gfm: true });

// Toggle UI
chatToggle.addEventListener('click', () => chatWindow.classList.add('open'));
closeBtn.addEventListener('click', () => chatWindow.classList.remove('open'));

// Xử lý Input & Nút Gửi (Bonus Enter to send)
chatInput.addEventListener('input', () => {
    sendBtn.disabled = chatInput.value.trim() === '';
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !sendBtn.disabled) {
        e.preventDefault();
        handleSend();
    }
});
sendBtn.addEventListener('click', handleSend);

// Nút Refresh: Logic Reset
refreshBtn.addEventListener('click', () => {
    const icon = refreshBtn.querySelector('svg');
    icon.classList.add('spin');
    
    // Xóa History
    resetChatHistory();
    // Re-render Greeting
    initDefaultMessage();
    
    // Dừng animation sau đúng 500ms
    setTimeout(() => icon.classList.remove('spin'), 500);
});

// --- 3. API FETCHING LOGIC ---
async function handleSend() {
    const userText = chatInput.value.trim();
    if (!userText) return;

    // Hiển thị message người dùng
    addUserMessage(userText);
    messages.push({ role: 'user', content: userText });
    
    // Reset Form Input
    chatInput.value = '';
    sendBtn.disabled = true;

    // Hiệu ứng Loading "Đang nhập..."
    const typingId = 'typing-' + Date.now();
    addTypingIndicator(typingId);

    try {
        // Sử dụng OpenAI API với tham số Override baseURL được định nghĩa ở trên
        const completion = await openai.chat.completions.create({
            model: MODEL_NAME,
            messages: messages,
            temperature: 0.7,
        });

        const aiResponse = completion.choices[0]?.message?.content || "Xin lỗi, tôi không thể tạo câu trả lời ngay lúc này.";
        
        // Remove typing
        removeTypingIndicator(typingId);
        
        // Cập nhật messages context list
        messages.push({ role: 'assistant', content: aiResponse });
        
        // Render UI markdown
        addBotMessage(aiResponse);
    } catch (error) {
        console.error("OpenAI API Logic Error:", error);
        removeTypingIndicator(typingId);
        addBotMessage("⚠️ **Lỗi đường truyền:** Không thể kết nối tới máy chủ AI của hệ thống. Vui lòng kiểm tra lại cấu hình API.");
    }
}

// --- 4. HÀM HELPER HỖ TRỢ DOM ---
function addUserMessage(text) {
    const el = document.createElement('div');
    el.className = 'message msg-user';
    el.textContent = text; 
    chatBody.appendChild(el);
    scrollToBottom();
}

function addBotMessage(text) {
    const el = document.createElement('div');
    el.className = 'message msg-bot chat-markdown';
    el.innerHTML = marked.parse(text); // parse md -> html
    chatBody.appendChild(el);
    scrollToBottom();
}

function addTypingIndicator(id) {
    const el = document.createElement('div');
    el.id = id;
    el.className = 'typing-indicator';
    el.innerHTML = `
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
        <span class="typing-text">Đang trả lời...</span>
    `;
    chatBody.appendChild(el);
    scrollToBottom();
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

// Hàm scroll mượt mà
function scrollToBottom() {
    setTimeout(() => {
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 10);
}

// --- KHỞI TẠO APP MẶC ĐỊNH ---
document.addEventListener('DOMContentLoaded', () => {
    initializeKnowledgeBase();
});
