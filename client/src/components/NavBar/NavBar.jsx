import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import style from './NavBar.module.css'
import avatar from '../../Images/PokeBall.png'
import { useDispatch, useSelector } from 'react-redux'
import { getPokesByName, getPokes } from '../../Redux/actions'

function NavBar() {
    const dispatch = useDispatch();
    const [pokeName, setPokeName] = useState("");

    function handleGoHome() {
        dispatch(getPokes());
    }

    function handleInputChange(e) {
        e.preventDefault();
        setPokeName(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        dispatch(getPokesByName(pokeName));
    }

    return (
        <div className={style.navBar}>
            <div className={style.wrapper}>
                <div className={style.item}>
                    <Link to={'/home'}>
                    <img className={style.avatar} src={avatar} alt="Avatar" onClick={() => handleGoHome()} />
                    </Link>
                </div>
                <div className={style.search}>
                    <form action="" className={style.search}>
                    <input className={style.search}
                        type="text"
                        placeholder='Search Pokémon'
                        onChange={(e) => handleInputChange(e)}
                    />
                    <button className={style.searchSubmit}
                        type="submit"
                        onClick={(e) => handleSubmit(e)}>Search</button>
                    </form>
                </div>
                <div className={style.items}>
                    <div className={style.item}>
                        <Link to='/create' style={{ textDecoration: 'none', cursor: 'pointer', color: 'white' }}>
                            <span>Create</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavBar