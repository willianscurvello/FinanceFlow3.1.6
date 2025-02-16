import React, { useState } from 'react';
import { Search, MessageCircle, Book, HelpCircle, Send } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FaqItem[] = [
  {
    question: "How do I submit an expense report?",
    answer: "To submit an expense report, go to the Dashboard and click the 'New Expense' button. Fill in the required details and attach your receipt. Your report will be sent for approval automatically.",
    category: "Expenses"
  },
  {
    question: "What file types are supported for receipts?",
    answer: "We support JPG, PNG, and PDF files for receipt uploads. The maximum file size is 10MB per receipt.",
    category: "Receipts"
  },
  {
    question: "How long does expense approval take?",
    answer: "Typically, expenses are approved within 1-2 business days. You'll receive an email notification once your expense has been approved or if additional information is needed.",
    category: "Approval Process"
  },
  {
    question: "Can I edit a submitted expense?",
    answer: "You can edit an expense report only if it hasn't been approved yet. Go to the expense details and click the 'Edit' button to make changes.",
    category: "Expenses"
  },
  {
    question: "How do I change my company information?",
    answer: "Company administrators can update company information from the Companies page. Click on your company name and select 'Edit' to modify the details.",
    category: "Company Management"
  }
];

export function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  });

  const categories = ['All', ...new Set(faqs.map(faq => faq.category))];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the message to your support system
    console.log('Support message sent:', contactForm);
    setContactForm({ subject: '', message: '' });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support Center</h1>
      </div>

      {/* Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <Book className="h-6 w-6 text-primary-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Knowledge Base</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Browse our comprehensive guides and tutorials</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <MessageCircle className="h-6 w-6 text-primary-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Live Chat</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Chat with our support team in real-time</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <HelpCircle className="h-6 w-6 text-primary-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">FAQ</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Find answers to common questions</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-primary-600 bg-primary-100 dark:bg-primary-900 dark:text-primary-300 rounded">
                  {faq.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Contact Support
        </h2>
        
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={contactForm.subject}
              onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <textarea
              id="message"
              value={contactForm.message}
              onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
