import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const ALLOWED_CURRENCIES = new Set([
  'aud',
  'usd',
  'sgd',
  'gbp',
  'eur',
  'cad',
  'nzd',
]);

function getStripeClient(): Stripe | null {
  const secretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
  if (!secretKey) return null;
  return new Stripe(secretKey);
}

function resolveSafeOrigin(req: express.Request): string {
  const headerOrigin = req.headers.origin;
  if (
    typeof headerOrigin === 'string' &&
    (headerOrigin.startsWith('https://') || headerOrigin.startsWith('http://'))
  ) {
    return headerOrigin.replace(/\/+$/, '');
  }

  const referer = req.headers.referer;
  if (typeof referer === 'string') {
    try {
      const parsed = new URL(referer);
      if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
        return parsed.origin.replace(/\/+$/, '');
      }
    } catch {
      // ignore invalid referer header
    }
  }

  const appUrl = (process.env.APP_URL || '').trim();
  if (appUrl.startsWith('https://') || appUrl.startsWith('http://')) {
    return appUrl.replace(/\/+$/, '');
  }

  const host = req.get('x-forwarded-host') || req.get('host');
  const proto = req.get('x-forwarded-proto') || req.protocol || 'http';
  if (host) {
    return `${proto}://${host}`.replace(/\/+$/, '');
  }

  return `http://localhost:${PORT}`;
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json());

  app.get('/api/stripe/config', (_req, res) => {
    const secretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
    const paymentLinkUrl = (process.env.VITE_STRIPE_DONATION_URL || '').trim();
    res.json({
      checkoutEnabled: Boolean(secretKey),
      paymentLinkUrl,
    });
  });

  app.post('/api/stripe/create-checkout-session', async (req, res) => {
    const stripe = getStripeClient();
    if (!stripe) {
      res.status(503).json({
        error: 'Stripe secret key is not configured on the server.',
      });
      return;
    }

    const rawAmount = Number(req.body?.amount);
    if (!Number.isFinite(rawAmount) || rawAmount < 1 || rawAmount > 500) {
      res.status(400).json({
        error: 'Please enter a valid tip amount between 1 and 500.',
      });
      return;
    }

    const requestedCurrency =
      typeof req.body?.currency === 'string'
        ? req.body.currency.trim().toLowerCase()
        : 'aud';
    const currency = ALLOWED_CURRENCIES.has(requestedCurrency)
      ? requestedCurrency
      : 'aud';

    const unitAmount = Math.round(rawAmount * 100);
    const origin = resolveSafeOrigin(req);

    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        submit_type: 'donate',
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: 'Support PocketWage',
                description:
                  'Optional supporter tip for PocketWage salary, casual payroll & tax calculator',
              },
              unit_amount: unitAmount,
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/?donation=success`,
        cancel_url: `${origin}/?donation=cancelled`,
      });

      if (!session.url) {
        res.status(500).json({
          error: 'Stripe did not return a Checkout URL.',
        });
        return;
      }

      res.json({ url: session.url });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create Stripe Checkout session.';
      console.error('Stripe checkout session error:', message);
      res.status(500).json({ error: message });
    }
  });

  const httpServer = http.createServer(app);
  const distDir = path.resolve(__dirname, 'dist');
  const distIndexPath = path.join(distDir, 'index.html');
  const isTsxRuntime = process.execArgv.some((arg) => arg.includes('tsx'));
  const isDevLifecycle = process.env.npm_lifecycle_event === 'dev';
  const useProductionAssets =
    process.env.NODE_ENV === 'production' ||
    (!isTsxRuntime && !isDevLifecycle && fs.existsSync(distIndexPath));

  if (!useProductionAssets) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: { server: httpServer },
        ws: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distDir));
    app.get(/^\/(?!api\/).*/, (_req, res) => {
      res.sendFile(distIndexPath);
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`PocketWage server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start PocketWage server:', err);
  process.exit(1);
});
