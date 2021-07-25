import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { getAvailable, cocktailsApi } from './src/utils/apiUtils'
import { getStorageValue, setStorageValue, delStorageValue } from './src/utils/storageUtils'

import Viewer from './src/components/viewer/Viewer'
import Editor from './src/components/editor/Editor'
import Login from './src/components/login/Login'

const screens = {
  LOG: 'log',
  LOGIN: 'login',
  VIEWER: 'viewer',
  EDITOR: 'editor',
  ERROR: 'error'
}

const TOKEN_KEY = '@CocktailIndexToken'
const COCKTAILS_KEY = '@CocktailIndexCocktails'

const App = () => {
  const [token, setToken] = useState(false)
  const [cocktails, setCocktails] = useState([])
  const [screen, setScreen] = useState(screens.VIEWER)
  const [logText, setLogText] = useState((new Date).toUTCString())
  const [offlineMode, setOfflineMode] = useState(true)

  const [editorCocktailId, setEditorCocktailId] = useState("")
  const [availableMethods, setAvailableMethods] = useState(false)
  const [availableGlasses, setAvailableGlasses] = useState(false)

  const log = (text) => {
    setLogText(logText => logText + '\n' + text)
  }

  useEffect(() => {
    const asyncWrapper = async () => {
      log('Getting token from local storage')
      const token = await getStorageValue(TOKEN_KEY)
      log(token ? 'Token aquired' : 'no token in local storage')
      console.log('token', token)
      const cocktails = await getStorageValue(COCKTAILS_KEY)
      console.log('cocktails', cocktails)
      log(cocktails ? 'Cocktails fetched from local storage' : 'No cocktails found from local storage')
      const cocktailList = cocktails ? JSON.parse(cocktails) : []
      console.log('cocktailList', cocktailList)
      initialize(token, cocktailList)
    }
    asyncWrapper()

  }, [])

  const initialize = async (token, cocktails) => {
    log('Initializing')
    if (!token) {
      log('Switching to login screen')
      return setScreen(screens.LOGIN)
    }

    setCocktails(cocktails)
    setScreen(screens.VIEWER)

    log('Getting cocktails from API')
    const apiCocktails = await cocktailsApi.get(token, log)
    if (apiCocktails.error) {
      log('Error getting cocktails from API, remaining in offline mode')
      log(JSON.stringify(apiCocktails.error))
      return
    }
    log('Cocktails aquired. Opening viewer')
    setStorageValue(TOKEN_KEY, token)
    setStorageValue(COCKTAILS_KEY, JSON.stringify(apiCocktails))
    setOfflineMode(false)
    setToken(token)
    setCocktails(apiCocktails)
  }

  const closeLogin = async (token) => {
    console.log('closeLogin', token)
    await initialize(token, cocktails)
  }

  const logout = () => {
    delStorageValue(TOKEN_KEY)
    setToken(false)
    setCocktails([])
    setScreen(screens.LOGIN)
  }

  const openEditor = async (cocktailId) => {
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

  const showLoadingMsg = () => {
    setScreen('')
    setTimeout(() => setScreen(screens.VIEWER), 5000)
  }

  const toggleOfflineMode = () => {
    console.log('token', token)
    console.log('cocktails', cocktails)
    if (offlineMode) {
      initialize(token, cocktails)
    } else {
      setOfflineMode(true)
    }
  }

  const clearLocalCocktails = () => {
    delStorageValue(COCKTAILS_KEY)
  }

  switch (screen) {
    case screens.LOGIN:
      return <Login close={closeLogin} />
    case screens.VIEWER:
      return <Viewer
        cocktails={cocktails}
        actions={{ openEditor, deleteCocktail, logout, showLoadingMsg, toggleOfflineMode, clearLocalCocktails }}
        offline={offlineMode} />
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
    case screens.LOG:
    default:
      return <View><Text>{logText}</Text></View>
  }
}

export default App;
