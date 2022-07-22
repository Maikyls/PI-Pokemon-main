const { Router } = require('express');
const { Pokemon, Types } = require('../db')
const fetch = require('cross-fetch');
const { json } = require('body-parser');
const axios = require('axios')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

const getApiPokes = async () => {
    const quantityOfPokes = 40;
    const pokesPerFetch = 20; /* API parameter*/
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

const getDbPokesById = async (id) => {

    const pokesFilterInDbById = await Pokemon.findAll({
        where: { id },
        include: {
            model: Types,
            attributes: ['name'],
            through: {
                attributes: []
            }
        }
    })
    if (pokesFilterInDbById.length === 0) {
        return null
    }
    return pokesFilterInDbById;

}


const getApiPokesById = async (id) => {
    try {
        if (id.length > 3) {
            const dbPokes = await getDbPokesById(id);
            if (dbPokes === null) {
                return { status: "error", msg: "Poke id doesn't exists" };
            }
            return { status: "success", msg: "", data: dbPokes };
        } else {
            try {
                const apiPokes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                const jsonRes = await apiPokes.json()

                let c = [];
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
                return { status: "success", msg: "", data: selectedInfoById };

            } catch (error) {
                return { status: "error", msg: "Poke id doesn't exists" };
            }
        }


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
        const apiPokes = await axios(`https://pokeapi.co/api/v2/pokemon/${name}`);
        // const apiPokesJson = await axios(apiPokes.data.forms[0].url);
        // const apiPokesJson2 = await axios(apiPokesJson.data.pokemon.url);
        const apiPokesJson3 = await apiPokes.data;
        let array = [];
        array.push(apiPokesJson3)
        console.log(apiPokes);
        const apiPokesMapped = array.map(e => {
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
        return apiPokesMapped;
    } catch (error) {
        console.error(error);
    }
}

const getPokeTypes = async () => {
    try {
        const types = await axios('https://pokeapi.co/api/v2/type');
        const typesMap = types.data
        const typeees = typesMap.results.map(e => e.name)
        return typeees;

    } catch (error) {
        console.error(error);
    }
}

const getAllPokes = async () => {
    const showApiPokes = await getApiPokes();
    const showDbPokes = await getDbPokes();
    const allPokes = showApiPokes.concat(showDbPokes)
    return allPokes;
}

router.get('/pokemons', async (req, res) => {
    const name = req.query.name
    const formName = req.query.name

    try {
        if (name || formName) {
            const filtredDbPoke = await getInDbPokesByName(name);
            const filtredApiPoke = await getInApiPokesByName(name);
            if (filtredApiPoke) {
                const allSearchs = filtredDbPoke.concat(filtredApiPoke);
                allSearchs.length > 0 ? res.status(200).send(allSearchs) : res.status(400).send('Name Nope');
            } else {
                filtredDbPoke.length > 0 ? res.status(200).send(filtredDbPoke) : res.status(200).send([]);
            }
        } else {
            res.status(200);
            res.send(await getAllPokes());
        }

    } catch (error) {
        console.log(error);
    }
})

router.get('/pokemons/:id', async (req, res) => {
    try {
        const { id } = req.params
        if ((id.replace(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) === "undefined" && id.length === 36) || (!isNaN(id) && id.length <= 3)) {
            let showPokeById = await getApiPokesById(id)
            if (showPokeById.status === "error") {
                return res.status(400).send(showPokeById.msg)
            }
            res.status(200).send(showPokeById.data)
        } else {
            res.status(400).send('Oops id')
        }
    } catch (error) {
        console.error(error);
    }
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
            res.status(400).send('Poke name is required')
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
