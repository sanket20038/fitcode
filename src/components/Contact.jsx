import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create mailto link with form data
    const mailtoLink = `mailto:fitcodeinfo1@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`
    )}`;
    
    // Open default email client
    window.open(mailtoLink, '_blank');
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
            <p className="text-lg text-gray-700 mb-8">
              Have questions about FitCode? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>

            <div className="space-y-6">
                             <div className="flex items-start space-x-4">
                 <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-3 rounded-lg">
                   <Mail className="h-6 w-6 text-white" />
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                   <p className="text-gray-700">fitcodeinfo1@gmail.com</p>
                 </div>
               </div>

               <div className="flex items-start space-x-4">
                 <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-3 rounded-lg">
                   <Phone className="h-6 w-6 text-white" />
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-1">Phone</h3>
                   <p className="text-gray-700">+91 9324608194</p>
                   <p className="text-gray-700">Mon-Fri 9AM-6PM IST</p>
                 </div>
               </div>

               <div className="flex items-start space-x-4">
                 <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-3 rounded-lg">
                   <MapPin className="h-6 w-6 text-white" />
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-1">Address</h3>
                   <p className="text-gray-700">
                     FitCode Headquarters<br />
                     India
                   </p>
                 </div>
               </div>

                             <div className="flex items-start space-x-4">
                 <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-3 rounded-lg">
                   <Clock className="h-6 w-6 text-white" />
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-1">Business Hours</h3>
                   <p className="text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                   <p className="text-gray-700">Saturday: 10:00 AM - 4:00 PM IST</p>
                   <p className="text-gray-700">Sunday: Closed</p>
                 </div>
               </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-semibold text-gray-900 mb-2">How do I get started with FitCode?</h4>
                  <p className="text-gray-700 text-sm">
                    Simply sign in with your Google account as either a gym owner or client, and follow the setup instructions provided.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="font-semibold text-gray-900 mb-2">What equipment do I need?</h4>
                  <p className="text-gray-700 text-sm">
                    You just need a smartphone with a camera to scan QR codes. No additional hardware is required.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-700">
                  Thank you for contacting us. We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="sales">Sales & Pricing</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-cyan-500 hover:to-purple-600 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </div>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Find Us</h2>
          <div className="bg-white rounded-lg shadow-sm border p-8">
                         <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg flex items-center justify-center">
               <div className="text-center">
                 <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                 <p className="text-gray-600">Interactive map will be displayed here</p>
                 <p className="text-sm text-gray-500 mt-2">
                   FitCode Headquarters, India
                 </p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 