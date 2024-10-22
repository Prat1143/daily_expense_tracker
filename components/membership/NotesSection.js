/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Image } from 'react-native';
import { deviceWidth } from '../../styles/size';
import { checkSquareBlueIcon } from '../../assets/icons';

const NotesSection = () => {
  return (
    <View>
        <Text style={styles.noteText}>Notes</Text>
        <View style={styles.cardContainer}>
                <View style={styles.card}>
                    <Image style={styles.icon} source={checkSquareBlueIcon} />
                    <Text style={styles.cardText} >
                        Registration and security deposit for membership
                        activation will charge 1st time only. Pay only
                        Rent recharge amount as per plan opted after 
                        expire of old plan.
                    </Text>
                </View>
                <View style={styles.card}>
                    <Image style={styles.icon} source={checkSquareBlueIcon} />
                    <Text style={styles.cardText} >
                    For up-gradation balance amount shall be 
                    added to new plan with validity of new membership 
                    plan and its benefit.
                    </Text>
                </View>
                <View style={styles.card}>
                    <Image style={styles.icon} source={checkSquareBlueIcon} />
                    <Text style={styles.cardText} >
                    In Case of Pause of service for resumption nominal ₹50 
                    will be charged for delivery.(Applicable on Gold Plan 
                    Onward)
                    </Text>
                </View>
                <View style={[styles.card, {borderBottomWidth:0}]}>
                    <Image style={styles.icon} source={checkSquareBlueIcon} />
                    <Text style={styles.cardText} >
                    Transportation Benefits are applicable upto 5Km distance
                        from center.
                    </Text>
                </View>
            </View>
    </View>
  );
};

const styles = StyleSheet.create({
    noteText: {
        color: '#0C0C0C',
        fontFamily:'DMSans-Bold',
        fontSize:20,
        marginVertical:20,
    },
    cardContainer: {
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#171717',
        marginBottom: 20,
    },
    card: {
        flexDirection:'row',
        gap: 13,
        borderBottomWidth: 1,
        borderBottomColor: '#E2EBF0',
        paddingVertical:10,
    },
    icon: {
        width: deviceWidth * 0.056,
        height: deviceWidth * 0.056,
    },
    cardText: {
        color: '#454545',
        fontFamily: 'DMSans-Regular',
        fontSize: 13,
        width: '90%',
        lineHeight: 21,
    },
});

export default NotesSection;