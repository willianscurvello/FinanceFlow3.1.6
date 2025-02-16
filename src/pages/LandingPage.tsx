import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Receipt, Building2, PieChart, Shield } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">FinanceFlow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white px-3 py-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Simplify Your{' '}
              <span className="text-primary-600">Expense Management</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Streamline your company's expense tracking and reimbursement process with our modern financial management system.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <Link
                to="/register"
                className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="mt-32">
            <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Features that set us apart
            </h2>
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <Feature
                icon={Receipt}
                title="Receipt Tracking"
                description="Easily upload and track receipts with our OCR technology"
              />
              <Feature
                icon={Building2}
                title="Multi-Company Support"
                description="Manage expenses across multiple companies and departments"
              />
              <Feature
                icon={PieChart}
                title="Advanced Analytics"
                description="Get detailed insights into your company's spending patterns"
              />
              <Feature
                icon={Shield}
                title="Secure & Compliant"
                description="Bank-level security with full audit trail and compliance"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Feature({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="pt-6">
      <div className="flow-root rounded-lg bg-gray-50 dark:bg-gray-800 px-6 pb-8">
        <div className="-mt-6">
          <div>
            <span className="inline-flex items-center justify-center rounded-md bg-primary-600 p-3 shadow-lg">
              <Icon className="h-6 w-6 text-white" aria-hidden="true" />
            </span>
          </div>
          <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="mt-5 text-base text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
}
