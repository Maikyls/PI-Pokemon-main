import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css'
import logo from '../../Images/PokeBall.png'
import landTitle from '../../Images/PokeTitle.png'

function LandingPage() {
  return (
    <div className={styles.land}>
      <img width={'50%'} 
        src={landTitle} alt="Poketitle" />
      <Link to={'/home'} style={{ textDecoration: 'none', cursor: 'pointer' }} >
        <img className={styles.pokeBall}
          src={logo} alt="Pokebola" />
      </Link>

    </div >
  )
}

export default LandingPage