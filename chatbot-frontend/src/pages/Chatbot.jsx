import { useState, useEffect, useRef } from 'react';
import { FiSend, FiX } from 'react-icons/fi';
import { RiRobot2Fill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { sendMessageToAI, getChatHistory } from '../services/api/chat.service';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Chatbot = () => {
  const controllerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    loadChatHistory();
    
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory();
      const formatted = history.map((msg, i) => ({
        id: Date.now() + i,
        type: msg.role === 'human' ? 'user' : 'ai',
        text: msg.content,
      }));
      setMessages(formatted);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const cancelRequest = () => {
    console.log('Cancelling request...');
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    setMessages(prev => prev.filter(m => !m.isThinking));
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !isLoading) return;

    if (isLoading) {
      cancelRequest();
      return;
    }

    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();

    const userText = inputValue.trim();
    setInputValue('');

    setMessages(prev => [
      ...prev,
      { id: Date.now(), type: 'user', text: userText },
      { id: Date.now() + 1, type: 'ai', text: 'AI is thinking', isThinking: true },
    ]);

    setIsLoading(true);

    try {
      const response = await sendMessageToAI(userText, controllerRef.current);
      const aiText = response.reply || response.response || response.message || 'No response';

      setMessages(prev => [
        ...prev.filter(m => !m.isThinking),
        { id: Date.now() + 2, type: 'ai', text: aiText },
      ]);
    } catch (error) {
      console.log('Error caught:', error);
      
      if (axios.isCancel(error) || error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        console.log('Request was cancelled');
        setMessages(prev => prev.filter(m => !m.isThinking));
        return;
      }

      toast.error('Failed to get AI response');
      setMessages(prev => [
        ...prev.filter(m => !m.isThinking),
        { id: Date.now(), type: 'ai', text: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
      controllerRef.current = null;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <Navbar />

      <div className="chat-messages">
        <div className="messages-container">
          {isLoadingHistory ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
              Loading chat history...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
              No messages yet. Start a conversation!
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`message ${msg.type}`}>
                {msg.type === 'ai' ? (
                  <div className="message-content">
                    <div className="ai-icon">
                      <RiRobot2Fill />
                    </div>
                    <div className={`message-bubble ${msg.isThinking ? 'thinking' : ''}`}>
                      {msg.isThinking ? (
                        <>
                          AI is thinking
                          <div className="dots">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="message-bubble">{msg.text}</div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="chat-input-container">
        <div className="input-wrapper">
          <input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
          />

          <button
            className={`send-btn ${isLoading ? 'cancel' : ''}`}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() && !isLoading}
          >
            {isLoading ? (
              <>
                {/* <FiX /> */}
                Cancel
              </>
            ) : (
              <>
                {/* <FiSend /> */}
                Send
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
