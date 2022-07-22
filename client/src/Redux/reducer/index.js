const intialState = {
    pokeDetail: [],
    pokeTypes: [],
    pokemons: [],
    pokes: []
};

function rootReducer(state = intialState, action) {
    switch (action.type) {
        case 'GET_POKES':
            return {
                ...state,
                pokemons: action.payload,
                pokes: action.payload
            }
        case 'GET_POKES_BY_NAME':
            return {
                ...state,
                pokemons: action.payload
            }
        case 'GET_POKE_TYPES':
            return {
                ...state,
                pokeTypes: action.payload
            }
        case 'FILTER_POKES_BY_TYPE':
            let pokesFilteredByType = action.payload === 'all' ? state.pokes :
                state.pokemons.filter((e) => e.types.includes(action.payload))
            return {
                ...state,
                pokemons: pokesFilteredByType
            }
        case 'FILTER_POKES_BY_CREATE':
            let pokesFilteredByCreate = action.payload === 'all' ? state.pokes :
                action.payload === 'api' ? state.pokes.filter((e) => !e.createdOnDb) :
                    state.pokes.filter((e) => e.createdOnDb);
            return {
                ...state,
                pokemons: pokesFilteredByCreate
            }
        case 'SORT_BY_NAME':
            let pokesSortedByName = action.payload === 'all' ? state.pokes :
                action.payload === 'a-z' ? state.pokemons.sort((a, b) => a.name.localeCompare(b.name)) :
                    state.pokemons.sort((a, b) => b.name.localeCompare(a.name));
            return {
                ...state,
                pokemons: pokesSortedByName
            }
        case 'SORT_BY_ATTACK':
            let pokesSortedByAttack = action.payload === 'all' ? state.pokes :
                action.payload === 'highest' ? state.pokemons.sort(function (a, b) {
                    if (a.attack > b.attack) {
                        return -1
                    }
                    if (b.attack > a.attack) {
                        return 1
                    }
                    return 0
                }) : state.pokemons.sort(function (a, b) {
                    if (a.attack > b.attack) {
                        return 1
                    }
                    if (b.attack > a.attack) {
                        return -1
                    }
                    return 0
                });
            return {
                ...state,
                pokemons: pokesSortedByAttack
            }
        case 'GET_POKE_DETAIL':
            return {
                ...state,
                pokeDetail: action.payload
            }
        case 'CLEAR_DETAIL':
            const pokeDefault = []
            return {
                ...state,
                pokeDetail: pokeDefault
            }
        default:
            return state;
    }

}

export default rootReducer;