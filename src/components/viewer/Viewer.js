import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger} from 'react-native-popup-menu'

import Cocktail from './Cocktail'
import { Text, TextInput } from '../common/styledComponents'

const Viewer = (props) => {
  const [searchInput, setSearchInput] = useState('')
  const [cocktailList, setCocktailList] = useState(props.cocktails)

  useEffect(() => {
    setCocktailList(props.cocktails.filter(cocktail => cocktail.name.toLowerCase().includes(searchInput.toLowerCase())))
  }, [searchInput])

  const CocktailList = () => {
    if (cocktailList.length > 0) {
      return <FlatList
        style={styles.list}
        data={cocktailList}
        renderItem={({ item }) => <Cocktail cocktail={item} openEditor={props.openEditor} />}
        keyExtractor={(item, index) => index + item.name} />
    } else {
      return <Text style={styles.text}>No cocktails found</Text>
    }
  }

  return (
    <MenuProvider>
      <View style={styles.viewer}>
        <View style={styles.controls}>
          <TextInput style={styles.search} value={searchInput} onChange={event => setSearchInput(event.nativeEvent.text)} />
          <Menu>
            <MenuTrigger>
              <Icon name="menu" size={35} />
            </MenuTrigger>
            <MenuOptions style={styles.menuOptions} customStyles={menuOptionCustomStyles}>
              <MenuOption onSelect={props.logout} text='Logout' />
            </MenuOptions>
          </Menu>
        </View>

        <CocktailList />

      </View>

    </MenuProvider>
  )
}

export default Viewer

const menuOptionCustomStyles = {
  optionText: {
      fontFamily: 'Alegreya-Medium',
      fontSize: 22
  }
}

const styles = StyleSheet.create({
  viewer: {
    marginHorizontal: '5%',
    marginTop: 20,
    alignItems: 'center',
    flex: 1
  },
  controls: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10
  },
  search: {
    width: '80%',
    marginRight: 10
  },
  list: {
    width: '100%',
  },
  menuOptions: {
      backgroundColor: 'white',
      margin: -5,
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 10,
  },
})