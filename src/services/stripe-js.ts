import { loadStripe } from '@stripe/stripe-js';

// lib responsavel por fazer o redirecionamento da api
export async function getStripeJs() {
  const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
  return stripeJs;
}