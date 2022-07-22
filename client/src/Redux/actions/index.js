import axios from 'axios';

export function getPokes() {
    return async function (dispatch) {
        let pokes = await axios('http://localhost:3001/pokemons');
        return dispatch({
            type: 'GET_POKES',
            payload: pokes.data
        });
    }
}

export function getPokesByName(name) {
    return async function (dispatch) {
        const pokesByName = await axios('http://localhost:3001/pokemons?name=' + name);
        return dispatch({
            type: 'GET_POKES_BY_NAME',
            payload: pokesByName.data
        });
    }
}

export function getPokeTypes() {
    return async function (dispatch) {
        let pokeTypesJson = await axios('http://localhost:3001/types');
        return dispatch({
            type: 'GET_POKE_TYPES',
            payload: pokeTypesJson.data
        });
    }
}

export function filterPokesByType(payload) {
    return {
        type: 'FILTER_POKES_BY_TYPE',
        payload
    }
}

export function filterPokesByCreate(payload) {
    return {
        type: 'FILTER_POKES_BY_CREATE',
        payload
    }
}

export function sortPokesByName(payload) {
    return {
        type: 'SORT_BY_NAME',
        payload
    }
}

export function sortPokesByAttack(payload) {
    return {
        type: 'SORT_BY_ATTACK',
        payload
    }
}

export function postPokeCreated(payload) {
    return function () {
        const pokeInfo = axios.post('http://localhost:3001/pokemons', payload)
        return pokeInfo;
    }
}

export function getPokeDetail(id) {
    return async function (dispatch) {
        const json = await axios.get('http://localhost:3001/pokemons/' + id)
        return dispatch({
            type: 'GET_POKE_DETAIL',
            payload: json.data
        })
    }
}

export function clearPokeDetail() {
    return {
        type: 'CLEAR_DETAIL'
    }
}