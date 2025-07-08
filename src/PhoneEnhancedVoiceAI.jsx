import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Phone, PhoneCall, Users, Share2, Settings, Volume2, VolumeX } from 'lucide-react';

const PhoneEnhancedVoiceAI = () => {
  // 기본 상태
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  
  // 개인화 설정
  const [userSettings, setUserSettings] = useState({
    name: '사용자',
    personality: '친근하고 도움이 되는',
    expertise: '일반적인 도움',
    thinkingTime: 10000,
    speechSpeed: 1,
    textSpeed: 50
  });

  // 전화 관련 상태 (새로 추가)
  const [phoneMode, setPhoneMode] = useState(false);
  const [callStatus, setCallStatus] = useState('idle');
  const [callSummary, setCallSummary] = useState('');
  const [callNotes, setCallNotes] = useState([]);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [businessCard, setBusinessCard] = useState({
    name: '',
    intro: '',
    business: '',
    website: '',
    contact: ''
  });

  // 명함 공유 상태 (새로 추가)
  const [showCardForm, setShowCardForm] = useState(false);
  const [sharedCards, setSharedCards] = useState([]);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const textareaRef = useRef(null);// 음성 인식 초기화
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ko-KR';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          handleVoiceInput(finalTranscript);
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }

    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // 실시간 타이핑 감지
  useEffect(() => {
    if (typingText.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        if (typingText.length > 10) {
          prepareResponse(typingText);
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [typingText]);

  // 음성 입력 처리
  const handleVoiceInput = async (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('빨리') || lowerText.includes('빠르게')) {
      setUserSettings(prev => ({ ...prev, speechSpeed: Math.min(prev.speechSpeed + 0.3, 2) }));
      speak("말하는 속도를 빠르게 조절했습니다");
      return;
    }
    
    if (lowerText.includes('천천히') || lowerText.includes('느리게')) {
      setUserSettings(prev => ({ ...prev, speechSpeed: Math.max(prev.speechSpeed - 0.3, 0.5) }));
      speak("말하는 속도를 천천히 조절했습니다");
      return;
    }

    if (lowerText.includes('전화') && lowerText.includes('모드')) {
      setPhoneMode(!phoneMode);
      speak(phoneMode ? "전화 모드를 종료합니다" : "전화 모드를 시작합니다");
      return;
    }

    if (lowerText.includes('명함') && lowerText.includes('공유')) {
      setShowCardForm(true);
      speak("명함 정보를 입력해주세요");
      return;
    }

    if (lowerText.includes('전화') && lowerText.includes('업그레이드')) {
      handlePhoneUpgrade();
      return;
    }
// 음성 인식 초기화
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ko-KR';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          handleVoiceInput(finalTranscript);
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }

    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // 실시간 타이핑 감지
  useEffect(() => {
    if (typingText.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        if (typingText.length > 10) {
          prepareResponse(typingText);
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [typingText]);

  // 음성 입력 처리
  const handleVoiceInput = async (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('빨리') || lowerText.includes('빠르게')) {
      setUserSettings(prev => ({ ...prev, speechSpeed: Math.min(prev.speechSpeed + 0.3, 2) }));
      speak("말하는 속도를 빠르게 조절했습니다");
      return;
    }
    
    if (lowerText.includes('천천히') || lowerText.includes('느리게')) {
      setUserSettings(prev => ({ ...prev, speechSpeed: Math.max(prev.speechSpeed - 0.3, 0.5) }));
      speak("말하는 속도를 천천히 조절했습니다");
      return;
    }

    if (lowerText.includes('전화') && lowerText.includes('모드')) {
      setPhoneMode(!phoneMode);// 음성 인식 초기화
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ko-KR';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          handleVoiceInput(finalTranscript);
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }

    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // 실시간 타이핑 감지
  useEffect(() => {
    if (typingText.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        if (typingText.length > 10) {
          prepareResponse(typingText);
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [typingText]);

  // 음성 입력 처리
  const handleVoiceInput = async (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('빨리') || lowerText.includes('빠르게')) {
      setUserSettings(prev => ({ ...prev, speechSpeed: Math.min(prev.speechSpeed + 0.3, 2) }));
      speak("말하는 속도를 빠르게 조절했습니다");
      return;
    }
    
    if (lowerText.includes('천천히') || lowerText.includes('느리게')) {
      setUserSettings(prev => ({ ...prev, speechSpeed: Math.max(prev.speechSpeed - 0.3, 0.5) }));
      speak("말하는 속도를 천천히 조절했습니다");
      return;
    }

    if (lowerText.includes('전화') && lowerText.includes('모드')) {
      setPhoneMode(!phoneMode);
      speak(phoneMode ? "전화 모드를 종료합니다" : "전화 모드를 시작합니다");
      return;
    }

    if (lowerText.includes('명함') && lowerText.includes('공유')) {
      setShowCardForm(true);
      speak("명함 정보를 입력해주세요");
      return;
    }

    if (lowerText.includes('전화') && lowerText.includes('업그레이드')) {
      handlePhoneUpgrade();
      return;
    }

    await processMessage(text);
  };
      speak(phoneMode ? "전화 모드를 종료합니다" : "전화 모드를 시작합니다");
      return;
    }

    if (lowerText.includes('명함') && lowerText.includes('공유')) {
      setShowCardForm(true);
      speak("명함 정보를 입력해주세요");
      return;
    }

    if (lowerText.includes('전화') && lowerText.includes('업그레이드')) {
      handlePhoneUpgrade();
      return;
    }

    await processMessage(text);
  };
    await processMessage(text);
  };return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎤 음성 AI v3.0 + 📞 전화 통합
          </h1>
          <p className="text-gray-600">완전 핸즈프리 + 전화 편의성 + 명함 자동 공유</p>
          
          {phoneMode && (
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <span className="text-green-800 font-semibold">📞 전화 모드 활성화</span>
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={toggleListening}
            className={`p-4 rounded-full transition-all ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 scale-110' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white shadow-lg`}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          <button
            onClick={() => setPhoneMode(!phoneMode)}
            className={`p-4 rounded-full transition-all ${
              phoneMode 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-gray-500 hover:bg-gray-600'
            } text-white shadow-lg`}
          >
            {phoneMode ? <PhoneCall size={24} /> : <Phone size={24} />}
          </button>

          <button
            onClick={shareBusinessCard}
            className="p-4 rounded-full bg-purple-500 hover:bg-purple-600 text-white shadow-lg transition-all hover:scale-110"
            title="N 버튼 - 명함 자동 공유"
          >
            <span className="font-bold text-lg">N</span>
          </button>

          <button
            onClick={() => setShowCardForm(!showCardForm)}
            className="p-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg transition-all"
          >
            <Users size={24} />
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 h-96 overflow-y-auto mb-6">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`mb-4 ${
              chat.type === 'user' ? 'text-right' : 
              chat.type === 'thinking' ? 'text-center' : 'text-left'
            }`}>
              <div className={`inline-block p-3 rounded-lg max-w-xs ${
                chat.type === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : chat.type === 'thinking'
                  ? 'bg-yellow-200 text-yellow-800'
                  : 'bg-white border'
              }`}>
                {chat.message}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-xl">
          <h3 className="font-bold text-lg mb-3">🚀 새로운 전화 통합 기능들</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong>📞 전화 모드:</strong> 통화 중 실시간 AI 도움</div>
            <div><strong>🎤 음성 요약:</strong> 통화 내용 자동 정리</div>
            <div><strong>👥 N 버튼:</strong> 명함 자동 공유 (근거리)</div>
            <div><strong>⚡ 자율 업그레이드:</strong> 요청시 기능 자동 추가</div>
          </div>
        </div>
      </div>
    </div>
  );
};
};

export default PhoneEnhancedVoiceAI;
export default PhoneEnhancedVoiceAI;
