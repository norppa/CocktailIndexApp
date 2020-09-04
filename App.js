import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { getCocktails } from './src/utils/utils'

import Viewer from './src/components/viewer/Viewer'
import Editor from './src/components/editor/Editor'

const App = () => {
  const [cocktails, setCocktails] = useState([])
  const [selected, setSelected] = useState(null)
  const [editorOpen, setEditorOpen] = useState(false)

  React.useEffect(() => {
    initialize()
  }, [])

  const initialize = async () => {
    let cocktails = await getCocktails()
    if (cocktails.error) {
      console.log('could not read database (' + cocktails.error + '), using local storage')
      // cocktails = readLocalStore()
    } else {
      // writeLocalStore(cocktails)
    }
    setCocktails(cocktails)

  }

  const select = (index) => {
    if (selected == index) {
      setSelected(null)
    } else {
      setSelected(index)
    }
  }

  const openEditor = () => {
    setEditorOpen(true)
  }

  const closeEditor = () => {
    setEditorOpen(false)
  }

  console.log('selected', selected)

  if (editorOpen) {
    return <Editor cocktail={cocktails[selected]} closeEditor={closeEditor} />
  }

  return <Viewer
    cocktails={cocktails}
    selected={selected}
    select={select}
    openEditor={openEditor}
  />
}

const styles = StyleSheet.create({

})

export default App;
