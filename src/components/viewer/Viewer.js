import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import IoniconIcon from 'react-native-vector-icons/Ionicons'
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger} from 'react-native-popup-menu'

import Cocktail from './Cocktail'
import { Text, TextInput } from '../common/styledComponents'

const Viewer = (props) => {
  const [searchInput, setSearchInput] = useState('')
  const [cocktailList, setCocktailList] = useState(props.cocktails)

  useEffect(() => {
    console.log('viewer useEffect', props.cocktails)
    setCocktailList(props.cocktails.filter(cocktail => cocktail.name.toLowerCase().includes(searchInput.toLowerCase())))
  }, [searchInput, props.cocktails])

  const CocktailList = () => {
    console.log('props.cocktails', props.cocktails)
    console.log('cocktailList', cocktailList)
    if (cocktailList.length > 0) {
      return <FlatList
        style={styles.list}
        data={cocktailList}
        renderItem={({ item }) => <Cocktail cocktail={item} actions={props.actions} offline={props.offline} />}
        keyExtractor={(item, index) => index + item.name}
        ListFooterComponent={<View style={styles.spacer} />} />
    } else {
      return <Text style={styles.text}>No cocktails found</Text>
    }
  }

  return (
    <MenuProvider>
      <View style={styles.viewer}>
        <View style={styles.controls}>
          {props.offline && <IoniconIcon name="cloud-offline" size={35} />}
          <TextInput style={styles.search} value={searchInput} onChange={event => setSearchInput(event.nativeEvent.text)} />
          <Menu>
            <MenuTrigger>
              <EntypoIcon name="menu" size={35} />
            </MenuTrigger>
            <MenuOptions style={styles.menuOptions} customStyles={menuOptionCustomStyles}>
              <MenuOption onSelect={props.actions.logout} text='Logout' />
              <MenuOption onSelect={props.actions.showLoadingMsg} text='Show Log' />
              <MenuOption onSelect={props.actions.toggleOfflineMode} text={props.offline ? 'Online mode' : 'Offline mode'} />
              <MenuOption onSelect={props.actions.clearLocalCocktails} text="Clear Local Cocktails" />

              {/* <MenuOption onSelect={props.actions.debug} text='Debug' /> */}
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
    flex: 1,
  },
  controls: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10
  },
  search: {
    flexGrow: 1,
    marginRight: 10,
    marginLeft: 10
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
  spacer: {
    marginBottom: 200
  }
})