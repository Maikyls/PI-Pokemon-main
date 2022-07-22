import React, { Fragment, useEffect } from 'react'
import styles from './Detail.module.css';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearPokeDetail, getPokeDetail } from '../../Redux/actions';
import NavBar from '../NavBar/NavBar';
import Loading from '../Loading/Loading';
import style from './Detail.module.css';

function Detail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const pokeDetail = useSelector(state => state.pokeDetail)

    useEffect(() => {
        dispatch(getPokeDetail(id))
        dispatch(clearPokeDetail())
    }, [dispatch])

    return (
        <div className={styles.details}>
            {console.log(pokeDetail)}
            <NavBar />
            <div className={styles.container}>
                {
                    pokeDetail.length > 0 ?
                        <Fragment>
                            <img className={style.img} src={pokeDetail[0].image} alt='PokeImage' />
                            <div className={style.textContainer}>
                                <h1 className={style.name} >{'' + pokeDetail[0].name}</h1>
                                <h2 className={style.id} >{'iD: ' + pokeDetail[0].id}</h2>
                                <h3 className={style.details} >{'Hit Points: ' + pokeDetail[0].hp}</h3>
                                <h3 className={style.details} >{'attack: ' + pokeDetail[0].attack}</h3>
                                <h3 className={style.details} >{'defense: ' + pokeDetail[0].defense}</h3>
                                <h3 className={style.details} >{'speed: ' + pokeDetail[0].speed}</h3>
                                <h3 className={style.height} >{'height: ' + pokeDetail[0].height + 'm'}</h3>
                                <h3 className={style.weight} >{'weight: ' + pokeDetail[0].weight + 'kg'}</h3>
                                <p className={style.types}>{typeof pokeDetail[0].types === "object"?
                                'types: ' + pokeDetail[0].types.map(e => e.name) :
                                'types: ' + pokeDetail[0].types.join(' ')}
                                </p>
                            </div>
                        </Fragment>
                        : <Loading />
                }
            </div>
        </div>
    )
}

export default Detail