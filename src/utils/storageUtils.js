import AsyncStorage from '@react-native-community/async-storage'

const getData = async (key) => {
    console.log('getData', key)
    try {
        const value = await AsyncStorage.getItem(key)
        return value !== null ? JSON.parse(value) : null
    } catch (error) {
        console.log('error reading async storage:', error)
        return null
    }
}

const getStorageValue = async (key) => {
    try {
        return await AsyncStorage.getItem(key)
    } catch (error) {
        console.log('error reading async storage:', error)
        return null
    }
}

const setStorageValue = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (error) {
        console.log('error saving to local storage')
    }
}

const delStorageValue = async (key, value) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch (error) {
        console.log('error deleting', key, 'from local storage')
    }
}



module.exports = {
    getStorageValue,
    setStorageValue,
    delStorageValue,
    getData
}