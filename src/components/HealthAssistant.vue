<template>
  <div class="card">
    <div class="card-header" @click="toggleChat" style="cursor: pointer;">
      <h5 class="mb-0 d-flex justify-content-between align-items-center">
        <span>
          <i class="fas fa-robot me-2"></i>
          Zest Well Health Assistant
        </span>
        <i :class="isExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
      </h5>
      <small class="text-muted">Get general health information and guidance</small>
    </div>
    
    <div v-show="isExpanded" class="card-body p-0">
      <!-- Chat Messages -->
      <div class="chat-container" ref="chatContainer">
        <div v-if="messages.length === 0" class="text-center p-4 text-muted">
          <i class="fas fa-comments fa-3x mb-3"></i>
          <p>Welcome! Ask me any general health questions.</p>
          <small>Always consult with a healthcare professional for medical advice.</small>
        </div>
        
        <div v-for="(message, index) in messages" :key="index" class="message-wrapper">
          <!-- AI Message (left side) -->
          <div v-if="message.type === 'ai'" class="message ai-message">
            <div class="message-avatar">
              <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
              <div class="message-bubble ai-bubble">
                {{ message.content }}
              </div>
              <small class="message-time">{{ formatTime(message.timestamp) }}</small>
            </div>
          </div>
          
          <!-- User Message (right side) -->
          <div v-else class="message user-message">
            <div class="message-content">
              <div class="message-bubble user-bubble">
                {{ message.content }}
              </div>
              <small class="message-time">{{ formatTime(message.timestamp) }}</small>
            </div>
            <div class="message-avatar">
              <i class="fas fa-user"></i>
            </div>
          </div>
        </div>
        
        <!-- Loading Message -->
        <div v-if="isLoading" class="message ai-message">
          <div class="message-avatar">
            <i class="fas fa-robot"></i>
          </div>
          <div class="message-content">
            <div class="message-bubble ai-bubble">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Chat Input -->
      <div class="chat-input p-3 border-top">
        <div class="input-group">
          <input
            v-model="userInput"
            @keyup.enter="sendMessage"
            type="text"
            class="form-control"
            placeholder="Ask a health question..."
            :disabled="isLoading"
          >
          <button 
            @click="sendMessage"
            class="btn btn-primary"
            :disabled="isLoading || !userInput.trim()"
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        <small class="text-muted">
          This AI assistant provides general health information only. Always consult a healthcare professional for medical advice.
        </small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const isExpanded = ref(false)
const messages = ref([])
const userInput = ref('')
const isLoading = ref(false)
const chatContainer = ref(null)

// Gemini API key from environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

// Debug function to check available models
const listAvailableModels = async () => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`)
    const data = await response.json()
    console.log('Available models:', data)
    return data
  } catch (error) {
    console.error('Error listing models:', error)
  }
}

const toggleChat = () => {
  isExpanded.value = !isExpanded.value
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return
  
  const userMessage = {
    type: 'user',
    content: userInput.value.trim(),
    timestamp: Date.now()
  }
  
  messages.value.push(userMessage)
  const currentInput = userInput.value
  userInput.value = ''
  isLoading.value = true
  
  scrollToBottom()
  
  try {
    const aiResponse = await callGeminiAPI(currentInput)
    
    const aiMessage = {
      type: 'ai',
      content: aiResponse,
      timestamp: Date.now()
    }
    
    messages.value.push(aiMessage)
    
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    
    const errorMessage = {
      type: 'ai',
      content: 'Sorry, something went wrong. Please try again or talk to a doctor if you have health concerns.',
      timestamp: Date.now()
    }
    
    messages.value.push(errorMessage)
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

const callGeminiAPI = async (userMessage) => {

  const systemPrompt = `You're a health assistant for Zest Well charity. Give short, simple health tips. Always tell people to see a real doctor for medical advice. Keep it brief and helpful.`

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\n\nUser question: ${userMessage}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 300,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH", 
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('API Error Details:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    })
    throw new Error(`API request failed: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  
  // CHECK 1: Ensure candidates exist and the first candidate has content
  if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      
      // CHECK 2: Look for a block reason
      if (candidate.finishReason && candidate.finishReason !== 'STOP') {
          // The response was blocked (e.g., SAFETY, RECITATION, or OTHER).
          console.warn('Gemini response blocked. Finish Reason:', candidate.finishReason);
          return 'I apologize, but that query was blocked by the safety filters. Please try rephrasing your question, or consult a healthcare professional for medical advice.';
      }
      
      // CHECK 3: Access the content safely
      if (candidate.content && 
          candidate.content.parts && 
          candidate.content.parts.length > 0) 
      {
          return candidate.content.parts[0].text
      }
  } 
  
  // Fallback for completely unexpected empty or malformed responses
  throw new Error('Received an empty or unexpected response from the API.');
}

// Add welcome message
const initializeChat = () => {
  messages.value.push({
    type: 'ai',
    content: 'Hello! I\'m your Zest Well Health Assistant, powered by AI. I can help with general health questions, wellness tips, and preventive care advice. Feel free to ask me about nutrition, exercise, mental health, or when to seek medical care. How can I support your health journey today?',
    timestamp: Date.now()
  })
}

// Set up welcome message
initializeChat()

// Debug: List available models
listAvailableModels()
</script>

<style scoped>
.card-header {
  background-color: #f8f9fa;
  transition: background-color 0.2s;
}

.card-header:hover {
  background-color: #e9ecef;
}

.chat-container {
  height: 400px;
  overflow-y: auto;
  padding: 1rem;
  background-color: #f8f9fa;
}

.message-wrapper {
  margin-bottom: 1rem;
}

.message {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  max-width: 80%;
}

.user-message {
  margin-left: auto;
  flex-direction: row-reverse;
}

.ai-message {
  margin-right: auto;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.user-message .message-avatar {
  background-color: #007bff;
  color: white;
}

.ai-message .message-avatar {
  background-color: #6c757d;
  color: white;
}

.message-content {
  flex-grow: 1;
}

.message-bubble {
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  margin-bottom: 0.25rem;
  word-wrap: break-word;
  line-height: 1.4;
}

.user-bubble {
  background-color: #007bff;
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.ai-bubble {
  background-color: white;
  color: #212529;
  border: 1px solid #dee2e6;
  border-bottom-left-radius: 0.25rem;
}

.message-time {
  color: #6c757d;
  font-size: 0.75rem;
  padding: 0 0.5rem;
}

.user-message .message-time {
  text-align: right;
}

.chat-input {
  background-color: white;
}

.chat-input small {
  display: block;
  margin-top: 0.5rem;
}

/* Typing indicator animation */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #6c757d;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Scrollbar styling */
.chat-container::-webkit-scrollbar {
  width: 6px;
}

.chat-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.chat-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chat-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>