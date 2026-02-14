import React, { useState } from 'react';
import { API_URL } from '../config/api';
import { Mail, Phone, MapPin, Send, User } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await fetch(`${API_URL}/user/contact/contactForm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', phoneNumber: '', email: '', message: '' });
      } else {
        setStatus('Failed to send message.');
      }
    } catch (error) {
      setStatus('Error connecting to server.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-w-5xl mx-auto my-10 bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden font-sans border border-gray-100 dark:border-slate-800">

      {/* Left Side: Form */}
      <div className="p-10 md:w-1/2">
        <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">Get in Touch</p>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4 italic">Let's Chat, Contact with Us</h1>
        <p className="text-gray-500 dark:text-slate-400 mb-8">
          Have any questions or feedback? We're here to help. Send us a message, we'll get back within 24 hours.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="text" name="name" placeholder="Full Name" required
                value={formData.name} onChange={handleChange}
                className="w-full pl-10 p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email" name="email" placeholder="yourname@example.com" required
                value={formData.email} onChange={handleChange}
                className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Phone number</label>
              <input
                type="text" name="phoneNumber" placeholder="+91 98xx78xx70" required
                value={formData.phoneNumber} onChange={handleChange}
                className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Message</label>
            <textarea
              name="message" rows="4" placeholder="Type your message" required
              value={formData.message} onChange={handleChange}
              className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
          >
            <Send size={18} /> Send Message
          </button>

          {status && (
            <p className={`text-center mt-2 text-sm font-medium ${status.includes('success') ? 'text-green-500' : 'text-blue-500'}`}>
              {status}
            </p>
          )}
        </form>
      </div>

      {/* Right Side: Info Cards */}
      <div className="bg-gray-50 dark:bg-slate-800/50 p-10 md:w-1/2 flex flex-col justify-center gap-6 border-l border-gray-100 dark:border-slate-800">
        <div className="rounded-3xl overflow-hidden mb-4 bg-white dark:bg-slate-800 p-4 shadow-sm">
          {/* Illustration Placeholder */}
          <div className="aspect-video bg-blue-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
            <span className="text-blue-500 dark:text-blue-400 font-bold">Illustration Here</span>
          </div>
        </div>

        {/* Info Card: Email */}
        <div className="bg-slate-800 dark:bg-slate-900 p-5 rounded-2xl flex items-center gap-4 text-white hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="bg-slate-700 dark:bg-slate-800 p-3 rounded-xl">
            <Mail size={24} className="text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Email</p>
            <p className="font-medium">atomconnect@mail.com</p>
          </div>
        </div>

        {/* Info Card: Phone */}
        <div className="bg-slate-800 dark:bg-slate-900 p-5 rounded-2xl flex items-center gap-4 text-white hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="bg-slate-700 dark:bg-slate-800 p-3 rounded-xl">
            <Phone size={24} className="text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Phone</p>
            <p className="font-medium">(+91) 7340733286</p>
          </div>
        </div>

        {/* Info Card: Address */}
        <div className="bg-slate-800 dark:bg-slate-900 p-5 rounded-2xl flex items-center gap-4 text-white hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="bg-slate-700 dark:bg-slate-800 p-3 rounded-xl">
            <MapPin size={24} className="text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Address</p>
            <p className="font-medium">Chandigarh, India</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ContactForm;