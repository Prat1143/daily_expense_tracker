/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { heartIcon } from '../../assets/icons';
import { summersImg } from '../../assets/images/services';
import { API_URL } from '../../constants/constant';
import { deviceWidth } from '../../styles/size';

const ProductCard = ({handleRedirect, item}) => {

  const handleElipseText = (text, max) => {
    let elipseText = text;
    if (text?.length > max) {
      elipseText = text.substr(0, max) + '...';
    }
    return elipseText;
  };

  const handlePrice = (price) => {
   try {
    const priceText = price.split('.')[0];
    return priceText;
   } catch (err) {
    console.log('err', err);
   }
  };

  const handleGetDays = (price) => {
    try {
      const daysPart = price.split('/').pop().trim();
      return daysPart;
  } catch (err) {
     console.log('err', err);
    }
  };

// console.log("item=============",item);
// console.log("item=============",item?.serviceId);
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handleRedirect}  style={[styles.cardLayout]}>
      <View>
        <Image style={styles.cardImg} source={{uri: `${API_URL}/${item?.imageUrl}`}} />
          {/* <Image style={styles.cardImg} source={summersImg} /> */}
          {/* <Image style={styles.heart} source={heartIcon} /> */}
         </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{handleElipseText(item?.productName, 17)}</Text>
            <View style={styles.descContainer} >
              <View>
                <Text style={styles.descText}>Rent</Text>
                {item?.membershipIncluded ? 
                  (item.UserIsSubscribed ?
                    <Text style={styles.textBlue} >₹{handlePrice(item?.mrp)} </Text> :
                    <Text style={styles.textBlue} >₹{handlePrice(item?.platiniumPrice)} </Text>
                  ) : 
                  (
                    item.PlatiniumPrice ?
                    <Text style={styles.textBlue} >₹{handlePrice(item?.mrp)} </Text> :
                    <Text style={styles.textBlue} >₹{handlePrice(item?.mrp)} </Text>
                  )
                }
                {/* <Text style={styles.textBlue} >₹{item?.platiniumPrice!== null ? handlePrice(item?.platiniumPrice) : handlePrice(item?.mrp)} </Text> */}
              </View>
              <View>
                <Text style={styles.descText}>{item?.platiniumPrice!== null ? handleGetDays(item?.platiniumPrice) : "N/A"}</Text>
                {item?.membershipIncluded && 
                  (item.UserIsSubscribed ?
                    <Text style={styles.textGrey}>₹{handlePrice(item?.platiniumPrice)} </Text> :
                    <Text style={styles.textGrey}>₹{handlePrice(item?.discountedPrice)} </Text>
                  ) 
                }

                {/* {
                  item?.serviceId !== 2 && item?.serviceId !== 3 ?
                  <Text style={styles.textGrey}>₹{handlePrice(item?.mrp)} </Text> : null
                } */}
                {/* <Text style={styles.textGrey}>₹{handlePrice(item?.mrp)} </Text> */}
              </View>
              {
                item?.serviceId !== 2 && item?.serviceId !== 3 && item?.membershipIncluded == true ?
                  <View>
                    <Text style={styles.textRed}>(35% Off)</Text>
                    <Text style={styles.textRed}>Member</Text>
                  </View>
                : null
              }
            </View>
          </View>
        </TouchableOpacity>
  );
};

const styles = StyleSheet.create({

    cardImg: {
        width: deviceWidth * 0.45,
        height: deviceWidth * 0.39,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        resizeMode:'contain',
      },
      heart: {
        width: 20,
        height: 20,
        position: 'absolute',
        right: 15,
        top: 10,
      },
      cardBody: {
        gap: 2,
        backgroundColor: '#FFF',
        borderBottomEndRadius: 6,
        borderBottomStartRadius: 6,
        borderTopLeftRadius: 16,
        paddingHorizontal: 10,
        paddingVertical:10,
        marginTop: -10,
        elevation: 2,
        shadowColor: '#171717',
        // width:'100%',
        width: deviceWidth * 0.45,
      },
      cardLayout: {
        marginBottom: 13,
        borderRadius: 30,
        width:'48%',
        marginRight:'50px'
      },
      cardTitle: {
        color: '#1F1F1F',
        fontFamily: 'DMSans-Bold',
        fontSize: 13,
        textTransform:'capitalize',
      },
      cardDesc: {
        color: '#1F1F1F',
        fontFamily: 'DMSans-Regular',
        fontSize: 13,
      },
      descContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      descText: {
        color: '#545454',
        fontSize: 10,
        fontFamily: 'DMSans-Rehular',
      },
      textBlue: {
        color: '#50BFE9',
        fontSize: 14,
        fontFamily: 'DMSans-Bold',
      },
      textGrey: {
        color: '#A5A5A5',
        fontSize: 12,
        fontFamily: 'DMSans-Regular',
        textDecorationLine: 'line-through',
      },
      textRed: {
        color: '#EB5F0A',
        fontSize: 10,
      },
      bottmBtnContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        gap: 15,
        paddingHorizontal: 20,
      },
      bottomBtn: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5EFF2',
        width: 152,
        height: 44,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
        gap:2,
        elevation: 2,
        shadowColor: '#171717',
      },
      btnText: {
        color:'#454545',
        alignItems:'center',
        fontFamily: 'DMSans-Semibold',
        fontSize: 16,
        justifyContent:'center',
      },
      bottomIcon: {
        width: 20,
        height: 20,
      },
})

export default ProductCard