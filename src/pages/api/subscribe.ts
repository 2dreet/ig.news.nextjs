import { query as q } from 'faunadb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { fauna } from '../../services/faunadb';
import { stripe } from '../../services/stripe';

type User = {
  ref: {
    id: string
  },
  data: {
    stripe_customer_id: string
  }
}

// eslint-disable-next-line
export default async function (request: NextApiRequest, response: NextApiResponse) {
  // aqui verificamos se é post
  if(request.method === 'POST') {
    // aqui obtem a sessao do usuario via cockies
    const session = await getSession({req: request});

    // aqui cria uma query de get do usuario
    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
    );


    let customerId = user.data.stripe_customer_id;

    if(!customerId) {
      // aqui cria o usuario no stripe
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email
      });

      customerId = stripeCustomer.id;

      // aqui faz um update no usuario no fauna salvando o id do stripe
      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data:{
              stripe_customer_id: customerId,
            }
          }
        )
      )
    }

    // aqui configura o checkout no stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      // aqui é a forma de pagamento aceita no caso cartao
      payment_method_types: ['card'],
      // aqui sé é obrigatorio informar o endereço no checkout
      billing_address_collection: 'required',
      line_items: [
        {
          // aqui é o item criando no stripe
          price: 'price_1JiOW8G1uXqCJysSUtUveYUh', quantity: 1
        }
      ],
      // aqui o tipo que é de inscrição
      mode: 'subscription',
      // aqui abilita usar cupom de desconto
      allow_promotion_codes: true,
      // aqui configura a url de sucesso 
      success_url: process.env.STRIPE_SUCCESS_URL,
      // aqui configura a url caso o usuario cancele a inscricao
      cancel_url: process.env.STRIPE_CANCEL_URL
    });

    return response.status(200).json({ sessionId: checkoutSession.id});
  } else {
    // caso não for post retorna erro 
    response.setHeader('Allow', 'POST');
    response.status(405).end('Method not allowed');
  }
}