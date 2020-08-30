import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput,  FlatList } from 'react-native'
import Cocktail from './Cocktail'

const Viewer = (props) => {
  const [searchInput, setSearchInput] = useState('')

  return (
    <View style={styles.viewer}>
      <View style={styles.controls}>
        <View style={styles.textInput}>
          <TextInput type="text" value={searchInput} onChange={event => setSearchInput(event.nativeEvent.text)} />
        </View>
      </View>

      <FlatList
        style={styles.list}
        data={props.cocktails}
        renderItem={({ item, index }) => {
          if (!item.name.toLowerCase().includes(searchInput.toLowerCase())) {
            return null
          }
          return (
            <Cocktail cocktail={item}
              index={index}
              selected={index == props.selected}
              // scrollTo={scrollTo}
              select={() => props.select(index)} />
          )
        }}
        keyExtractor={(item, index) => index + item.name}
      />
    </View>
  )
}

export default Viewer

const styles = StyleSheet.create({
  viewer: {
    marginHorizontal: '5%',
    marginTop: 20,
    alignItems: 'center',
  },
  controls: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10
  },
  textInput: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 10
  },
  list: {
    width: '100%',
  }
})