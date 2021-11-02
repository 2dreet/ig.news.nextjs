import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import Stripe from 'stripe';
import { stripe } from '../../services/stripe';
import { saveSubscription } from './_lib/manageSubscription';

// aqui tratamos o buffer que o stripe manda
// ele manda por stream: quer dizer que não manda tudo de uma vez
// manda aos poucos
async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === "string" ? Buffer.from(chunk) : chunk
    );
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false
  }
}

// aqui colocamos quais eventos vamos receber
const relevantEvents = new Set([
  'checkout.session.completed'
])

// eslint-disable-next-line
export default async (request: NextApiRequest, response: NextApiResponse) => {
  // aqui aceitamos apenas Request do tipo POST
  if(request.method === 'POST') {
    // aqui capturamos o buffer do stripe
    const buf = await buffer(request);
    // aqui obtemos a secret do stripe que veio no headers
    const secret = request.headers['stripe-signature'];

    let event: Stripe.Event;
    try {
      // aqui validamos se a resquest e a secret são validas 
      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      return response.status(400).send(`Webhook error: ${err.message}`);
    }

    // obtemos o type do evento
    const { type } = event;
    // aqui verificamos se o type esta na variavel que configuramos lá em cima para
    // aceitar apenas alguns eventos
    if(relevantEvents.has(type)){
      try {
        // switch para facilitar percorer os valores vindos
        switch (type) {
          case 'checkout.session.completed':
            // aqui obtemos a checkoutSession tipada
            const checkoutSession = event.data.object as Stripe.Checkout.Session;
            
            // aqui chamamos a funcao de criar a subscription no banco
            await saveSubscription (
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString()
            );

            break;
          default:
            // caso venha um evento não tratado retornamos um erro
            throw new Error('Unhandled event.')  ;
        }  
      } catch (error) {
        // caso de erro em alguma coisa retornamos um erro mas com o status 200, para que o stripe
        // não fique tentando enviar a request toda hora
        return response.json({error: 'Webhook handler failed.'});        
      }
    }

    response.json({ received: true });
  } else {
    response.setHeader('Allow', 'POST');
    response.status(405).end('Method not allowed');
  }
}