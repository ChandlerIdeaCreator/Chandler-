// 初始化AOS动画库
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true
    });

    // 初始化Swiper轮播
    new Swiper('.swiper-container', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        autoplay: {
            delay: 5000
        }
    });

    // 监听滚动显示返回顶部按钮
    window.addEventListener('scroll', function() {
        const backToTop = document.getElementById('backToTop');
        if (window.scrollY > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });

    // 添加回车发送功能
    document.getElementById('userInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});

// 返回顶部功能
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 更新表单提交函数
function submitForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // 构建邮件内容
    const mailtoLink = `mailto:3237460759@qq.com?subject=来自${name}的消息&body=发件人：${name}%0A发件人邮箱：${email}%0A%0A消息内容：%0A${message}`;
    
    // 打开默认邮件客户端
    window.location.href = mailtoLink;
    
    // 清空表单
    event.target.reset();
    
    // 显示成功消息
    alert('邮件客户端已打开，请确认发送。');
}

// AI对话相关功能
let chatHistory = [];
const API_KEY = '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';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

// 打开AI对话窗口
function openAIChat() {
    const modal = new bootstrap.Modal(document.getElementById('aiChatModal'));
    modal.show();
}

// 修改发送消息函数
async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // 添加用户消息到对话界面
    addMessageToChat('user', message);
    input.value = '';
    
    // 显示加载动画
    showLoadingIndicator();
    
    try {
        // 模拟AI响应
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟
        
        let aiResponse = '';
        
        // 根据用户输入生成简单的响应
        if (message.includes('你好') || message.includes('hi') || message.includes('hello')) {
            aiResponse = '你好！很高兴见到你。我是Chandler的AI助手，有什么我可以帮你的吗？';
        } else if (message.includes('名字')) {
            aiResponse = '我是Chandler的AI助手，很高兴为您服务！';
        } else if (message.includes('天气')) {
            aiResponse = '抱歉，我暂时无法获取实时天气信息。建议您查看天气预报网站或APP。';
        } else if (message.includes('谢谢') || message.includes('感谢')) {
            aiResponse = '不用谢！很高兴能帮到你。';
        } else if (message.includes('再见') || message.includes('拜拜')) {
            aiResponse = '再见！如果还有问题随时来问我。';
        } else if (message.includes('Chandler')) {
            aiResponse = 'Chandler是一位东北大学的大一计算机科学与技术专业的学生，正在努力学习各类计算机知识。';
        } else {
            aiResponse = '抱歉，我可能没有完全理解您的问题。您可以试着换个方式提问，或者问我一些关于Chandler的基本信息。';
        }
        
        // 移除加载动画
        removeLoadingIndicator();
        
        // 使用打字机效果显示AI回复
        typeWriterEffect(aiResponse);
        
        // 更新对话历史
        chatHistory.push(
            { role: 'user', content: message },
            { role: 'assistant', content: aiResponse }
        );
        
    } catch (error) {
        console.error('AI响应错误:', error);
        removeLoadingIndicator();
        addMessageToChat('ai', '抱歉，出现了一些问题，请稍后重试。');
    }
}

// 打字机效果
function typeWriterEffect(text) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    chatContainer.appendChild(messageDiv);
    
    let i = 0;
    const speed = 50; // 打字速度（毫秒）
    
    function type() {
        if (i < text.length) {
            messageDiv.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
            // 自动滚动到底部
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }
    
    type();
}

// 显示加载动画
function showLoadingIndicator() {
    const chatContainer = document.getElementById('chatContainer');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message ai-message loading';
    loadingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    chatContainer.appendChild(loadingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 移除加载动画
function removeLoadingIndicator() {
    const loadingMessage = document.querySelector('.loading');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

// 清空对话历史
function clearChat() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '';
    chatHistory = [];
}

// 导出对话记录
function exportChat() {
    const chatContainer = document.getElementById('chatContainer');
    const messages = chatContainer.getElementsByClassName('message');
    let exportText = '';
    
    for (const message of messages) {
        const isUser = message.classList.contains('user-message');
        const prefix = isUser ? '我: ' : 'AI: ';
        exportText += prefix + message.textContent + '\n\n';
    }
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat-history.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// 切换主题
let isDarkTheme = false;
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    const modal = document.querySelector('.modal-content');
    const chatContainer = document.getElementById('chatContainer');
    
    if (isDarkTheme) {
        modal.style.backgroundColor = '#2c3e50';
        modal.style.color = '#fff';
        chatContainer.style.backgroundColor = '#34495e';
    } else {
        modal.style.backgroundColor = '#fff';
        modal.style.color = '#000';
        chatContainer.style.backgroundColor = '#fff';
    }
}

// 语音输入功能
function startVoiceInput() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = function(event) {
            const text = event.results[0][0].transcript;
            document.getElementById('userInput').value = text;
        };
        
        recognition.start();
    } else {
        alert('抱歉，您的浏览器不支持语音输入功能');
    }
}

// 添加消息到聊天界面
function addMessageToChat(type, message) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = message;
    chatContainer.appendChild(messageDiv);
    
    // 自动滚动到底部
    chatContainer.scrollTop = chatContainer.scrollHeight;
} 