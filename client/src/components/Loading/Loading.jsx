import React from 'react'
import loadingImage from '../../Images/Loading.png'
import style from './Loading.module.css'

function Loading() {
  return (
    <div className={style.imageContainer}>
        <img className={style.loaderImage} src={loadingImage} alt='pokeLoader'/>
    </div>
  )
}

export default Loading