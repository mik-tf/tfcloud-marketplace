import { Request, Response } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { MongoService } from '../services/mongoService';

dotenv.config();

export class PaymentController {
  private stripe: Stripe;
  private mongoService: MongoService;
  private webhookSecret: string;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16'
    });
    this.mongoService = new MongoService();
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  }

  /**
   * Create a payment intent
   */
  public createPaymentIntent = async (req: Request, res: Response) => {
    try {
      const userId = req.auth?.sub;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { amount, currency, description } = req.body;
      
      if (!amount || !currency) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Get user from database
      const user = await this.mongoService.getUserProfile(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Create payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        description,
        metadata: {
          userId,
          userEmail: user.email
        }
      });
      
      res.status(200).json({
        clientSecret: paymentIntent.client_secret
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: 'Failed to create payment intent' });
    }
  };

  /**
   * Get user's payment methods
   */
  public getPaymentMethods = async (req: Request, res: Response) => {
    try {
      const userId = req.auth?.sub;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // TODO: Implement getCustomerPaymentMethods in a separate Stripe service
      // For now, return a placeholder response
      res.status(200).json({
        paymentMethods: [],
        message: 'Payment method listing functionality will be implemented in a future update'
      });
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      res.status(500).json({ error: 'Failed to fetch payment methods' });
    }
  };

  /**
   * Add a payment method
   */
  public addPaymentMethod = async (req: Request, res: Response) => {
    try {
      const userId = req.auth?.sub;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { paymentMethodId } = req.body;
      
      if (!paymentMethodId) {
        return res.status(400).json({ error: 'Missing payment method ID' });
      }

      // TODO: Implement addCustomerPaymentMethod in a separate Stripe service
      // For now, return a not implemented response
      res.status(501).json({ 
        error: 'Not implemented yet',
        message: 'Payment method addition functionality will be implemented in a future update'
      });
    } catch (error) {
      console.error('Error adding payment method:', error);
      res.status(500).json({ error: 'Failed to add payment method' });
    }
  };

  /**
   * Delete a payment method
   */
  public deletePaymentMethod = async (req: Request, res: Response) => {
    try {
      const userId = req.auth?.sub;
      const paymentMethodId = req.params.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!paymentMethodId) {
        return res.status(400).json({ error: 'Missing payment method ID' });
      }

      // TODO: Implement deleteCustomerPaymentMethod in a separate Stripe service
      // For now, return a not implemented response
      res.status(501).json({ 
        error: 'Not implemented yet',
        message: 'Payment method deletion functionality will be implemented in a future update'
      });
    } catch (error) {
      console.error('Error deleting payment method:', error);
      res.status(500).json({ error: 'Failed to delete payment method' });
    }
  };

  /**
   * Get user's transaction history
   */
  public getTransactionHistory = async (req: Request, res: Response) => {
    try {
      const userId = req.auth?.sub;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // TODO: Implement getCustomerTransactions in a separate Stripe service
      // For now, return a placeholder response
      res.status(200).json({
        transactions: [],
        message: 'Transaction history functionality will be implemented in a future update'
      });
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      res.status(500).json({ error: 'Failed to fetch transaction history' });
    }
  };

  /**
   * Handle Stripe webhook events
   */
  public handleWebhook = async (req: Request, res: Response) => {
    try {
      const sig = req.headers['stripe-signature'] as string;
      
      if (!sig) {
        return res.status(400).json({ error: 'Missing Stripe signature' });
      }

      // Verify webhook signature
      let event: Stripe.Event;
      
      try {
        event = this.stripe.webhooks.constructEvent(
          req.body,
          sig,
          this.webhookSecret
        );
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return res.status(400).json({ error: 'Invalid signature' });
      }

      // Handle different event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
          break;
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).json({ error: 'Failed to handle webhook' });
    }
  };

  /**
   * Handle payment intent succeeded event
   */
  private handlePaymentIntentSucceeded = async (paymentIntent: Stripe.PaymentIntent) => {
    try {
      const userId = paymentIntent.metadata.userId;
      
      if (!userId) {
        console.error('Payment intent missing userId in metadata');
        return;
      }

      // TODO: Implement payment success handling
      console.log(`Payment succeeded for user ${userId}`);
    } catch (error) {
      console.error('Error handling payment intent succeeded:', error);
      throw error;
    }
  };

  /**
   * Handle payment intent failed event
   */
  private handlePaymentIntentFailed = async (paymentIntent: Stripe.PaymentIntent) => {
    try {
      const userId = paymentIntent.metadata.userId;
      
      if (!userId) {
        console.error('Payment intent missing userId in metadata');
        return;
      }

      // TODO: Implement payment failure handling
      console.log(`Payment failed for user ${userId}`);
    } catch (error) {
      console.error('Error handling payment intent failed:', error);
      throw error;
    }
  };

  /**
   * Handle subscription created event
   */
  private handleSubscriptionCreated = async (subscription: Stripe.Subscription) => {
    try {
      // TODO: Implement subscription created handling
      console.log(`Subscription created: ${subscription.id}`);
    } catch (error) {
      console.error('Error handling subscription created:', error);
      throw error;
    }
  };

  /**
   * Handle subscription updated event
   */
  private handleSubscriptionUpdated = async (subscription: Stripe.Subscription) => {
    try {
      // TODO: Implement subscription updated handling
      console.log(`Subscription updated: ${subscription.id}`);
    } catch (error) {
      console.error('Error handling subscription updated:', error);
      throw error;
    }
  };

  /**
   * Handle subscription deleted event
   */
  private handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
    try {
      // TODO: Implement subscription deleted handling
      console.log(`Subscription deleted: ${subscription.id}`);
    } catch (error) {
      console.error('Error handling subscription deleted:', error);
      throw error;
    }
  };
}