import React from 'react';
import { ArrowLeft, Users, Target, Shield, Zap, Heart, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const AboutUs = () => {
  const navigate = useNavigate();

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
            <h1 className="text-3xl font-bold text-gray-900">About FitCode</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-cyan-400 via-purple-500 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Revolutionizing Fitness Technology</h2>
          <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
            FitCode is a cutting-edge gym management platform that bridges the gap between traditional fitness and modern technology, making workouts more accessible, engaging, and effective for everyone.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Mission Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At FitCode, we believe that fitness should be accessible, engaging, and personalized for everyone. Our mission is to transform the traditional gym experience by leveraging cutting-edge technology to create a seamless, interactive, and educational fitness environment.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We're committed to helping gym owners modernize their facilities and empowering fitness enthusiasts to achieve their goals through innovative QR-based machine guidance, comprehensive workout tracking, and personalized fitness insights.
            </p>
          </div>
        </section>

        {/* Vision Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We envision a future where every gym is a smart, connected fitness ecosystem where technology enhances rather than replaces the human experience. A world where fitness education is instant, workouts are optimized, and progress is measurable and motivating.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Through our platform, we're building the foundation for the next generation of fitness technology that will make working out more effective, enjoyable, and accessible to people of all fitness levels and backgrounds.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-3 rounded-lg mr-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900">Community First</h4>
              </div>
              <p className="text-gray-700">
                We believe in building strong communities around fitness, connecting gym owners, trainers, and members in meaningful ways.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-3 rounded-lg mr-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900">Innovation</h4>
              </div>
              <p className="text-gray-700">
                We constantly push the boundaries of what's possible in fitness technology, always looking for new ways to improve the user experience.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-3 rounded-lg mr-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900">Trust & Security</h4>
              </div>
              <p className="text-gray-700">
                We prioritize the security and privacy of our users' data, implementing the highest standards of protection and transparency.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-3 rounded-lg mr-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900">Accessibility</h4>
              </div>
              <p className="text-gray-700">
                We're committed to making fitness technology accessible to everyone, regardless of their technical expertise or fitness level.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-3 rounded-lg mr-4">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900">Passion</h4>
              </div>
              <p className="text-gray-700">
                Our team is passionate about fitness and technology, and we channel that passion into creating exceptional products and experiences.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-3 rounded-lg mr-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900">Excellence</h4>
              </div>
              <p className="text-gray-700">
                We strive for excellence in everything we do, from product development to customer support and user experience.
              </p>
            </div>
          </div>
        </section>

                 {/* Story Section */}
         <section className="mb-16">
           <div className="bg-white rounded-lg shadow-sm border p-8">
             <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h3>
             <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
               <p>
                 FitCode was born from a simple observation: while gyms were filled with advanced equipment, many members struggled to use them effectively. Traditional paper-based instructions were often lost, outdated, or difficult to follow, leading to suboptimal workouts and potential safety risks.
               </p>
               <p>
                 Our founder, Sanket Patil, a passionate fitness enthusiast and technology expert, recognized the opportunity to bridge this gap. With a vision to revolutionize the fitness industry, Sanket envisioned a platform that would make gym equipment more accessible and educational through the power of QR codes and mobile technology.
               </p>
               <p>
                 What started as a simple QR code system has evolved into a comprehensive gym management platform that serves both gym owners and members. Today, FitCode is helping gyms around the world modernize their facilities and providing members with the tools they need to achieve their fitness goals.
               </p>
               <p>
                 We're proud of how far we've come, but we're even more excited about the future. As technology continues to evolve, so does our platform, always with the goal of making fitness more accessible, effective, and enjoyable for everyone.
               </p>
             </div>
           </div>
         </section>

         {/* Founder Section */}
         <section className="mb-16">
           <div className="bg-white rounded-lg shadow-sm border p-8">
             <h3 className="text-3xl font-bold text-gray-900 mb-6">Meet Our Founder</h3>
             <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
               <div className="flex-shrink-0">
                 <div className="w-48 h-48 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                   <span className="text-4xl font-bold text-white">SP</span>
                 </div>
               </div>
               <div className="flex-1">
                 <h4 className="text-2xl font-bold text-gray-900 mb-4">Sanket Patil</h4>
                 <p className="text-lg text-gray-700 mb-4">
                   Founder & CEO of FitCode
                 </p>
                 <p className="text-gray-700 leading-relaxed mb-4">
                   Sanket Patil is a visionary entrepreneur with a deep passion for fitness and technology. With years of experience in software development and a strong background in fitness, Sanket recognized the need for a more intelligent and user-friendly approach to gym equipment management.
                 </p>
                 <p className="text-gray-700 leading-relaxed mb-4">
                   His vision for FitCode was born from personal experience - seeing gym members struggle with complex equipment and outdated instruction methods. This inspired him to create a platform that would bridge the gap between traditional fitness and modern technology.
                 </p>
                 <p className="text-gray-700 leading-relaxed">
                   Under Sanket's leadership, FitCode has grown from a simple concept to a comprehensive platform that's transforming how gyms operate and how members interact with fitness equipment. His commitment to innovation and user experience continues to drive the company's success.
                 </p>
               </div>
             </div>
           </div>
         </section>

                 {/* Team Section */}
         <section className="mb-16">
           <div className="bg-white rounded-lg shadow-sm border p-8">
             <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Team</h3>
             <p className="text-lg text-gray-700 mb-8">
               FitCode is powered by a diverse team of fitness professionals, software engineers, designers, and business experts who share a common passion for revolutionizing the fitness industry through technology. Led by our visionary founder, Sanket Patil, our team is committed to delivering exceptional experiences for gym owners and members alike.
             </p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                 <h4 className="text-xl font-semibold text-gray-900 mb-4">Leadership</h4>
                 <p className="text-gray-700">
                   Under Sanket Patil's leadership, our team brings together decades of experience in fitness, technology, and business, guiding our mission to transform the gym experience.
                 </p>
               </div>
               <div>
                 <h4 className="text-xl font-semibold text-gray-900 mb-4">Development</h4>
                 <p className="text-gray-700">
                   Our engineering team is constantly innovating, building robust and scalable solutions that power the future of fitness technology.
                 </p>
               </div>
               <div>
                 <h4 className="text-xl font-semibold text-gray-900 mb-4">Design</h4>
                 <p className="text-gray-700">
                   Our design team creates intuitive and beautiful user experiences that make fitness technology accessible to everyone.
                 </p>
               </div>
               <div>
                 <h4 className="text-xl font-semibold text-gray-900 mb-4">Support</h4>
                 <p className="text-gray-700">
                   Our customer support team is dedicated to ensuring that every gym owner and member has the best possible experience with our platform.
                 </p>
               </div>
             </div>
           </div>
         </section>

        {/* Contact Section */}
        <section>
          <div className="bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg p-8 text-white text-center">
            <h3 className="text-3xl font-bold mb-4">Join the FitCode Revolution</h3>
            <p className="text-xl mb-6 text-cyan-100">
              Ready to transform your gym experience? Get in touch with us today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                className="border-white text-black hover:bg-white hover:text-purple-600"
                // Registration via Google only; navigation removed
              >
                For Gym Owners
              </Button>
              <Button
                variant="outline"
                className="border-white text-black hover:bg-white hover:text-purple-600"
                // Registration via Google only; navigation removed
              >
                For Members
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;