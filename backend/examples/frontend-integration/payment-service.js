/**
 * Payment Service for ThreeFold Cloud Marketplace
 * 
 * This file demonstrates how to integrate Stripe Elements for payment processing
 * with the ThreeFold Cloud Marketplace backend.
 */

import apiClient from './api-client';

class PaymentService {
  constructor() {
    this.stripe = null;
    this.elements = null;
    this.card = null;
    this.paymentMethodId = null;
  }

  /**
   * Initialize Stripe
   */
  async initialize(stripePublicKey) {
    // Load Stripe.js
    if (!window.Stripe) {
      await this.loadStripeScript();
    }

    // Initialize Stripe
    this.stripe = window.Stripe(stripePublicKey);
    return this.stripe;
  }

  /**
   * Load Stripe.js script
   */
  loadStripeScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load Stripe.js'));
      document.head.appendChild(script);
    });
  }

  /**
   * Mount Stripe Elements
   */
  mountCardElement(elementId, options = {}) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    // Create Elements instance
    this.elements = this.stripe.elements();

    // Create and mount the Card Element
    this.card = this.elements.create('card', {
      style: {
        base: {
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        },
        ...options
      }
    });

    this.card.mount(`#${elementId}`);
    return this.card;
  }

  /**
   * Create payment method
   */
  async createPaymentMethod(billingDetails = {}) {
    if (!this.stripe || !this.card) {
      throw new Error('Stripe or Card Element not initialized');
    }

    const result = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.card,
      billing_details: billingDetails
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    this.paymentMethodId = result.paymentMethod.id;
    return result.paymentMethod;
  }

  /**
   * Process payment
   */
  async processPayment(amount, currency = 'usd', description = '') {
    try {
      // Create payment intent on the server
      const { clientSecret } = await apiClient.createPaymentIntent({
        amount,
        currency,
        description
      });

      // Confirm the payment
      const result = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: this.paymentMethodId
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.paymentIntent;
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw error;
    }
  }

  /**
   * Save payment method
   */
  async savePaymentMethod() {
    if (!this.paymentMethodId) {
      throw new Error('No payment method available');
    }

    try {
      return await apiClient.request('/payments/methods', {
        method: 'POST',
        body: JSON.stringify({
          paymentMethodId: this.paymentMethodId
        })
      });
    } catch (error) {
      console.error('Failed to save payment method:', error);
      throw error;
    }
  }

  /**
   * Get saved payment methods
   */
  async getSavedPaymentMethods() {
    try {
      const response = await apiClient.getPaymentMethods();
      return response.paymentMethods || [];
    } catch (error) {
      console.error('Failed to get payment methods:', error);
      throw error;
    }
  }

  /**
   * Delete payment method
   */
  async deletePaymentMethod(paymentMethodId) {
    try {
      return await apiClient.request(`/payments/methods/${paymentMethodId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Failed to delete payment method:', error);
      throw error;
    }
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory() {
    try {
      const response = await apiClient.getTransactionHistory();
      return response.transactions || [];
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      throw error;
    }
  }
}

// Create payment service instance
const paymentService = new PaymentService();

// Export the service
export default paymentService;