import { stripePromise, STRIPE_CONFIG } from '../config/stripe';
import { authService } from './authService';

export interface PaymentSession {
  sessionId: string;
  url: string;
}

export const paymentService = {
  // Create checkout session for premium subscription
  async createCheckoutSession(planType: 'monthly' | 'annual', userId: string): Promise<PaymentSession> {
    try {
      // In a real application, this would call your backend API
      // For demo purposes, we'll simulate the process
      
      const plan = STRIPE_CONFIG.plans[planType];
      
      // This would typically be a call to your backend
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          userId: userId,
          successUrl: `${window.location.origin}/premium/success`,
          cancelUrl: `${window.location.origin}/premium`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const session = await response.json();
      return session;
    } catch (error) {
      console.error('Payment service error:', error);
      throw new Error('Failed to initiate payment process');
    }
  },

  // Redirect to Stripe Checkout
  async redirectToCheckout(sessionId: string): Promise<void> {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      throw error;
    }
  },

  // Handle successful payment (webhook would typically handle this)
  async handleSuccessfulPayment(userId: string, stripeCustomerId: string): Promise<void> {
    await authService.updatePremiumStatus(userId, true, stripeCustomerId);
  },

  // Cancel subscription
  async cancelSubscription(userId: string): Promise<void> {
    try {
      // This would call your backend to cancel the Stripe subscription
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      await authService.updatePremiumStatus(userId, false);
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw new Error('Failed to cancel subscription');
    }
  }
};