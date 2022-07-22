import React, { Fragment, useEffect, useState } from 'react';
import NavBar from '../NavBar/NavBar';
import { useDispatch, useSelector } from 'react-redux';
import { filterPokesByCreate, filterPokesByType, getPokes, getPokeTypes, sortPokesByAttack, sortPokesByName } from '../../Redux/actions';
import style from '../Home/Home.module.css'
import bgd from '../../Images/background.jpg'
import Card from '../Card/Card';
import Paginate from '../Paginate/Paginate';
import Loading from '../Loading/Loading';

export default function Home() {
  const dispatch = useDispatch();
  const allPokes = useSelector((state) => state.pokemons);
  const allTypes = useSelector((state) => state.pokeTypes);
  const pokesPerPageSetter = 12;
  const defaultPage = 1;
  const [currentPage, setCurrentPage] = useState(defaultPage);
  const [pokesPerPage, setPokesPerPage] = useState(pokesPerPageSetter);
  const lastPokeIndex = currentPage * pokesPerPage;
  const firstPokeIndex = lastPokeIndex - pokesPerPage;
  const currentPokes = allPokes.slice(firstPokeIndex, lastPokeIndex);
  const [, setOrder] = useState("")

  useEffect(() => {
    dispatch(getPokes())
    dispatch(getPokeTypes())
  }, [])

  function paginate(defaultPage) {
    setCurrentPage(defaultPage);
  }

  function handleSelectType(e) {
    e.preventDefault();
    setCurrentPage(defaultPage);
    dispatch(filterPokesByType(e.target.value));
  }

  function handleSelectCreate(e) {
    e.preventDefault();
    setCurrentPage(defaultPage);
    dispatch(filterPokesByCreate(e.target.value))
  }

  function handleSelectAz(e) {
    e.preventDefault();
    setCurrentPage(defaultPage);
    dispatch(sortPokesByName(e.target.value))
    setOrder(`ordered ${e.target.value}`)
  }

  function handleSelectAttack(e) {
    e.preventDefault();
    setCurrentPage(defaultPage);
    dispatch(sortPokesByAttack(e.target.value))
    setOrder(`ordered ${e.target.value}`)
  }

  return (
    <div className={style.home}>
      <NavBar />
      <div className={style.wrapper}>
        <div className={style.top}>
          <Fragment>

            <select className={style.filters} onChange={e => handleSelectType(e)}>
              <option value="all">All Types</option>
              {allTypes.map((e) => {
                return (
                  <option value={e.name} key={e.id}>{e.name}</option>
                )
              }

              )}
            </select>
          </Fragment>
          <select className={style.filters} onChange={e => handleSelectCreate(e)}>
            <option value="all">ALL</option>
            <option value="api">API</option>
            <option value="created">Created</option>
          </select>
          <Paginate
            pokesPerPage={pokesPerPage}
            allPokes={allPokes.length}
            paginate={paginate}
          />
          <select className={style.filters} onChange={e => handleSelectAz(e)} name={'Alpha'}>
            <option value="all">Alpha</option>
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>
          <select className={style.filters} onChange={e => handleSelectAttack(e)}>
            <option value="all">Attack</option>
            <option value="highest">Highest</option>
            <option value="lowest">Lowest</option>
          </select>
        </div>
        <div className={style.bottom}>
          <div className={style.cards}>
            {allPokes.length ? <Card pokesToRender={currentPokes} /> : <Loading />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

