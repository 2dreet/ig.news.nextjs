import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
// aqui importamos a funcao de signIn que faz a autenticacao 
// e o useSession que é um hook utilizado para obter varias informacao
// sobra a sessao ate mesmo o usuario logado
import { signIn, signOut,useSession } from 'next-auth/client';

import styles from './styles.module.scss';
export function SignInButton() {

  // aqui obter a sessao caso nao tenha é undefined ou null
  const [ session ] = useSession();
  // aqui é retornado um botão caso o usuario esteja logado
  // e retornado outro botão caso o usuario não esteja logado
  return session ? (
    <button 
      type="button"
      className={styles.signInButton}
      onClick={() => signOut()}
    >
      <FaGithub color="#04d361" />
      {session.user.name}
      <FiX color="#737380" className={styles.closeIcon}/>
    </button>
  ) : (
    <button 
      type="button"
      className={styles.signInButton}
      // aqui chamamos a funcao de logar passado qual regra de login vamos usar
      onClick={() => signIn('github')}
    >
      <FaGithub color="#eba417" />
      Sign in with Github
    </button>
  )
}