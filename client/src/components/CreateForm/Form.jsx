import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPokesByName, getPokeTypes, postPokeCreated } from '../../Redux/actions';
import NavBar from '../NavBar/NavBar';
import style from './Form.module.css';

function Form() {
    const types = useSelector(state => state.pokeTypes);
    const existsName = useSelector(state => state.pokemons);
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getPokeTypes())
        setErrors(validation(input))
    }, [])

    const [input, setInput] = useState({
        name: "",
        hp: "",
        attack: "",
        defense: "",
        speed: "",
        height: "",
        weight: "",
        image: "",
        types: []
    })

    function handleInputChange(e) {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
        setErrors(validation({ ...input, [e.target.name]: e.target.value }))
        dispatch(getPokesByName(input.name))
    }

    function handleChecked(e) {
        if (e.target.checked) {
            setInput({
                ...input,
                types: [...input.types, e.target.name]
            })
        } if (!e.target.checked) {
            setInput({
                ...input,
                types: input.types.filter(i => i !== e.target.name)
            })
        }
        setErrors(validation({ ...input }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        dispatch(postPokeCreated(input))
        setInput({
            name: "",
            hp: "",
            attack: "",
            defense: "",
            speed: "",
            height: "",
            weight: "",
            image: "",
            types: []
        })
        showMssg()
    }

    function showMssg() {
        return alert('Pokémon was created')
    }

    const [errors, setErrors] = useState({})

    function validation() {

        let error = {}
        if (!input.name) {
            error.name = 'Pokémon must have a name'
        }
        if (existsName.length) {
            error.name = 'Poke name already exists'
        }
        if (input.types.length === 0) {
            error.types = 'Pokémon must have at least one type'
        }
        if (input.hp < 1 || input.hp > 150) {
            error.hp = 'HP value must stay between the values 0 - 150'
        }
        if (input.attack < 1 || input.attack > 180) {
            error.attack = 'Attack value must stay between the values 0 - 180'
        }
        if (input.defense < 1 || input.defense > 180) {
            error.defense = 'Defense value must stay between the values 0 - 180'
        }
        if (input.speed < 1 || input.speed > 200) {
            error.speed = 'Speed value must stay between the values 0 - 200'
        }
        if (input.height < 1 || input.height > 200) {
            error.height = 'Height value must stay between the values 0 - 200'
        }
        if (input.weight < 1 || input.weight > 5000) {
            error.weight = 'Weight value must stay between the values 0 - 5000'
        }
        // if (!input.image.includes('https://')) {
        //     error.image = 'Picture must be the web image Link'
        // }
        return error
    }

    return (
        <Fragment>
            <NavBar />
            <form className={style.formContainer} onSubmit={(e) => handleSubmit(e)}>
                
                    <label className={style.label} htmlFor='name' >Name:</label>
                    <input onChange={(e) => handleInputChange(e)} value={input.name} type='text' id='name' name="name" />
                    {errors.name && (<p className={style.error}>{errors.name}</p>)}

                    <label className={style.label} htmlFor='hp' >HP:</label>
                    <input onChange={(e) => handleInputChange(e)} min="1" max="150" value={input.hp} type='number' id='hp' name="hp" />
                    {errors.hp && (<p className={style.error}>{errors.hp}</p>)}

                    <label className={style.label} htmlFor='attack' >Attack:</label>
                    <input onChange={(e) => handleInputChange(e)} min="1" max="180" value={input.attack} type='number' id="attack" name="attack" />
                    {errors.attack && (<p className={style.error}>{errors.attack}</p>)}

                    <label className={style.label} htmlFor='defense'>Defense:</label>
                    <input onChange={(e) => handleInputChange(e)} min="1" max="180" value={input.defense} type='number' id="defense" name="defense" />
                    {errors.defense && (<p className={style.error}>{errors.defense}</p>)}

                    <label className={style.label} htmlFor='speed'>Speed:</label>
                    <input onChange={(e) => handleInputChange(e)} min="1" max="200" value={input.speed} type='number' id="speed" name="speed" />
                    {errors.speed && (<p className={style.error}>{errors.speed}</p>)}

                    <label className={style.label} htmlFor='height'>Height:</label>
                    <input onChange={(e) => handleInputChange(e)} min="1" max="200" value={input.height} type='number' id="height" name="height" />
                    {errors.height && (<p className={style.error}>{errors.height}</p>)}

                    <label className={style.label} htmlFor='weight'>Weight:</label>
                    <input onChange={(e) => handleInputChange(e)} min="1" max="5000" value={input.weight} type='number' id="weight" name="weight" />
                    {errors.weight && (<p className={style.error}>{errors.weight}</p>)}

                    <label className={style.label} htmlFor='image'>Picture Link:</label>
                    <input onChange={(e) => handleInputChange(e)} value={input.image} type='text' id="image" name="image" placeholder='Must be image Link' />
                    <br></br>
                    <br></br>
                    {/* {errors.image && (<p>{errors.image}</p>)} */}

                    <label className={style.typesLabel}>Pokémon Types:</label>
                    <br></br>
                    <br></br>
                    <div className={style.typesContainer}>

                        {types.map((e) => {
                            return (
                                <div className={style.typeDiv}>
                                    <label htmlFor={e.name}>{e.name}</label>
                                    <input type="checkbox" key={e.id} name={e.name} id={e.id} onChange={(e) => handleChecked(e)} />
                                </div>
                            )
                        })}
                    </div>

                    {errors.types && (<p className={style.error}>{errors.types}</p>)}

                    {function buttonHandle() {
                        if (Object.entries(errors).length > 0) {
                            return <button className={style.button} disabled="disabled">Create Pokémon</button>
                        } else return (<button className={style.button}> Create Pokémon</button>)
                    }()}

            </form>
        </Fragment>
    )
}

export default Form