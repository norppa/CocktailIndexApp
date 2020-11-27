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
  const [loadingMsg, setLoadingMsg] = useState('LOADING')

  const [editorCocktailId, setEditorCocktailId] = useState("")
  const [availableMethods, setAvailableMethods] = useState(false)
  const [availableGlasses, setAvailableGlasses] = useState(false)

  useEffect(() => {
    const asyncWrapper = async () => {
      setLoadingMsg(msg => msg + '\nGetting token from local storage')
      const token = await getStorageValue(TOKEN_KEY)
      setLoadingMsg(msg => msg + (token ? '\nToken aquired' : 'no token in local storage'))
      initialize(token)
    }
    asyncWrapper()

  }, [])

  const initialize = async (token) => {
    setLoadingMsg(msg => msg + '\nInitializing')
    if (!token) {
      setLoadingMsg(msg => msg + '\nSwitching to login screen')
      return setScreen(screens.LOGIN)

    }

    setLoadingMsg(msg => msg + '\nGetting cocktails from API')
    const cocktails = await cocktailsApi.get(token)
    if (cocktails.error) {
      setLoadingMsg(msg => msg + '\nError getting cocktails from API, switching to error screen')
      setScreen(screens.ERROR)
      return console.log('closeLogin error', cocktails.error)
    }

    
    setLoadingMsg(msg => msg + '\nCocktails aquired. Open viewer')
    setStorageValue(TOKEN_KEY, token)
    setToken(token)
    setCocktails(cocktails)
    setScreen(screens.VIEWER)
  }

  const closeLogin = async (token) => {
    await initialize(token)
  }

  const logout = () => {
    delStorageValue(TOKEN_KEY)
    setToken(false)
    setCocktails([])
    setScreen(screens.LOGIN)
  }

  const openEditor = async (cocktailId) => {
    console.log('openEditor', cocktailId)
    if (!availableMethods || !availableGlasses) {
      const availableMethods = await getAvailable('methods', token)
      const availableGlasses = await getAvailable('glasses', token)
      setAvailableMethods(availableMethods)
      setAvailableGlasses(availableGlasses)
    }
    setEditorCocktailId(cocktailId ? cocktailId : "")
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
        cocktails={cocktails}
        selectedId={editorCocktailId}
        availableMethods={availableMethods}
        availableGlasses={availableGlasses}
        save={saveCocktail}
        delete={deleteCocktail}
        close={closeEditor} />
    case screens.ERROR:
      return <View><Text>ERROR</Text></View>
    default:
      return <View><Text>{loadingMsg}</Text></View>
  }
}

export default App;
