import React, { useState, useRef } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'

import GlassCard from './GlassCard'
import SelectCocktailDialog from './SelectCocktailDialog'
import SelectMethodDialog from './SelectMethodDialog'
import IngredientNameDialog from './IngredientNameDialog'
import SelectGlassDialog from './SelectGlassDialog'
import ConfirmationDialog from './ConfirmationDialog'
import MandatoryAlert from './MandatoryAlert'
import { Header,  Button, TextInput, Dropdown } from '../common/styledComponents'

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
            setIngredients(ingredients.concat(emptyIngredient))
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



            <Header>Name</Header>
            <TextInput ref={nameInput} style={styles.indented} value={name} onChangeText={setName} />
            <MandatoryAlert style={styles.indented} type={alerts.NO_NAME} value={alert} />

            <Header>Ingredients</Header>
            <View style={styles.indented}>
                {ingredients.map((ingredient, i) => (
                    <View key={'ingredient_' + i} style={styles.ingredientInput}>
                        <Icon name="dot-single" size={32}/>
                        <TextInput
                            ref={i === 0 ? ingredientInput : null}
                            style={styles.ingredientAmountInput}
                            value={ingredient.amount}
                            onChangeText={setIngredient(i, 'amount')} />
                        <Dropdown
                            style={styles.ingredientNameInput}
                            value={ingredient.name}
                            onPress={openIngredientNameDialog.bind(this, i)} />
                    </View>
                ))}
            </View>
            <MandatoryAlert style={styles.indented} type={alerts.NO_INGREDIENTS} value={alert} />

            <Header>Garnish</Header>
            <TextInput style={styles.indented} value={garnish} onChangeText={setGarnish} />

            <Header>Method</Header>
            <Dropdown style={styles.indented} value={method} onPress={setDialog.bind(this, 'method')} />

            <Header>Glassware</Header>
            <GlassCard style={styles.indented} select={setDialog.bind(this, 'glass')} glass={glass} />

            <Header>Information</Header>
            <TextInput
                value={info}
                multiline={true}
                style={[styles.indented, { textAlignVertical: 'top' }]}
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
        marginLeft: 10,
        marginBottom: 30,
        paddingRight: 15
    },
    indented: {
        marginLeft: 30
    },

    ingredientInput: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    ingredientAmountInput: {
        width: 50,
        height: 38,
    },
    ingredientNameInput: {
        marginLeft: 5,
        flexGrow: 1,
        height: 38
    },

    buttons: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
})