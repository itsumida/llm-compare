import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { addCredits } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const userEmail = session.metadata?.userEmail;
    const credits = parseInt(session.metadata?.credits || '0', 10);
    const amountCents = session.amount_total || 0;

    if (userEmail && credits > 0) {
      try {
        await addCredits(userEmail, credits, session.id, amountCents);
        console.log(`Added ${credits} credits for ${userEmail}`);
      } catch (error) {
        console.error('Failed to add credits:', error);
        return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
