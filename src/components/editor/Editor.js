import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableWithoutFeedback, FlatList } from 'react-native'

import IngredientInput from './IngredientInput'
import Dialog from './Dialog'
import GlassCard from './GlassCard'
import EditorButton from './EditorButton'

import {
    saveNewIngredient,
    getAvailable,
    saveCocktail
} from '../../utils/utils'
import { useBackButton } from '../../utils/backButtonHandler'

const emptyIngredient = { name: '', amount: '' }

const Editor = (props) => {
    const [availableIngredients, setAvailableIngredients] = useState([])
    const [availableGlasses, setAvailableGlasses] = useState([])
    const [availableMethods, setAvailableMethods] = useState([])
    const [id, setId] = useState(null)
    const [name, setName] = useState('')
    const [ingredients, setIngredients] = useState([emptyIngredient])
    const [garnish, setGarnish] = useState('')
    const [method, setMethod] = useState('Shaken')
    const [glass, setGlass] = useState(null)
    const [info, setInfo] = useState('')

    const [methodDialogVisible, setMethodDialogVisible] = useState(false)
    const [glassDialogVisible, setGlassDialogVisible] = useState(false)
    const [exitDialogVisible, setExitDialogVisible] = useState(false)

    useEffect(() => {
        const fetchadditionalInfo = async () => {
            setAvailableIngredients(await getAvailable('ingredients'))
            setAvailableGlasses(await getAvailable('glasses'))
            setAvailableMethods(await getAvailable('methods'))
        }
        fetchadditionalInfo()
        initialize()
    }, [])

    const initialize = () => {
        if (props.cocktail) {
            const { id, name, ingredients, garnish, method, glass, info } = props.cocktail
            setId(id)
            setName(name)
            setIngredients(ingredients.concat(emptyIngredient))
            garnish && setGarnish(garnish)
            glass && setGlass(glass)
            method && setMethod(method)
            info && setInfo(info)
        }
    }

    useBackButton(() => {
        setExitDialogVisible(true)
        return true
    })

    /*
    *  Ingredient list has always an empty item at the end. 
    */
    const updateIngredient = (index) => (ingredientPart) => {
        let newIngredients = ingredients.map((ingredient, i) => {
            if (i == index) {
                return { ...ingredient, ...ingredientPart }
            } else {
                return ingredient
            }
        })

        // remove all empty ingredients except the last
        newIngredients = newIngredients.filter((x, i) => i == newIngredients.length - 1 || x.name != '' || x.amount != '')

        // if a property value was added to the last item, create a new empty last item
        if (index == ingredients.length - 1) {
            newIngredients = newIngredients.concat(emptyIngredient)
        }

        // if second to last ingredient is empty, remove the last (empty) ingredient
        if (index == ingredients.length - 2) {
            const { name, amount } = newIngredients[index]
            if (name == '' && amount == '') {
                newIngredients = newIngredients.slice(0, newIngredients.length - 1)
            }
        }

        setIngredients(newIngredients)
    }

    const selectMethod = (method) => () => {
        setMethod(method)
        setMethodDialogVisible(false)
    }

    const selectGlass = (glass) => () => {
        setGlass(glass)
        setGlassDialogVisible(false)
    }

    const save = async () => {
        if (ingredients.some(ingredient => ingredient.isNew)) {
            console.error('cant save with new ingredients')
            return
        }

        const cocktail = {
            id: id ? id : undefined,
            name,
            ingredients: ingredients.slice(0, ingredients.length - 1),
            garnish,
            method,
            glass,
            info
        }
        const error = await saveCocktail(cocktail)
        if (error) {
            return console.error('could not save cocktail, error status:', error)
        }

        props.closeEditor(true)
    }

    const closeEditor = () => {
        props.closeEditor(false)
    }

    return (
        <ScrollView style={styles.editor}>

            <Text style={styles.header}>Name</Text>
            <TextInput style={[styles.inputArea, styles.input]} value={name} onChangeText={setName} />

            <Text style={styles.header}>Ingredients</Text>
            <View style={styles.inputArea}>
                {ingredients.map((ingredient, i) => <IngredientInput key={i}
                    style={styles.input}
                    ingredient={ingredient}
                    availableIngredients={availableIngredients}
                    updateIngredient={updateIngredient(i)} />)}
            </View>

            <Text style={styles.header}>Garnish</Text>
            <TextInput style={[styles.inputArea, styles.input]} value={garnish} onChangeText={setGarnish} />

            <Text style={styles.header}>Method</Text>
            <TouchableWithoutFeedback onPress={setMethodDialogVisible.bind(this, true)}>
                <Text style={[styles.inputArea, styles.input]}>{method}</Text>
            </TouchableWithoutFeedback>

            <Dialog visible={methodDialogVisible} close={setMethodDialogVisible.bind(this, false)}>
                <FlatList
                    data={availableMethods}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableWithoutFeedback onPress={selectMethod(item)}>
                                <Text style={[styles.input, styles.modalInput]}>{item}</Text>
                            </TouchableWithoutFeedback>
                        )
                    }}
                    keyExtractor={(item, index) => index + item}
                />
            </Dialog>

            <Text style={styles.header}>Glassware</Text>
            <GlassCard style={[styles.inputArea, styles.input]} select={setGlassDialogVisible.bind(this, true)} glass={glass} />

            <Dialog visible={glassDialogVisible} close={setGlassDialogVisible.bind(this, false)}>
                <FlatList
                    data={availableGlasses}
                    renderItem={({ item, index }) => <GlassCard select={selectGlass(item)} glass={item} />}
                    keyExtractor={(item, index) => index + item}
                />
            </Dialog>

            <Text style={styles.header}>Information</Text>
            <TextInput
                value={info}
                multiline={true}
                style={[styles.input, styles.inputArea, { textAlignVertical: 'top' }]}
                numberOfLines={4}
                onChangeText={setInfo}
            />

            <View style={styles.buttons}>
                <EditorButton title="Save" onPress={save} />
                <EditorButton title="Cancel" onPress={closeEditor} />
            </View>


            <Dialog visible={exitDialogVisible} close={setExitDialogVisible.bind(this, false)}>
                <View>
                    <Text style={styles.header}>Closing Editor</Text>
                    <Text style={styles.text}>All your changes will be lost. Are you sure?</Text>
                    <View style={styles.buttons}>
                        <EditorButton title="Yes" onPress={closeEditor} />
                        <EditorButton title="No" onPress={setExitDialogVisible.bind(this, false)} />
                    </View>
                </View>
            </Dialog>


        </ScrollView>
    )
}

export default Editor

const styles = StyleSheet.create({
    editor: {
        marginTop: 30,
        marginLeft: 10,
        marginRight: 0,
        marginBottom: 30,
        paddingRight: 15
    },
    text: {
        fontFamily: 'Alegreya-Medium',
        fontSize: 20,
    },
    header: {
        fontFamily: 'CherryCreamSoda-Regular',
        fontSize: 24,
        marginTop: 10,
        marginBottom: 5,
    },
    inputArea: {
        marginLeft: 30
    },
    input: {
        fontFamily: 'Alegreya-Medium',
        fontSize: 20,
        borderWidth: 1,
        borderRadius: 5,
        padding: 3,
        paddingLeft: 10,
    },
    modalInput: {
        marginLeft: 0,
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    buttons: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
})