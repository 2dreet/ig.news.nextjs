import { query as q} from 'faunadb';
import { fauna } from "../../../services/faunadb";
import { stripe } from '../../../services/stripe';

export async function saveSubscription(
  subscriptionId: string,
  customerId: string
) {

  // aqui obtemos apenas uma coluna do banco
  const userRef = await fauna.query(
  q.Select(
    "ref",
    q.Get(
      q.Match(
        q.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  );

  // buscamos a subscription pelo id la no stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // montando o objeto do subsctiptions que sera salvo no banco
  const subscriptionsData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
   }

   // salva a subscriptions no banco
  await fauna.query(
    q.Create(
      q.Collection('subscriptions'),
      { data: subscriptionsData}
    )
  )
}