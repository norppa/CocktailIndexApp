import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { getAvailable, cocktailsApi } from './src/utils/apiUtils'
import { getStorageValue, setStorageValue, delStorageValue } from './src/utils/storageUtils'

import Viewer from './src/components/viewer/Viewer'
import Editor from './src/components/editor/Editor'
import Login from './src/components/login/Login'

const screens = {
  LOGIN: 'login',
  VIEWER: 'viewer',
  EDITOR: 'editor',
  ERROR: 'error'
}

const TOKEN_KEY = '@CocktailIndexToken'

const App = () => {
  const [token, setToken] = useState(false)
  const [cocktails, setCocktails] = useState([])
  const [screen, setScreen] = useState('')

  const [availableMethods, setAvailableMethods] = useState(false)
  const [availableGlasses, setAvailableGlasses] = useState(false)

  useEffect(() => {
    const asyncWrapper = async () => {
      const token = await getStorageValue(TOKEN_KEY)
      initialize(token)
    }
    asyncWrapper()

  }, [])

  const initialize = async (token) => {
    if (!token) {
      return setScreen(screens.LOGIN)

    }

    const cocktails = await cocktailsApi.get(token)
    if (cocktails.error) {
      return console.log('closeLogin error', cocktails.error)
    }

    setStorageValue(TOKEN_KEY, token)
    setToken(token)
    setCocktails(cocktails)
    setScreen(screens.VIEWER)
  }

  const closeLogin = async (token) => {
    await initialize(token)
  }

  const logout = () => {
    setToken(false)
    setCocktails([])
    setScreen(screens.LOGIN)
  }

  const openEditor = async () => {
    if (!availableMethods || !availableGlasses) {
      const availableMethods = await getAvailable('methods', token)
      const availableGlasses = await getAvailable('glasses', token)
      setAvailableMethods(availableMethods)
      setAvailableGlasses(availableGlasses)
    }
    setScreen(screens.EDITOR)
  }

  const closeEditor = () => {
    setScreen(screens.VIEWER)
  }

  const saveCocktail = async (cocktail) => {
    const storedCocktail = await cocktailsApi.save(token, cocktail)
    console.log('saveCocktail, storedCocktail', storedCocktail)
    if (cocktail.id) {
      setCocktails(cocktails => cocktails.map(c => {
        if (c.id == cocktail.id) {
          return storedCocktail
        } else {
          return c
        }
      }))
    } else {
      setCocktails(cocktails => cocktails.concat(storedCocktail))
    }
    setScreen(screens.VIEWER)
  }

  const deleteCocktail = async (cocktailId) => {
    const result = await cocktailsApi.delete(token, cocktailId)
    if (result.error) {
      return console.error('COULD NOT REMOVE COCKTAIL')
    }
    setCocktails(cocktails => cocktails.filter(cocktail => cocktail.id !== cocktailId))
    setScreen(screens.VIEWER)
  }

  switch (screen) {
    case screens.LOGIN:
      return <Login close={closeLogin} />
    case screens.VIEWER:
      return <Viewer
        cocktails={cocktails}
        openEditor={openEditor}
        logout={logout} />
    case screens.EDITOR:
      return <Editor
        close={closeEditor}
        cocktails={cocktails}
        availableMethods={availableMethods}
        availableGlasses={availableGlasses}
        save={saveCocktail}
        delete={deleteCocktail} />
    case screens.ERROR:
      return <View><Text>ERROR</Text></View>
    default:
      return <View><Text>LOADING</Text></View>
  }
}

export default App;
