import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { authOptions } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

// Credit pack definitions
const CREDIT_PACKS = {
  starter: { credits: 50, priceInCents: 500, name: 'Starter Pack' },
  pro: { credits: 250, priceInCents: 2000, name: 'Pro Pack' },
  power: { credits: 700, priceInCents: 5000, name: 'Power Pack' },
} as const;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { packId } = await req.json();

    if (!packId || !(packId in CREDIT_PACKS)) {
      return NextResponse.json({ error: 'Invalid pack' }, { status: 400 });
    }

    const pack = CREDIT_PACKS[packId as keyof typeof CREDIT_PACKS];

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: pack.name,
              description: `${pack.credits} credits for LLM Compare`,
            },
            unit_amount: pack.priceInCents,
          },
          quantity: 1,
        },
      ],
      customer_email: session.user.email,
      metadata: {
        credits: pack.credits.toString(),
        userEmail: session.user.email,
      },
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
