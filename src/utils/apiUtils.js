
const baseUrl = 'https://jtthaavi.kapsi.fi/subrosa/cocktailindex'

const login = async (username, password) => {
    console.log('apiUtils login', username, password)
    if (!username || !password) {
        return { error: 'username and password required'}
    }
    const url = baseUrl + '/users/login'
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    }

    try {
        const result = await fetch(url, request)
        if (result.status != 200) {
            console.log('bad status', result.status)
            return { error: result, msg: 'Could not log in' }
        }
        const resultJson = await result.json()
        console.log('resultJson', resultJson)
        return resultJson
    } catch (error) {
        console.log('error', error)
        return { error: error, msg: 'Could not log in' }
    }
}

const getCocktails = async (token, logger = () => {}) => {
    logger('getCocktails called')
    const url = baseUrl + '/cocktails'
    const request = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    }
    logger('url and request created')

    try {
        logger('inside try')
        const result = await fetch(url, request)
        logger('result got')
        if (result.status != 200) {
            console.log('bad status', result.status)
            return { error: result, msg: 'Failed to fetch cocktails' }
        }
        const resultJson = await result.json()
        return resultJson
    } catch (error) {
        console.log('error', error)
        return { error: error, msg: 'Failed to fetch cocktails' }
    }
}

const getAvailable = async (type, token) => {
    const url = baseUrl + '/' + type
    const request = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    }
    try {
        const result = await fetch(url, request)
        if (result.status != 200) {
            console.error(result)
            return []
        } else {
            const resultJson = await result.json()
            return resultJson
        }
    } catch (error) {
        console.log('error', error)
        return { error: error, msg: 'Failed to fetch ' + type }
    }
    
}

const saveCocktail = async (token, cocktail) => {
    const url = baseUrl + '/cocktails'
    try {
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(cocktail)
        })
    
        if (result.status != 200) {
            console.error(result)
            return result.status
        } else {
            const resultJson = await result.json()
            
            return { ...resultJson.value, id: resultJson.key }
        }
    } catch (error) {
        console.log('error', error)
        return {error}
    }
}

const deleteCocktail = async (token, cocktailId) => {
    const url = baseUrl + '/cocktails'
    const request = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ key: cocktailId })
    }
    try {
        const result = await fetch(url, request)
        if (result.status != 200) {
            throw new Error(result)
        }
    } catch (error) {
        console.error('DELETE COCKTAIL ERROR:', error)
        return { error }
    }
    return {}
}


module.exports = {

    login,
    getAvailable,
    cocktailsApi: {
        get: getCocktails,
        save: saveCocktail,
        delete: deleteCocktail
    }
}