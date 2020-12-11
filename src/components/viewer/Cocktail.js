import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, FlatList, SwitchComponent } from 'react-native'
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu'
import images from '../../assets/images/glasses'

const Cocktail = (props) => {
    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)
    const [menuIsOpen, setMenuIsOpen] = useState(false)

    const handleClick = () => {
        setShowAdditionalInfo(showAdditionalInfo => !showAdditionalInfo)
    }

    const handleLongPress = () => {
        setMenuIsOpen(true)
    }

    const menuSelect = (value) => {
        switch (value) {
            case 'edit':
                props.actions.openEditor(props.cocktail.id)
                break
            case 'new':
                props.actions.openEditor('')
                break
            case 'delete':
                props.actions.deleteCocktail(props.cocktail.id)
                break
            default: { }
        }
        setMenuIsOpen(false)
    }

    const CocktailText = props => {
        return (
            <Text style={{ ...styles.cocktailText, ...props.style }}>
                {props.children}
            </Text>
        )
    }

    const GarnishText = () => {
        const garnish = 'Garnish: ' + (props.cocktail.garnish || 'No garnish')
        return <CocktailText style={styles.ingredients}>{garnish}</CocktailText>
    }

    const InfoText = () => {
        if (!props.cocktail.info) {
            return null
        }

        return <CocktailText style={styles.infoText}>{props.cocktail.info}</CocktailText>
    }

    const GlassImg = () => {
        if (props.cocktail.glass) {
            return <Image style={styles.glassImg} source={images[props.cocktail.glass]} alt={props.cocktail.glass} />
        }

    }

    const { Popover, SlideInMenu, ContextMenu } = renderers

    const Contents = () => {
        if (!showAdditionalInfo) {
            return <Text style={styles.name}>{props.cocktail.name}</Text>
        }

        return (
            <>
                <View style={styles.headerRow}>
                    <Text style={styles.header}>{props.cocktail.name}</Text>
                    <View style={styles.instructions}>
                        <GlassImg />
                        <Text style={styles.method}> {props.cocktail.method}</Text>
                    </View>
                </View>

                <FlatList
                    style={styles.ingredients}
                    data={props.cocktail.ingredients}
                    keyExtractor={(item, index) => item.id + '_ingredient_' + index}
                    renderItem={({ item }) => {
                        return <CocktailText style={styles.ingredient}>{`\u2022 ${item.amount} ${item.name}`} </CocktailText>
                    }}
                />

                <GarnishText />

                <InfoText />
            </>
        )
    }

    // const EditMenu = () => {
    //     if (props.offline) return null

    //     return (

    //     )
    // }

    return (
        <TouchableWithoutFeedback onPress={handleClick} onLongPress={handleLongPress}>
            <View style={[styles.itemCard, props.selected ? styles.selected : null]}>
                {!props.offline &&
                    <Menu
                        style={styles.menu}
                        opened={menuIsOpen}
                        onBackdropPress={setMenuIsOpen.bind(this, false)}
                        onSelect={menuSelect}
                        renderer={Popover}
                        rendererProps={{ placement: 'top' }}>
                        <MenuTrigger />
                        <MenuOptions style={styles.menuOptions} customStyles={menuOptionCustomStyles}>
                            <MenuOption style={styles.cocktailText} value={'edit'} text='Edit' />
                            <MenuOption value={'delete'} text='Delete' />
                            <MenuOption value={'new'} text='New Cocktail' />
                        </MenuOptions>
                    </Menu>
                }
                <Contents />


            </View>
        </TouchableWithoutFeedback>
    )

}

export default Cocktail

const menuOptionCustomStyles = {
    optionText: {
        fontFamily: 'Alegreya-Medium',
        fontSize: 22
    }
}

const styles = StyleSheet.create({
    itemCard: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        marginVertical: 5,
        padding: 10
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    instructions: {
        alignItems: 'center',
        marginRight: 2
    },
    name: {
        fontFamily: 'CherryCreamSoda-Regular',
        fontSize: 24,
    },
    header: {
        fontFamily: 'CherryCreamSoda-Regular',
        fontSize: 26,
        flex: 1,
    },
    cocktailText: {
        fontFamily: 'Alegreya-Medium',
        fontSize: 22
    },
    ingredients: {
        marginLeft: 10,
        marginBottom: 3
    },
    infoText: {
        marginTop: 10
    },
    glassImg: {
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    method: {
        fontFamily: 'Alegreya-Bold',
        fontSize: 18,
    },
    menuOptions: {
        backgroundColor: 'white',
        margin: -5,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        width: 300,
    },
})