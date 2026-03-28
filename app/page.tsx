'use client'

import { useState } from 'react'
import ContactForm from './components/ContactForm'

export default function Home() {
  const [showForm, setShowForm] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32 max-w-6xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AI Automation for <span className="text-indigo-600">Your Business</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Save 20+ hours per week. Cut operational costs by 40%. Scale without hiring.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition"
          >
            Get Started - 500€
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Why Automation?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cost Savings */}
            <div className="p-8 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-4">Cost Savings</h3>
              <p className="text-gray-600">
                Reduce manual labor costs by up to 40%. Eliminate repetitive tasks that drain your budget.
              </p>
            </div>

            {/* Time Savings */}
            <div className="p-8 rounded-lg bg-green-50 border border-green-200">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-xl font-bold mb-4">Time Savings</h3>
              <p className="text-gray-600">
                Free up 20+ hours per week. Let your team focus on high-value work instead of admin tasks.
              </p>
            </div>

            {/* ROI */}
            <div className="p-8 rounded-lg bg-purple-50 border border-purple-200">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-4">Fast ROI</h3>
              <p className="text-gray-600">
                Pay for itself in 2-3 weeks. Measurable results from day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Simple Pricing</h2>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto border-2 border-indigo-600">
            <h3 className="text-2xl font-bold mb-4">AI Automation Project</h3>
            <div className="text-5xl font-bold text-indigo-600 mb-6">€500</div>
            <ul className="text-left mb-8 space-y-3">
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Custom workflow analysis</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>AI system implementation</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>2 weeks of support</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Training for your team</span>
              </li>
            </ul>
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Start Your Project
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Operations?</h2>
          <p className="text-lg mb-8">
            Let's talk about how AI can save you time and money.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
          >
            Schedule a Free Consultation
          </button>
        </div>
      </section>

      {/* Contact Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6">Let's Talk</h2>
            <ContactForm />
          </div>
        </div>
      )}
    </main>
  )
}
