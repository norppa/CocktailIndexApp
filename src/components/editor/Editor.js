import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableWithoutFeedback, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

import Dialog from '../common/Dialog'
import Button from '../common/Button'
import Dropdown from '../common/Dropdown'
import GlassCard from './GlassCard'
import SelectCocktailDialog from './SelectCocktailDialog'
import SelectMethodDialog from './SelectMethodDialog'
import IngredientNameDialog from './IngredientNameDialog'
import SelectGlassDialog from './SelectGlassDialog'
import ConfirmationDialog from './ConfirmationDialog'
import MandatoryAlert from './MandatoryAlert'

const emptyIngredient = { name: '', amount: '' }
const alerts = {
    NO_NAME: 'This cocktail needs a name!',
    NO_INGREDIENTS: 'This cocktail needs some ingredients!'
}

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

    const [dialog, setDialog] = useState(false)
    const [editedIngredientIndex, setEditedIngredientIndex] = useState(0)
    const [confirmationDialogType, setConfirmationDialogType] = useState('cancel')
    const [alert, setAlert] = useState(false)

    const nameInput = useRef(null)
    const ingredientInput = useRef(null)

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
            setIngredients(ingredients.length > 0 ? ingredients : [emptyIngredient])
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
        setDialog(false)
    }

    const selectGlass = (selectedGlass) => {
        setGlass(selectedGlass)
        setDialog(false)
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

    const openIngredientNameDialog = (index) => {
        setEditedIngredientIndex(index)
        setDialog('ingredient')
    }

    const openConfirmationDialog = (type) => {
        setConfirmationDialogType(type)
        setDialog('confirmation')
    }

    const save = () => {
        if (!name) {
            setAlert(alerts.NO_NAME)
            setTimeout(() => setAlert(false), 5000)
            nameInput.current.focus()
            return
        }
        if (ingredients.length === 1) { // only the empty ingredient
            setAlert(alerts.NO_INGREDIENTS)
            setTimeout(() => setAlert(false), 5000)
            ingredientInput.current.focus()
            return
        }
        console.log('saving', { id, name, ingredients: ingredients.slice(0, -1), garnish, method, glass, info })
        props.save({ id, name, ingredients: ingredients.slice(0, -1), garnish, method, glass, info })
    }

    const confirmationDialogs = {
        'cancel': {
            message: 'Are you sure you want to cancel?',
            action: props.close,
        },
        'delete': {
            message: 'Are you sure you want to delete?',
            action: props.delete.bind(this, id),
        },
    }

    return (
        <ScrollView style={styles.editor}>

            <SelectCocktailDialog
                visible={!selected}
                close={props.close}
                cocktails={props.cocktails}
                selectCocktail={selectCocktail} />

            <IngredientNameDialog
                visible={dialog === 'ingredient'}
                close={setDialog.bind(this, false)}
                availableIngredients={availableIngredients}
                ingredientIndex={editedIngredientIndex}
                value={editedIngredientIndex === false ? '' : ingredients[editedIngredientIndex].name}
                setIngredient={setIngredient} />

            <SelectMethodDialog
                visible={dialog === 'method'}
                close={setDialog.bind(this, false)}
                methods={props.availableMethods}
                selectMethod={selectMethod} />

            <SelectGlassDialog
                visible={dialog === 'glass'}
                close={setDialog.bind(this, false)}
                availableGlasses={props.availableGlasses}
                selectGlass={selectGlass} />

            <ConfirmationDialog
                visible={dialog === 'confirmation'}
                close={setDialog.bind(this, false)}
                message={confirmationDialogs[confirmationDialogType].message}
                action={confirmationDialogs[confirmationDialogType].action} />



            <Text style={styles.header}>Name</Text>
            <TextInput
                ref={nameInput}
                style={[styles.inputArea, styles.input]}
                value={name}
                onChangeText={setName} />
            <MandatoryAlert style={styles.inputArea} type={alerts.NO_NAME} value={alert} />


            <Text style={styles.header}>Ingredients</Text>
            <View style={styles.inputArea}>
                {ingredients.map((ingredient, i) => (
                    <View key={'ingredient_' + i} style={styles.ingredientInput}>
                        <Text style={styles.ingredientDot}>{`\u2022`}</Text>
                        <TextInput
                            ref={i === 0 ? ingredientInput : null}
                            style={[styles.input, styles.ingredientAmountInput]}
                            value={ingredient.amount}
                            onChangeText={setIngredient(i, 'amount')} />
                        <View style={[styles.ingredientNameInputArea]}>
                            <Text style={[styles.ingredientNameInputText, styles.text]} onPress={openIngredientNameDialog.bind(this, i)}>{ingredient.name}</Text>
                            <Icon name="caret-down" size={24} />
                        </View>
                    </View>
                ))}
            </View>
            <MandatoryAlert style={styles.inputArea} type={alerts.NO_INGREDIENTS} value={alert} />

            <Text style={styles.header}>Garnish</Text>
            <TextInput style={[styles.inputArea, styles.input]} value={garnish} onChangeText={setGarnish} />

            <Text style={styles.header}>Method</Text>
            <Dropdown style={[styles.inputArea, styles.input]} value={method} onPress={setDialog.bind(this, 'method')} />

            <Text style={styles.header}>Glassware</Text>
            <GlassCard style={[styles.inputArea, styles.input]} select={setDialog.bind(this, 'glass')} glass={glass} />

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
                <Button title="Cancel" onPress={openConfirmationDialog.bind(this, 'cancel')} />
                {id && <Button title="Delete" onPress={openConfirmationDialog.bind(this, 'delete')} />}
            </View>

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
})