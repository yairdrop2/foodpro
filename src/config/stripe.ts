import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51RdMyM4FB7HJdIMzOaCNw3EC2FleRZL79a0Pv0Vn78RsDTJHKEVU55PjxLVArUh3j9S3Azha6AH2xAoEW3LnANo600yxewBOKi');

export { stripePromise };

// Stripe configuration
export const STRIPE_CONFIG = {
  publishableKey: 'pk_test_51RdMyM4FB7HJdIMzOaCNw3EC2FleRZL79a0Pv0Vn78RsDTJHKEVU55PjxLVArUh3j9S3Azha6AH2xAoEW3LnANo600yxewBOKi',
  plans: {
    monthly: {
      priceId: 'price_monthly_premium', // Replace with actual Stripe price ID
      amount: 999, // $9.99 in cents
      interval: 'month'
    },
    annual: {
      priceId: 'price_annual_premium', // Replace with actual Stripe price ID
      amount: 7999, // $79.99 in cents
      interval: 'year'
    }
  }
};