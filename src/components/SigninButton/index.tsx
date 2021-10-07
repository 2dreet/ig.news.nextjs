import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import styles from './styles.module.scss';
export function SignInButton() {

  const isUserLoggedIn = false;
  // aqui é retornado um botão caso o usuario esteja logado
  // e retornado outro botão caso o usuario não esteja logado
  return isUserLoggedIn ? (
    <button 
      type="button"
      className={styles.signInButton}
    >
      <FaGithub color="#04d361" />
      José Augusto
      <FiX color="#737380" className={styles.closeIcon}/>
    </button>
  ) : (
    <button 
      type="button"
      className={styles.signInButton}
    >
      <FaGithub color="#eba417" />
      Sign in with Github
    </button>
  )
}