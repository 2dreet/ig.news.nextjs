import { query as q } from 'faunadb';

import NextAuth from "next-auth"
import Providers from "next-auth/providers"

import { fauna } from '../../../services/faunadb'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      // aqui define quais informações eu vou querer
      scope: 'read:user'
    }),
    // ...add more providers here
  ],
  // jwt: {
  //  deve criar a chave com hash HS512
  //   signingKey: process.env.JWT_KEY
  // },
  callbacks: {
   async signIn(user, account, profile) {

    // FQL sintaxe do fauna
    // cria um novo registro na collection users
    try { 
      const { email } = user;
      await fauna.query(
        //aqui utiliza a semantica do fauna para verificar se
        // usuario não existe
        q.If(
          q.Not(
            q.Exists(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(email)
              )
            )
          ),
          // caso ele não encontre entra aqui seria o if em sim
          q.Create(
            q.Collection('users'),
            { data: { email } }
          ),
          // caso exista aqui seria o else ele apenas busca o usuario
          q.Get(
            q.Match(
              q.Index('user_by_email'),
              q.Casefold(email)
            )
          )      
        )
      )

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
   }
  }
})