import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Mic, MicOff, Send, Volume2, VolumeX, Bot, User, Download, ArrowLeft, ArrowRight, RotateCcw, Settings, Lock, Search } from 'lucide-react'
import AdminPanel from './components/AdminPanel.jsx'
import DomainAnalysis from './components/DomainAnalysis.jsx'
import './App.css'

const API_BASE_URL = 'https://nghki1c8gmzk.manus.space/api'

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Infy, your AI voice assistant for SECOINFI.\n\nI can help you with information about our blockchain business development services, data mining capabilities, investment opportunities, domain ranking analysis, and more. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallButton, setShowInstallButton] = useState(false)
  
  // Navigation state
  const [navigationSession, setNavigationSession] = useState(null)
  const [showNavigation, setShowNavigation] = useState(false)
  const [currentQuery, setCurrentQuery] = useState(null)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authCode, setAuthCode] = useState('')
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showDomainAnalysis, setShowDomainAnalysis] = useState(false)
  
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // PWA Install functionality
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  // Service Worker Registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        setShowInstallButton(false)
      }
    }
  }

  const authenticateAdmin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_code: authCode
        })
      })

      if (response.ok) {
        const data = await response.json()
        setIsAuthenticated(true)
        setShowAuthDialog(false)
        setShowAdminPanel(true)
        setAuthCode('')
        
        // Show QR code setup if provided
        if (data.qr_code) {
          console.log('QR Code setup available:', data.setup_instructions)
        }
      } else {
        alert('Invalid authentication code')
      }
    } catch (error) {
      console.error('Authentication error:', error)
      alert('Authentication failed')
    }
  }

  const startNavigation = async (topic = 'SECOINFI', initialQuery = null) => {
    try {
      const response = await fetch(`${API_BASE_URL}/navigation/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic
        })
      })

      if (response.ok) {
        const data = await response.json()
        setNavigationSession(data.session)
        setCurrentQuery(data.current_query)
        setShowNavigation(true)
        
        // Add navigation message to chat
        const navMessage = {
          id: Date.now(),
          text: data.current_query.answer,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString(),
          isNavigation: true,
          navigationData: data
        }
        setMessages(prev => [...prev, navMessage])
      }
    } catch (error) {
      console.error('Error starting navigation:', error)
      // Fallback to regular chat
      sendRegularMessage(initialQuery || 'What is SECOINFI?')
    }
  }

  const navigate = async (action) => {
    if (!navigationSession) return

    try {
      const response = await fetch(`${API_BASE_URL}/navigation/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: navigationSession.session_id
        })
      })

      if (response.ok) {
        const data = await response.json()
        setNavigationSession(data.session)
        setCurrentQuery(data.current_query)
        
        // Update the last navigation message
        setMessages(prev => {
          const newMessages = [...prev]
          const lastNavIndex = newMessages.findLastIndex(msg => msg.isNavigation)
          if (lastNavIndex !== -1) {
            newMessages[lastNavIndex] = {
              ...newMessages[lastNavIndex],
              text: data.current_query.answer,
              navigationData: data,
              timestamp: new Date().toLocaleTimeString()
            }
          }
          return newMessages
        })
      }
    } catch (error) {
      console.error('Error navigating:', error)
    }
  }

  const sendRegularMessage = async (messageText) => {
    try {
      const response = await fetch(`${API_BASE_URL}/infy/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          session_id: 'web_session_' + Date.now()
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        const botMessage = {
          id: Date.now() + 1,
          text: data.response,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString()
        }
        
        setMessages(prev => [...prev, botMessage])
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting to the server. Please try again later.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    const messageText = inputMessage
    setInputMessage('')

    // Check if message is asking for domain analysis
    if (messageText.toLowerCase().includes('domain') || 
        messageText.toLowerCase().includes('ranking') || 
        messageText.toLowerCase().includes('seo') ||
        messageText.toLowerCase().includes('analyze')) {
      
      // Check if it's a specific domain analysis request
      const domainMatch = messageText.match(/analyze\s+(?:domain\s+)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
      if (domainMatch) {
        const domain = domainMatch[1]
        const botMessage = {
          id: Date.now() + 1,
          text: `I can help you analyze the domain "${domain}". Let me open the domain analysis tool for you. You can also access it anytime by clicking the "Domain Analysis" button.`,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString()
        }
        setMessages(prev => [...prev, botMessage])
        setShowDomainAnalysis(true)
        setIsLoading(false)
        return
      }
    }

    // Check if it's a navigation request
    if (messageText.toLowerCase().includes('navigate') || 
        messageText.toLowerCase().includes('next') || 
        messageText.toLowerCase().includes('previous') ||
        messageText.toLowerCase().includes('secoinfi queries')) {
      await startNavigation('SECOINFI', messageText)
    } else {
      await sendRegularMessage(messageText)
    }

    setIsLoading(false)
  }

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
    } else {
      alert('Speech recognition is not supported in your browser')
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speakMessage = (text) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Infy AI Assistant</h1>
              <p className="text-sm text-gray-500">SECOINFI Blockchain Services</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDomainAnalysis(true)}
              className="hidden sm:flex"
            >
              <Search className="h-4 w-4 mr-2" />
              Domain Analysis
            </Button>
            
            {showInstallButton && (
              <Button variant="outline" size="sm" onClick={handleInstallClick}>
                <Download className="h-4 w-4 mr-2" />
                Install App
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAuthDialog(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Button>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Chat with Infy</CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'bot' && (
                        <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                      )}
                      {message.sender === 'user' && (
                        <User className="h-4 w-4 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                        
                        {/* Navigation Controls */}
                        {message.isNavigation && message.navigationData && (
                          <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-gray-200">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate('previous')}
                              disabled={!message.navigationData.session?.has_previous}
                            >
                              <ArrowLeft className="h-3 w-3" />
                            </Button>
                            
                            <span className="text-xs">
                              {(message.navigationData.session?.current_index || 0) + 1} / {message.navigationData.session?.total_queries || 1}
                            </span>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate('next')}
                              disabled={!message.navigationData.session?.has_next}
                            >
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startNavigation('SECOINFI')}
                            >
                              <RotateCcw className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        
                        {/* Voice Controls */}
                        {message.sender === 'bot' && (
                          <div className="flex items-center space-x-2 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => speakMessage(message.text)}
                              disabled={isSpeaking}
                            >
                              {isSpeaking ? (
                                <VolumeX className="h-3 w-3" />
                              ) : (
                                <Volume2 className="h-3 w-3" />
                              )}
                            </Button>
                            {isSpeaking && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={stopSpeaking}
                              >
                                Stop
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex items-center space-x-2">
              <div className="flex-1 flex items-center space-x-2">
                <Input
                  placeholder="Type your message or ask about domain analysis..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  disabled={isLoading}
                  className="flex-1"
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isListening ? stopListening : startListening}
                  disabled={isLoading}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4 text-red-500" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                
                <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => startNavigation('SECOINFI')}
              >
                SECOINFI Info
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDomainAnalysis(true)}
              >
                <Search className="h-3 w-3 mr-1" />
                Domain Analysis
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendRegularMessage('What are your services?')}
              >
                Our Services
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendRegularMessage('How can I contact you?')}
              >
                Contact Info
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Admin Authentication Dialog */}
      {showAuthDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Admin Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin code"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && authenticateAdmin()}
              />
              <div className="flex gap-2">
                <Button onClick={authenticateAdmin} className="flex-1">
                  Authenticate
                </Button>
                <Button variant="outline" onClick={() => setShowAuthDialog(false)}>
                  Cancel
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Use your authenticator app or enter the admin code to access the admin panel.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel
          apiBaseUrl={API_BASE_URL}
          onClose={() => setShowAdminPanel(false)}
        />
      )}

      {/* Domain Analysis Modal */}
      {showDomainAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">Domain Analysis & Ranking</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowDomainAnalysis(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <DomainAnalysis />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

