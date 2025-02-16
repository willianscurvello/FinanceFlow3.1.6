import React from 'react';
import { Check } from 'lucide-react';

export function PlansPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Plans</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PlanCard
          name="Starter"
          price="49"
          description="Perfect for small businesses just getting started"
          features={[
            'Up to 5 companies',
            '20 employees per company',
            'Basic expense tracking',
            'Email support',
            'Mobile app access',
          ]}
          buttonText="Get Started"
          popular={false}
        />
        <PlanCard
          name="Professional"
          price="99"
          description="Ideal for growing businesses with multiple teams"
          features={[
            'Up to 15 companies',
            'Unlimited employees',
            'Advanced expense tracking',
            'Priority support',
            'Custom reports',
            'API access',
            'Team management',
          ]}
          buttonText="Upgrade Now"
          popular={true}
        />
        <PlanCard
          name="Enterprise"
          price="249"
          description="Advanced features for large organizations"
          features={[
            'Unlimited companies',
            'Unlimited employees',
            'Custom workflows',
            '24/7 phone support',
            'Advanced analytics',
            'Custom integrations',
            'Dedicated account manager',
            'On-premise deployment',
          ]}
          buttonText="Contact Sales"
          popular={false}
        />
      </div>

      <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-8">
            <FaqItem
              question="How does the billing cycle work?"
              answer="Our billing cycle is monthly, starting from the day you subscribe. You can upgrade, downgrade, or cancel your subscription at any time."
            />
            <FaqItem
              question="Can I change plans later?"
              answer="Yes, you can change your plan at any time. When upgrading, you'll be charged the prorated difference for the remainder of your billing cycle."
            />
            <FaqItem
              question="Is there a free trial available?"
              answer="Yes, we offer a 14-day free trial on all plans. No credit card required during the trial period."
            />
            <FaqItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. For Enterprise plans, we also support wire transfers."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  name,
  price,
  description,
  features,
  buttonText,
  popular,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  popular: boolean;
}) {
  return (
    <div className={`relative rounded-lg shadow-lg ${
      popular ? 'border-2 border-primary-500' : 'border border-gray-200 dark:border-gray-700'
    }`}>
      {popular && (
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
          <span className="inline-flex rounded-full bg-primary-500 px-4 py-1 text-sm font-semibold text-white">
            Popular
          </span>
        </div>
      )}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
        <p className="mt-4">
          <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
            ${price}
          </span>
          <span className="text-base font-medium text-gray-500 dark:text-gray-400">
            /month
          </span>
        </p>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        <ul className="mt-6 space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex">
              <Check className="h-5 w-5 text-primary-500 shrink-0" />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                {feature}
              </span>
            </li>
          ))}
        </ul>
        <button
          className={`mt-8 w-full rounded-lg px-4 py-2 text-sm font-semibold ${
            popular
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{question}</h3>
      <p className="mt-4 text-gray-500 dark:text-gray-400">{answer}</p>
    </div>
  );
}
