import React, { useState } from 'react';
import { Crown, Check, Bot, Video, Star, Zap, Users, Award, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { paymentService } from '../services/paymentService';

const PremiumPage: React.FC = () => {
  const { user, upgradeToPremium } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  const features = [
    {
      icon: <Crown className="w-6 h-6" />,
      title: 'Exclusive Premium Recipes',
      description: 'Access to 5,000+ professional chef recipes and gourmet dishes'
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: 'HD Video Tutorials',
      description: 'Step-by-step video guides from professional chefs'
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: 'AI Cooking Assistant',
      description: 'Personal AI chef powered by Gemini AI for recipe suggestions and cooking tips'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Smart Ingredient Substitutions',
      description: 'AI-powered suggestions for ingredient alternatives'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Advanced Meal Planning',
      description: 'Weekly meal plans based on your preferences and dietary needs'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Priority Support',
      description: '24/7 premium customer support and cooking assistance'
    }
  ];

  const plans = [
    {
      name: 'Monthly',
      price: '$9.99',
      period: '/month',
      description: 'Perfect for trying premium features',
      savings: null,
      popular: false,
      value: 'monthly' as const
    },
    {
      name: 'Annual',
      price: '$79.99',
      period: '/year',
      description: 'Best value - save 33%',
      savings: 'Save $39.89',
      popular: true,
      value: 'annual' as const
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      text: 'The AI cooking assistant has completely transformed how I cook. It suggests recipes based on what I have in my fridge!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      text: 'The video tutorials are incredibly detailed. I\'ve learned so many professional techniques.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
      text: 'Premium recipes are restaurant quality. My family thinks I hired a personal chef!',
      rating: 5
    }
  ];

  const handleUpgrade = async (planType: 'monthly' | 'annual') => {
    if (!user) {
      alert('Please login first to upgrade to premium');
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, we'll simulate the upgrade
      // In production, this would integrate with Stripe
      await upgradeToPremium();
      alert(`Successfully upgraded to ${planType} plan! Welcome to Food Pro Premium! 🎉`);
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('There was an error processing your upgrade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (user?.isPremium) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-accent-400 to-accent-600 text-white rounded-3xl p-12 mb-8">
              <Crown className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-4">You're Premium!</h1>
              <p className="text-xl opacity-90">
                Enjoy all premium features and exclusive recipes with AI assistance
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center mb-3">
                    <div className="bg-accent-100 text-accent-600 p-2 rounded-lg mr-3">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Crown className="w-20 h-20 mx-auto mb-6 text-accent-400" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif">
            Unlock Premium Recipes
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Access exclusive chef recipes, HD video tutorials, and AI-powered cooking assistance with Gemini AI
          </p>
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <span>50,000+ Premium Users</span>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-accent-400" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center">
              <Bot className="w-5 h-5 mr-2 text-accent-400" />
              <span>Powered by Gemini AI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif">
              Premium Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to become a master chef with AI assistance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 text-primary-600 rounded-full mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600">
              Start your premium cooking journey today with secure Stripe payments
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 ${
                  plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-end justify-center mb-2">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <span className="text-green-600 font-semibold">{plan.savings}</span>
                  )}
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </div>

                <button
                  onClick={() => handleUpgrade(plan.value)}
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {loading ? 'Processing...' : 'Start Free Trial'}
                </button>

                <div className="mt-8 space-y-4">
                  {features.slice(0, 4).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              30-day money-back guarantee • Cancel anytime • Secure payments with Stripe
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied premium users
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-accent-500 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 font-serif">
            Ready to Become a Master Chef?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start your premium journey today with AI-powered cooking assistance
          </p>
          <button
            onClick={() => handleUpgrade('annual')}
            disabled={loading}
            className="bg-accent-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-accent-600 transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center mx-auto"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            {loading ? 'Processing...' : 'Start Free Trial'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default PremiumPage;