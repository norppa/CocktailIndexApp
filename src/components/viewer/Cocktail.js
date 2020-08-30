import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, FlatList } from 'react-native';
import images from '../../assets/images/glasses'

const Cocktail = (props) => {
    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)
    // let [fontsLoaded] = useFonts({ CherryCreamSoda_400Regular, Alegreya_500Medium, Alegreya_700Bold })

    const handleClick = () => {
        if (props.selected && showAdditionalInfo) {
            setShowAdditionalInfo(false)
            props.select()
        } else if (!props.selected && !showAdditionalInfo) {
            setShowAdditionalInfo(true)
            props.select()
        } else if (!props.selected && showAdditionalInfo) {
            setShowAdditionalInfo(false)
        } else if (props.selected && !showAdditionalInfo) {
            // impossible by logic
            setShowAdditionalInfo(true)
        }
    }
    // const handleClick = () => {
    //     if (showFullInfo) {
    //         setShowFullInfo(false)
    //     } else {
    //         setShowFullInfo(true)
    //         props.scrollTo(props.index)
    //     }
    // }

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

    if (!showAdditionalInfo) {
        return (
            <TouchableWithoutFeedback onPress={handleClick}>
                <View style={[styles.itemCard, props.selected ? styles.selected : null]}>
                    <Text style={styles.name}>{props.cocktail.name}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    } else {
        return (
            <TouchableWithoutFeedback onPress={handleClick}>
                <View style={[styles.itemCard, props.selected ? styles.selected : null]}>
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

                </View>
            </TouchableWithoutFeedback>
        )
    }

}

export default Cocktail

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
    selected: {
        borderWidth: 3
    }

})