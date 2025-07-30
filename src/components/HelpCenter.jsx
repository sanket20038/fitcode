import React, { useState } from 'react';
import { ArrowLeft, Search, ChevronDown, ChevronUp, MessageCircle, BookOpen, Video, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const HelpCenter = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const faqData = {
    'getting-started': {
      title: 'Getting Started',
      icon: <BookOpen className="h-5 w-5" />,
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'To create an account, click on the "Sign Up" button on the homepage. Choose whether you\'re a gym owner or a client, fill in your details, and follow the verification process.'
        },
        {
          question: 'What\'s the difference between gym owner and client accounts?',
          answer: 'Gym owner accounts allow you to manage your gym, add machines, generate QR codes, and view analytics. Client accounts allow you to scan QR codes, view machine instructions, and track your workout history.'
        },
        {
          question: 'Do I need any special equipment?',
          answer: 'No special equipment is required! You just need a smartphone with a camera to scan QR codes. The platform works on any modern web browser and mobile device.'
        }
      ]
    },
    'qr-codes': {
      title: 'QR Codes & Scanning',
      icon: <Video className="h-5 w-5" />,
      questions: [
        {
          question: 'How do QR codes work?',
          answer: 'Each gym machine has a unique QR code. When you scan it with your phone, you\'ll get instant access to instructions, safety tips, and video demonstrations for that specific machine.'
        },
        {
          question: 'What if the QR code doesn\'t work?',
          answer: 'Make sure you\'re using the FitCode app or website to scan the QR code. If it still doesn\'t work, try cleaning the QR code or contact the gym staff for assistance.'
        },
        {
          question: 'Can I scan QR codes without an account?',
          answer: 'You need to be logged in to scan QR codes and access machine information. This helps us track your progress and provide personalized recommendations.'
        }
      ]
    },
    'account-management': {
      title: 'Account Management',
      icon: <Users className="h-5 w-5" />,
      questions: [
        {
          question: 'How do I reset my password?',
          answer: 'Click on "Forgot Password" on the client or owner login page, enter your email address, and follow the instructions sent to your email to reset your password.'
        },
        {
          question: 'Can I change my account type?',
          answer: 'Account types (gym owner vs client) cannot be changed after registration. If you need to switch, you\'ll need to create a new account with the correct type.'
        },
        {
          question: 'How do I update my profile information?',
          answer: 'Go to your dashboard and look for the profile or settings section. You can update your personal information, preferences, and account settings there.'
        }
      ]
    },
    'troubleshooting': {
      title: 'Troubleshooting',
      icon: <MessageCircle className="h-5 w-5" />,
      questions: [
        {
          question: 'The app is loading slowly. What should I do?',
          answer: 'Try refreshing the page, clearing your browser cache, or checking your internet connection. If the problem persists, contact our support team.'
        },
        {
          question: 'I can\'t log in to my account.',
          answer: 'Double-check your username and password. If you\'ve forgotten your password, use the "Forgot Password" feature. If you\'re still having issues, contact support.'
        },
        {
          question: 'The QR scanner isn\'t working on my phone.',
          answer: 'Make sure you\'ve granted camera permissions to the app. Try refreshing the page or using a different browser. If the issue continues, contact our support team.'
        }
      ]
    }
  };

  const filteredFAQ = Object.entries(faqData).filter(([key, section]) => {
    if (!searchQuery) return true;
    return section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           section.questions.some(q => 
             q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
             q.answer.toLowerCase().includes(searchQuery.toLowerCase())
           );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-gradient-to-r from-cyan-400 to-purple-500 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">How can we help you?</h2>
          <p className="text-xl text-cyan-100 mb-8">
            Find answers to common questions and learn how to use FitCode effectively.
          </p>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {filteredFAQ.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try searching with different keywords or browse our categories below.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredFAQ.map(([sectionId, section]) => (
              <div key={sectionId} className="bg-white rounded-lg shadow-sm border">
                <button
                  onClick={() => toggleSection(sectionId)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-2 rounded-lg text-white">
                      {section.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                  </div>
                  {expandedSections[sectionId] ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                
                {expandedSections[sectionId] && (
                  <div className="border-t border-gray-200">
                    {section.questions.map((item, index) => (
                      <div key={index} className="p-6 border-b border-gray-100 last:border-b-0">
                        <h4 className="font-semibold text-gray-900 mb-3">{item.question}</h4>
                        <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
          <p className="text-xl mb-6 text-cyan-100">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600"
              onClick={() => navigate('/contact')}
            >
              Contact Support
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600"
              onClick={() => navigate('/about-us')}
            >
              Learn More About FitCode
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <BookOpen className="h-12 w-12 text-cyan-500 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">User Guide</h4>
              <p className="text-gray-600 text-sm mb-4">
                Step-by-step instructions for using FitCode
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/about-us')}
              >
                Read Guide
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <Video className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Video Tutorials</h4>
              <p className="text-gray-600 text-sm mb-4">
                Watch video guides and demonstrations
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
              >
                Watch Videos
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <MessageCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Live Chat</h4>
              <p className="text-gray-600 text-sm mb-4">
                Get instant help from our support team
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/contact')}
              >
                Start Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter; 