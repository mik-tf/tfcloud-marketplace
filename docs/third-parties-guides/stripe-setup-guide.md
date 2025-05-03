# Stripe Setup Guide for ThreeFold Cloud Marketplace

This guide provides step-by-step instructions for setting up Stripe payment processing for the ThreeFold Cloud Marketplace. It explains how to create a Stripe account, obtain the necessary API keys, set up webhooks, and configure the required environment variables.

## Table of Contents

- [Stripe Setup Guide for ThreeFold Cloud Marketplace](#stripe-setup-guide-for-threefold-cloud-marketplace)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Creating a Stripe Account](#creating-a-stripe-account)
  - [Getting Your Stripe Secret Key](#getting-your-stripe-secret-key)
  - [Setting Up Webhooks](#setting-up-webhooks)
    - [Step 1: Select events](#step-1-select-events)
    - [Step 2: Choose destination type](#step-2-choose-destination-type)
    - [Step 3: Configure your destination](#step-3-configure-your-destination)
  - [Configuring Environment Variables](#configuring-environment-variables)
  - [Testing the Integration](#testing-the-integration)
  - [Going Live](#going-live)
  - [Troubleshooting](#troubleshooting)
    - [Payment Processing Issues](#payment-processing-issues)
    - [Webhook Issues](#webhook-issues)
    - [Still Having Issues?](#still-having-issues)

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Access to the ThreeFold Cloud Marketplace backend code
- A business email address

## Creating a Stripe Account

1. Go to [Stripe's website](https://stripe.com) and click "Start now" or "Create account"
2. Fill in the registration form with your email, name, and password
3. Verify your email address by clicking the link sent to your email
4. Complete the account setup process:
   - Provide your business details
   - Set up your business address
   - Connect your bank account (required for receiving payments)

> **Note**: For development purposes, you can use Stripe in test mode without completing all the business verification steps.

## Getting Your Stripe Secret Key

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com/)
2. Ensure you're in the correct mode:
   - For development: Use **Test Mode** (toggle in the dashboard)
   - For production: Use **Live Mode**
3. Navigate to **Developers > API keys** in the left sidebar
4. You'll see two types of keys:
   - **Publishable key**: Used for frontend integration (not needed for our backend setup)
   - **Secret key**: Used for backend API calls
5. Click "Reveal test key" to view your Secret Key
6. Copy this key - this will be your `STRIPE_SECRET_KEY` environment variable

> **Important**: Keep your Secret Key confidential. Never expose it in client-side code or commit it to version control.

## Setting Up Webhooks

Webhooks allow Stripe to notify your application about events like successful payments, failed charges, or subscription updates.

1. In your Stripe Dashboard, navigate to **Developers > Webhooks**
2. Click **Add Destination**
3. The webhook setup process has three steps:

### Step 1: Select events

Select the events to listen for. Important events include:
- `payment_intent.succeeded` - When a payment is successfully completed
- `payment_intent.payment_failed` - When a payment attempt fails
- `payment_intent.created` - When a new payment intent is created
- `payment_intent.canceled` - When a payment intent is canceled
- `checkout.session.completed` - When a checkout session is completed
- `checkout.session.expired` - When a checkout session expires
- `invoice.payment_succeeded` - When an invoice is paid
- `invoice.payment_failed` - When an invoice payment fails
- `customer.subscription.created` - When a new subscription is created
- `customer.subscription.updated` - When a subscription is updated
- `customer.subscription.deleted` - When a subscription is canceled

### Step 2: Choose destination type

Select the appropriate destination type for your webhook.

### Step 3: Configure your destination

Fill in the following details:
- **Events from**: Your account
- **Payload style**: Snapshot
- **API version**: Select the latest version (e.g., 2025-04-30.basil)
- **Listening to**: Confirm the number of events you selected (e.g., 11 events)
- **Destination name**: Give your destination a name (e.g., "tfcloud-marketplace")
- **Endpoint URL**: Enter your webhook URL
  - For production: `https://your-domain.com/api/webhooks/stripe`
  - For development/testing: Stripe requires URLs to be publicly accessible. You cannot use localhost URLs directly. Here are three approaches:
    
    1. **Development Subdomain (Recommended for Teams)**:
       - Use a development subdomain of your actual domain (e.g., `https://dev.threefold.store/api/webhooks/stripe`)
       - Configure this subdomain to point to your development environment
       - This approach works well for team development and staging environments
    
    2. **Stripe CLI**:
       - For local development, use the [Stripe CLI](https://docs.stripe.com/stripe-cli) to forward webhook events
       - First, create the webhook destination with a temporary public URL (you can update it later)
       - Then run the CLI to forward events to your local server:
         ```bash
         stripe listen --forward-to http://localhost:8888/api/webhooks/stripe
         ```
       - The CLI will provide a webhook signing secret to use in your local environment
    
    3. **Tunneling Service (e.g., ngrok)**:
       - Start ngrok to create a tunnel to your local server:
         ```bash
         ngrok http 8888
         ```
       - Copy the HTTPS URL that ngrok generates (e.g., `https://a1b2c3d4.ngrok.io`)
       - Enter this URL plus your webhook path:
         `https://a1b2c3d4.ngrok.io/api/webhooks/stripe`
- **Description**: Optional description of the destination (e.g., "ThreeFold Cloud Marketplace webhook for payment processing")

4. Click **Add Destination**
5. After creating the webhook, you'll see a **Signing secret**
6. Click **Reveal** to view the signing secret
7. Copy this secret - this will be your `STRIPE_WEBHOOK_SECRET` environment variable

> **Note**: For local development:
> - If using a **development subdomain**, you'll need to set up DNS records to point to your development environment.
> - If using the **Stripe CLI**, you'll receive a webhook signing secret when you run `stripe listen`. Use this secret as your `STRIPE_WEBHOOK_SECRET` environment variable.
> - If using a tunneling service like **ngrok**, remember that the URL changes each time you restart ngrok, so you'll need to update your webhook URL in the Stripe dashboard accordingly.

## Configuring Environment Variables

1. In your project's backend directory, locate the `.env` file (or create one based on `.env.example` if it doesn't exist)
2. Update the Stripe configuration section with your keys:

```
# Stripe Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

**Important**: Never commit your `.env` file with real credentials to version control. Make sure it's included in your `.gitignore` file.

## Testing the Integration

To verify that your Stripe integration is working correctly:

1. Start the backend development server:
   ```bash
   cd backend
   npm run dev
   ```

2. Create a test payment:
   - Use the application's payment flow
   - For test payments, use Stripe's [test card numbers](https://stripe.com/docs/testing#cards):
     - Success: `4242 4242 4242 4242`
     - Failure: `4000 0000 0000 0002`

3. Check the Stripe Dashboard:
   - Navigate to **Payments** to see the test payment
   - Check **Developers > Webhooks** to verify webhook deliveries

## Going Live

When you're ready to accept real payments:

1. Complete Stripe's verification process:
   - Provide all required business information
   - Set up your bank account for payouts
   - Complete any additional verification steps required in your region

2. Switch to Live mode in the Stripe Dashboard

3. Update your environment variables with your live keys:
   - Replace the test `STRIPE_SECRET_KEY` with your live secret key
   - Set up a new webhook for your production environment and update `STRIPE_WEBHOOK_SECRET`

4. Test the live integration with a small real payment before full deployment

## Troubleshooting

### Payment Processing Issues

If payments aren't being processed correctly:

1. **Check Stripe Dashboard**: Look for failed payments and their error messages
2. **Verify API Keys**: Ensure you're using the correct secret key for your environment (test/live)
3. **Check Server Logs**: Look for any errors related to Stripe API calls
4. **Test with Stripe CLI**: Use the [Stripe CLI](https://stripe.com/docs/stripe-cli) to debug API calls:
   ```bash
   stripe listen --forward-to localhost:8888/api/webhooks/stripe
   ```

### Webhook Issues

If webhooks aren't being received:

1. **Check Webhook Destination**: Verify the URL is correct and accessible
2. **Verify Webhook Secret**: Ensure the `STRIPE_WEBHOOK_SECRET` matches the signing secret in your Stripe Dashboard
3. **Check Event Types**: Make sure you've subscribed to the necessary event types
4. **View Webhook Attempts**: In the Stripe Dashboard, check **Developers > Webhooks > [your destination]** to see delivery attempts and their status

### Still Having Issues?

If you're still experiencing problems:

1. Consult the [Stripe API Documentation](https://stripe.com/docs/api)
2. Check the [Stripe Status Page](https://status.stripe.com/) for any ongoing service issues
3. Review the Stripe integration logs in your application
4. Reach out to the project maintainers for assistance

---

By following this guide, you should have successfully set up Stripe payment processing for your ThreeFold Cloud Marketplace. The application should now be able to process payments and receive webhook notifications for payment events.