import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { getCocktails } from './src/utils/utils'

import Viewer from './src/components/viewer/Viewer'

const App = () => {
  const [cocktails, setCocktails] = useState([])
  const [selected, setSelected] = useState(null)

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
    console.log('cocktails', cocktails)

  }

  const select = (index) => {
    if (selected == index) {
      setSelected(null)
    } else {
      setSelected(index)
    }
  }



  return <Viewer
    cocktails={cocktails}
    selected={selected}
    select={select}
  />
}

const styles = StyleSheet.create({

})

export default App;
