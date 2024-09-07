const fileInput = document.getElementById('file-input');
const textToTypeElement = document.getElementById('text-to-type');
const inputText = document.getElementById('input-text');
const inputDisplay = document.getElementById('input-display');
const timerElement = document.getElementById('timer');
const accuracyElement = document.getElementById('accuracy');
const pauseBtn = document.getElementById('pause-btn');
const languageBtn = document.getElementById('language-btn');
const titleElement = document.getElementById('title');

let textToType = '';
let startTime = null;
let timerInterval = null;
let isPaused = false;
let elapsedTime = 0; // 用于记录暂停时的时间
let currentLanguage = 'zh'; // 当前语言，初始为中文

// 默认练习文本
const defaultTexts = {
  zh: [
    "这是一个中文打字练习示例。",
    "学习编程可以提高解决问题的能力。",
    "每天读书有助于增加知识储备。"
  ],
  en: [
    "This is a sample typing practice text in English.",
    "Learning to code can improve problem-solving skills.",
    "Reading books daily helps to increase knowledge."
  ]
};

// 定义中英文文本映射
const translations = {
  zh: {
    title: "中文打字练习",
    pause: "暂停",
    continue: "继续",
    switchTo: "切换到英文",
    timer: "时间: ",
    accuracy: "准确率: ",
    placeholder: "开始输入...",
    alertComplete: "完成！"
  },
  en: {
    title: "Typing Practice",
    pause: "Pause",
    continue: "Continue",
    switchTo: "Switch to Chinese",
    timer: "Time: ",
    accuracy: "Accuracy: ",
    placeholder: "Start typing...",
    alertComplete: "Well done!"
  }
};

// 监听文件上传事件
fileInput.addEventListener('change', handleFileUpload);
inputText.addEventListener('input', handleTyping);
pauseBtn.addEventListener('click', togglePause);
languageBtn.addEventListener('click', toggleLanguage);

// 页面加载时选择默认文本
window.addEventListener('load', () => {
  textToType = defaultTexts[currentLanguage][0];
  textToTypeElement.innerText = textToType;
  inputText.disabled = false; // 启用输入区域
  inputDisplay.innerHTML = "";
  resetStats(); // 重置计时器和准确率
});

function handleFileUpload(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      textToType = e.target.result.trim(); // 读取文件内容并去除空白字符
      textToTypeElement.innerText = textToType; // 将文件内容设置为打字练习文本
      inputText.value = ""; // 清空输入区域
      inputText.disabled = false; // 启用输入区域
      inputDisplay.innerHTML = ""; // 清空显示区域
      resetStats(); // 重置计时器和准确率
    };
    reader.readAsText(file);
  }
}

function handleTyping() {
  if (isPaused) return; // 暂停时不处理输入

  const typedText = inputText.value;
  
  if (!startTime) {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
  }

  updateDisplay(typedText);

  const accuracy = calculateAccuracy(typedText, textToType);
  accuracyElement.innerText = `${translations[currentLanguage].accuracy} ${accuracy}%`;

  if (typedText === textToType) {
    // 打字完成
    clearInterval(timerInterval);
    inputText.disabled = true; // 禁用输入框
    alert(translations[currentLanguage].alertComplete); // 提示完成
    resetStats(); // 重置状态
  }
}

function updateDisplay(typedText) {
  inputDisplay.innerHTML = ''; // 清空显示区域

  for (let i = 0; i < textToType.length; i++) {
    const char = textToType[i];
    const span = document.createElement('span');
    if (typedText[i] === char) {
      span.textContent = char;
      span.className = ''; // 正确字符
    } else if (typedText[i] === undefined) {
      span.textContent = char;
      span.className = 'error'; // 未输入字符
    } else {
      span.textContent = typedText[i];
      span.className = 'error'; // 错误字符
    }
    inputDisplay.appendChild(span);
  }
}

function calculateAccuracy(typedText, originalText) {
  const typedLength = typedText.length;
  if (typedLength === 0) return 100; // 没有输入时准确率为 100%
  
  let correctCount = 0;
  for (let i = 0; i < typedLength; i++) {
    if (typedText[i] === originalText[i]) {
      correctCount++;
    }
  }
  return (correctCount / typedLength) * 100;
}

function updateTimer() {
  elapsedTime = Math.floor((new Date() - startTime) / 1000);
  timerElement.innerText = `${translations[currentLanguage].timer} ${elapsedTime}秒`;
}

function resetStats() {
  clearInterval(timerInterval);
  startTime = null;
  elapsedTime = 0;timerElement.innerText = `${translations[currentLanguage].timer} 0秒`;
  accuracyElement.innerText = `${translations[currentLanguage].accuracy} 100%`;
}

function togglePause() {
  if (!startTime) return; // 如果计时器还没有开始，则不能暂停

  if (isPaused) {
    // 恢复计时
    startTime = new Date() - elapsedTime * 1000; // 继续时调整开始时间
    timerInterval = setInterval(updateTimer, 1000);
    inputText.disabled = false; // 启用输入框
    pauseBtn.innerText = translations[currentLanguage].pause;
  } else {
    // 暂停计时
    clearInterval(timerInterval);
    inputText.disabled = true; // 禁用输入框
    pauseBtn.innerText = translations[currentLanguage].continue;
  }

  isPaused = !isPaused;
}

function toggleLanguage() {
  // 切换语言
  currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
  
  // 更新默认文本
  textToType = defaultTexts[currentLanguage][0];
  textToTypeElement.innerText = textToType;
  inputText.value = ""; // 清空输入区域
  inputDisplay.innerHTML = "";
  resetStats(); // 重置计时器和准确率

  // 更新 UI 文本
  titleElement.innerText = translations[currentLanguage].title;
  pauseBtn.innerText = isPaused ? translations[currentLanguage].continue : translations[currentLanguage].pause;
  languageBtn.innerText = translations[currentLanguage].switchTo;
  inputText.placeholder = translations[currentLanguage].placeholder;
  timerElement.innerText = `${translations[currentLanguage].timer} ${elapsedTime}秒`;
  accuracyElement.innerText = `${translations[currentLanguage].accuracy} ${calculateAccuracy(inputText.value, textToType)}%`;
}