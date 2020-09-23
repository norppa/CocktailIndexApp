import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableWithoutFeedback, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

import Dialog from '../common/Dialog'
import Button from '../common/Button'
import Dropdown from '../common/Dropdown'
import GlassCard from './GlassCard'

const emptyIngredient = { name: '', amount: '' }

const Editor = (props) => {
    const [selected, setSelected] = useState(false)
    const [id, setId] = useState(null)
    const [name, setName] = useState('')
    const [ingredients, setIngredients] = useState([emptyIngredient])
    const [garnish, setGarnish] = useState('')
    const [method, setMethod] = useState('Shaken')
    const [glass, setGlass] = useState('No glass selected')
    const [info, setInfo] = useState('')

    const [availableIngredients, setAvailableIngredients] = useState([])

    const [ingredientNameDialogVisible, setIngredientNameDialogVisible] = useState(false)
    const [methodDialogVisible, setMethodDialogVisible] = useState(false)
    const [glassDialogVisible, setGlassDialogVisible] = useState(false)
    const [confirmationDialog, setConfirmationDialog] = useState(false)

    const selectCocktail = (selectedId) => {
        if (selectedId) {
            const {
                id,
                name,
                ingredients,
                method,
                glass
            } = props.cocktails.find(cocktail => cocktail.id === selectedId)

            setId(id)
            setName(name)
            setIngredients(ingredients)
            setMethod(method)
            setGlass(glass)
        }

        setAvailableIngredients(Array.from(
            props.cocktails.reduce((acc, cur) => {
                cur.ingredients.forEach(ingredient => acc.add(ingredient.name))
                return acc
            }, new Set())
        ).sort())
        setSelected(name || 'New Cocktail')
    }

    const selectMethod = (selectedMethod) => {
        setMethod(selectedMethod)
        setMethodDialogVisible(false)
    }

    const selectGlass = (selectedGlass) => {
        setGlass(selectedGlass)
        setGlassDialogVisible(false)
    }

    /*
    *  Ingredient list has always an empty item at the end. 
    */
    const setIngredient = (index, field) => (value) => {
        let newIngredients = ingredients.map((ingredient, i) => {
            if (i === index) {
                return { ...ingredient, [field]: value }
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

        setIngredients(newIngredients)
    }

    const getIngredientName = (index) => {
        if (index === false) return ''
        return ingredients[index].name
    }

    const save = () => props.save({ id, name, ingredients: ingredients.slice(0, -1), garnish, method, glass, info })

    const confirmationDialogs = {
        'cancel': {
            message: 'Are you sure you want to cancel?',
            function: props.close,
        },
        'delete': {
            message: 'Are you sure you want to delete?',
            function: props.delete.bind(this, id),
        },
        false: {
            message: '',
            function: () => {}
        }
    }

    return (
        <ScrollView style={styles.editor}>

            <Dialog visible={!selected} close={props.close}>
                <Text style={styles.text}>Select cocktail to edit</Text>
                <TextInput style={[styles.input, styles.cocktailSelect]} placeholder="Search" />
                <FlatList
                    data={[{ name: 'New Cocktail' }].concat(props.cocktails)}
                    renderItem={({ item, index }) =>
                        <TouchableWithoutFeedback onPress={selectCocktail.bind(this, item.id)}>
                            <Text style={[styles.text, styles.cocktailSelect]}>{item.name}</Text>
                        </TouchableWithoutFeedback>}
                    keyExtractor={(item, index) => 'cocktail_' + index}
                />
            </Dialog>

            <Text style={styles.header}>Name</Text>
            <TextInput style={[styles.inputArea, styles.input]} value={name} onChangeText={setName} />

            <Text style={styles.header}>Ingredients</Text>
            <View style={styles.inputArea}>
                {ingredients.map((ingredient, i) => (
                    <View key={'ingredient_' + i} style={styles.ingredientInput}>
                        <Text style={styles.ingredientDot}>{`\u2022`}</Text>
                        <TextInput style={[styles.input, styles.ingredientAmountInput]} value={ingredient.amount} onChangeText={setIngredient(i, 'amount')} />
                        <View style={[styles.ingredientNameInputArea]}>
                            <Text style={[styles.ingredientNameInputText, styles.text]} onPress={setIngredientNameDialogVisible.bind(this, i)}>{ingredient.name}</Text>
                            <Icon name="caret-down" size={24} />
                        </View>
                    </View>
                ))}
            </View>

            <Dialog visible={ingredientNameDialogVisible !== false} close={setIngredientNameDialogVisible.bind(this, false)}>
                <Text style={styles.text}>Ingredient name</Text>
                <TextInput
                    style={styles.input}
                    value={getIngredientName(ingredientNameDialogVisible)}
                    onChangeText={setIngredient(ingredientNameDialogVisible, 'name')}
                    onSubmitEditing={setIngredientNameDialogVisible.bind(this, false)} />
                <FlatList
                    data={availableIngredients}
                    renderItem={({ item }) => {
                        return (
                            <TouchableWithoutFeedback onPress={() => {
                                setIngredient(ingredientNameDialogVisible, 'name')(item)
                                setIngredientNameDialogVisible(false)
                            }}>
                                <Text style={[styles.text]}>{item}</Text>
                            </TouchableWithoutFeedback>
                        )
                    }}
                    keyExtractor={(item, index) => index + item}
                />
            </Dialog>

            <Text style={styles.header}>Garnish</Text>
            <TextInput style={[styles.inputArea, styles.input]} value={garnish} onChangeText={setGarnish} />

            <Text style={styles.header}>Method</Text>
            <Dropdown
                dropdownStyle={[styles.input, styles.inputArea]}
                textStyle={styles.text}
                options={props.availableMethods.map(method => ({ label: method, value: method }))}
                selected={method}
                onSelect={selectMethod} />

            <Text style={styles.header}>Glassware</Text>
            <GlassCard style={[styles.inputArea, styles.input]} select={setGlassDialogVisible.bind(this, true)} glass={glass} />

            <Dialog visible={glassDialogVisible} close={setGlassDialogVisible.bind(this, false)}>
                <FlatList
                    data={props.availableGlasses}
                    renderItem={({ item, index }) => <GlassCard select={selectGlass.bind(this, item)} glass={item} />}
                    keyExtractor={(item, index) => 'glass_' + index}
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
                <Button title="Save" onPress={save} />
                <Button title="Cancel" onPress={setConfirmationDialog.bind(this, 'cancel')} />
                { id && <Button title="Delete" onPress={setConfirmationDialog.bind(this, 'delete')} /> }
            </View>

            <Dialog visible={!!confirmationDialog} close={setConfirmationDialog.bind(this, false)}>
                <View>
                    <Text style={styles.text}>{confirmationDialogs[confirmationDialog].message}</Text>
                    <Button title="Yes" onPress={confirmationDialogs[confirmationDialog].function} />
                    <Button title="No" onPress={setConfirmationDialog.bind(this, false)} />
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
    ingredientInput: {
        flexDirection: 'row',
        marginBottom: 5
    },

    ingredientDot: {
        fontSize: 28
    },
    ingredientAmountInput: {
        marginLeft: 5,
        flex: 2
    },

    ingredientNameInputArea: {
        flexDirection: 'row',
        flex: 10,
        borderWidth: 1,
        borderRadius: 5,
        padding: 3,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 5
    },

    ingredientNameInputText: {
        marginLeft: 5,
        flex: 10,
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
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        paddingLeft: 5,
        paddingRight: 5
    },
    cocktailSelect: {
        marginTop: 3,
        marginBottom: 3
    }
})