const { Router } = require('express');
const { Pokemon, Types } = require('../db')
const fetch = require('cross-fetch');
const { json } = require('body-parser');
const axios = require('axios')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

const getApiPokes = async () => {
    const quantityOfPokes = 40;
    const pokesPerFetch = 20;
    const requiredArrays = Math.ceil(quantityOfPokes / pokesPerFetch)
    let pokes = [];
    const apiCall = await fetch('https://pokeapi.co/api/v2/pokemon');
    let apiData = await apiCall.json();
    const apiResults = apiData.results;
    pokes.push(apiResults);

    try {
        for (let poke of apiResults) {
            const infopoke = await fetch(poke.url);
            const jsonInfopoke = await infopoke.json();
            Object.assign(poke, { ...jsonInfopoke })
        }
        do {
            const apiCall = await fetch(apiData.next)
            apiData = await apiCall.json();
            const apiResults = apiData.results;
            pokes.push(apiResults);

            for (let poke of apiData.results) {
                const infopoke = await fetch(poke.url);
                const jsonInfopoke = await infopoke.json();
                Object.assign(poke, { ...jsonInfopoke })
            }

        } while (pokes.length < requiredArrays);
        const flatedPokes = pokes.flat();
        const selectedInfOfPokes = flatedPokes.map(e => {
            return {
                image: e.sprites.other.home.front_default,
                name: e.name,
                types: e.types.map(e => e.type.name)
            }
        })

        return selectedInfOfPokes;

    } catch (error) {
        console.error(error);
    }
}

const getDbPokes = async () => {
    return Pokemon.findAll({
        include: {
            model: Types,
            attributes: ['name'],
            through: {
                attributes: []
            }
        }
    })
}

const getPokesById = async (id) => {
    try {
        //falta filtrar por db
        const dbPokes = await getDbPokes();
        const filterById = dbPokes.filter(e => e.id == id)
        if (filterById.length) {
            return filterById
        }
        //filter in API with endpoint by id
        const apiPokes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        const jsonRes = await apiPokes.json()
        // let's filter just the needed info for the detail path ↓
        const c = [];
        c.push({ ...jsonRes })
        const selectedInfoById = c.map(e => {
            return {
                image: e.sprites.other.home.front_default,
                name: e.name,
                types: e.types.map(e => e.type.name),
                id: e.id,
                hp: e.stats[0].base_stat,
                attack: e.stats[1].base_stat,
                defense: e.stats[2].base_stat,
                speed: e.stats[5].base_stat,
                height: e.height,
                weight: e.weight
            }
        })
        return selectedInfoById;
        //falta un mensaje de no encontrado ni en db ni en api
    } catch (error) {
        console.error(error);
    }
}

const getInDbPokesByName = async (name) => {
    try {
        const dbPokes = await getDbPokes();
        const filterDbByName = dbPokes.filter(e => e.name.toLowerCase().includes(name.toLowerCase()));

        return filterDbByName;

    } catch (error) {
        console.error(error);
    }
}

const getInApiPokesByName = async (name) => {
    try {
        const apiPokes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const apiPokesJson = await apiPokes.json();
        return apiPokesJson;
    } catch (error) {
        console.error(error);
    }
}

const getPokeTypes = async () => {
    try {
        const types = await axios('https://pokeapi.co/api/v2/type');
        // const typesJson = types.json();
        const typesMap = types.data
        const typeees = typesMap.results.map(e => e.name)
        return typeees;

    } catch (error) {
        console.error(error);
    }
}

router.get('/pokemons', async (req, res) => {
    const name = req.query.name
    const showApiPokes = await getApiPokes();
    const showDbPokes = await getDbPokes();
    const allPokes = showApiPokes.concat(showDbPokes)
    try {
        if (name) {
            const filtredDbPoke = await getInDbPokesByName(name);
            const filtredApiPoke = await getInApiPokesByName(name);
            const allsearchs = filtredDbPoke.concat(filtredApiPoke);
            allsearchs ?
                res.status(200).send(allsearchs) :
                res.status(400).send('Name Nope');
        } else {
            res.status(200);
            res.send(allPokes);
        }

    } catch (error) {
        console.error(error);
    }
})

router.get('/pokemons/:id', async (req, res) => {
    const { id } = req.params
    if (id.length) {
        let showPokeById = await getPokesById(id)
        res.status(200).send(showPokeById)
    } else res.status(400).send('id Oops')
})

router.get('/types', async (req, res) => {
    const typesByUrl = await getPokeTypes();
    typesByUrl.forEach(e => {
        Types.findOrCreate({
            where: { name: e }
        })
    })
    const typesByDb = await Types.findAll();
    res.status(200).send(typesByDb);
})

router.post('/pokemons', async (req, res) => {

    const { name, id, hp, attack, defense, speed, height, weight, image, types } = req.body

    try {
        if (!name) {
            res.status(400).send('chinguesumae')
        }
    
        let newPoke = await Pokemon.create({
            name,
            id,
            hp,
            attack,
            defense,
            speed,
            height,
            weight,
            image
        })
    
        let typesBody = await Types.findAll({
            where: {
                name: types
            }
        })
    
        newPoke.addTypes(typesBody);
        
        res.status(200).send('Poke Created')
        
    } catch (error) {
        console.error(error);
    }

    
})

module.exports = router;
