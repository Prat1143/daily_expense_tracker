/* eslint-disable prettier/prettier */
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Image, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { appBackColor } from '../styles/colors';
import AppTopBar from '../components/AppTopBar';
import { profileImg } from '../assets/images/account';
import { deviceHeight, deviceWidth } from '../styles/size';
import GlobalMargin from '../components/GlobalMargin';
import { microphoneIcon, sendIcon, smileIcon } from '../assets/icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { Host, Portal } from 'react-native-portalize';

const ChatScreen = ({navigation}) => {

    const [chatMssg, setChatMssg] = useState('');
    const scrollViewRef = useRef(null);
    const [scrollViewHeight, setScrollViewHeight] = useState(deviceHeight * 0.77);



    console.log('devie', deviceHeight);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);
    
        return () => {
          keyboardDidShowListener.remove();
          keyboardDidHideListener.remove();
        };
      }, []);

    useEffect(() => {
        scrollToBottom();
      }, []);

      const scrollToBottom = () => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      };

      const keyboardDidShow = () => {
        setScrollViewHeight(deviceHeight * 0.45);
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }
      };

      const keyboardDidHide = () => {
        setScrollViewHeight(deviceHeight * 0.77);
      };


  return (
    <Host>
        <SafeAreaView style={styles.container} >
        <AppTopBar navigation={navigation} title={'Marquee Caudoll'} />
        <GlobalMargin />
        <View style={styles.chatContainer} >
        <Portal >
        <View style={styles.timingSection}>
            <View style={styles.timingContainer} >
            <Text style={styles.timingText} >Today</Text>
            </View>
            </View>
        </Portal>
        <View style={{height: scrollViewHeight}} >
        <ScrollView  ref={scrollViewRef}  >
            <View  >
                <View style={styles.senderMssgSection} >
                <View style={styles.avatarContainer} >
                        <Image source={profileImg} style={styles.avatarImg} />
                    </View>
                    <View style={styles.senderMssgContainer}>
                        <Text style={styles.senderMssgText} >
                        Hi Jaime, thanks for adding me.
                        </Text>
                        <View style={styles.timeContainer} >
                        <Text style={styles.timeText} >10:30 PM</Text>
                    </View>
                    </View>
                </View>


                <View style={styles.receiverMssgSection} >
                    <View style={styles.receiverMssgContainer}>
                        <Text style={styles.receiverMssgText} >
                        Hi Jaime, thanks for adding me.
                        </Text>
                        <View style={[styles.timeContainer, {right:0}]} >
                        <Text style={styles.timeText} >10:42 PM</Text>
                    </View>
                    </View>
                    <View style={styles.avatarContainer} >
                        <Image source={profileImg} style={styles.avatarImg} />
                    </View>
                </View>

                <View style={styles.senderMssgSection} >
                <View style={styles.avatarContainer} >
                        <Image source={profileImg} style={styles.avatarImg} />
                    </View>
                    <View style={styles.senderMssgContainer}>
                        <Text style={styles.senderMssgText} >
                        Hi Jaime, thanks for adding me.
                        </Text>
                        <View style={styles.timeContainer} >
                        <Text style={styles.timeText} >10:30 PM</Text>
                    </View>
                    </View>
                </View>

                <View style={styles.receiverMssgSection} >
                    <View style={styles.receiverMssgContainer}>
                        <Text style={styles.receiverMssgText} >
                        Hi Jaime, thanks for adding me.
                        </Text>
                        <View style={[styles.timeContainer, {right:0}]} >
                        <Text style={styles.timeText} >10:42 PM</Text>
                    </View>
                    </View>
                    <View style={styles.avatarContainer} >
                        <Image source={profileImg} style={styles.avatarImg} />
                    </View>
                </View>

                <View style={styles.senderMssgSection} >
                <View style={styles.avatarContainer} >
                        <Image source={profileImg} style={styles.avatarImg} />
                    </View>
                    <View style={styles.senderMssgContainer}>
                        <Text style={styles.senderMssgText} >
                        Hi Jaime, thanks for adding me.
                        </Text>
                        <View style={styles.timeContainer} >
                        <Text style={styles.timeText} >10:30 PM</Text>
                    </View>
                    </View>
                </View>

                <View style={styles.receiverMssgSection} >
                    <View style={styles.receiverMssgContainer}>
                        <Text style={styles.receiverMssgText} >
                        Hi Jaime, thanks for adding me.
                        </Text>
                        <View style={[styles.timeContainer, {right:0}]} >
                        <Text style={styles.timeText} >10:42 PM</Text>
                    </View>
                    </View>
                    <View style={styles.avatarContainer} >
                        <Image source={profileImg} style={styles.avatarImg} />
                    </View>
                </View>

                <View style={styles.senderMssgSection} >
                <View style={styles.avatarContainer} >
                        <Image source={profileImg} style={styles.avatarImg} />
                    </View>
                    <View style={styles.senderMssgContainer}>
                        <Text style={styles.senderMssgText} >
                        Hi Jaime, thanks for adding me.
                        </Text>
                        <View style={styles.timeContainer} >
                        <Text style={styles.timeText} >10:30 PM</Text>
                    </View>
                    </View>
                </View>

                <View style={styles.receiverMssgSection} >
                    <View style={styles.receiverMssgContainer}>
                        <Text style={styles.receiverMssgText} >
                        Hi Jaime, thanks for adding me.
                        </Text>
                        <View style={[styles.timeContainer, {right:0}]} >
                        <Text style={styles.timeText} >10:42 PM</Text>
                    </View>
                    </View>
                    <View style={styles.avatarContainer} >
                        <Image source={profileImg} style={styles.avatarImg} />
                    </View>
                </View>
            </View>
            <View style={[styles.typingContainer, {opacity:1}]}>
            <View style={styles.avatarContainer} >
                <Image source={profileImg} style={styles.avatarImg} />
            </View>
            <Text style={styles.typingText}>Marquee is typing...</Text>
        </View>
        </ScrollView>
        </View>
        </View>
        <View style={styles.searchBarContainer}>
      <TouchableOpacity onPress={() => {/* handle smile icon press */}}>
        <Image source={smileIcon} style={styles.icon} />
      </TouchableOpacity>
      <TextInput
        style={styles.textInput}
        onChangeText={(text) => setChatMssg(text)}
        placeholderTextColor={'#A0A0A0'}
        placeholder="Type something..."
      />
      <View style={{flexDirection:'row', alignItems:'center', gap:10}} >
      <TouchableOpacity >
        <Image source={microphoneIcon} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity >
        <LinearGradient
        colors={['#f57223', '#ff914e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
         style={styles.sendIconContainer}>
        <Image source={sendIcon} style={styles.icon} />
        </LinearGradient>
      </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
    </Host>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appBackColor,
    },
    chatContainer: {
        borderRadius:16,
        backgroundColor:'#FFF',
        // elevation:2,
        // shadowColor:'#171717',
        marginLeft:10,
        // height: deviceHeight * 0.775,
        width:deviceWidth * 0.93,
        position:'relative',
        paddingHorizontal:4,
    },
    timingSection : {
        borderRadius: 8,
        padding: 14,
        paddingVertical: 5,
        justifyContent:'center',
        position:'absolute',
        backgroundColor:'#FFF',
        top: deviceHeight * 0.16,
        left: '40%',
        borderWidth: 5,
        borderTopWidth: 0,
        borderColor: appBackColor,
    },
    timingContainer: {
         elevation:2,
        shadowColor:'#171717',
    },
    timingText: {
        color: '#454545',
        elevation:2,
        shadowColor:'#171717',
    },
    senderMssgSection: {
        flexDirection:'row',
        gap: 10,
        alignItems:'flex-end',
        marginTop: 20,
        // marginBottom:10,
        paddingBottom:20,
        // justifyContent:'flex-end',
    },
    avatarContainer: {
        width: deviceWidth * 0.078,
        height: deviceWidth * 0.078,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: '#FFF',
        elevation: 2,
        shadowColor: '#171717',
    },
    avatarImg: {
        width: deviceWidth * 0.078,
        height: deviceWidth * 0.078,
        borderRadius: 28,
    },
    senderMssgContainer: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        borderBottomStartRadius: 2,
        elevation: 2,
        shadowColor: '#171717',
        paddingHorizontal: 20,
        paddingVertical: 10,
        width:'70%',
    },
    senderMssgText: {
        color: '#454545',
        fontFamily: 'DMSans-Regular',
        fontSize: 14,
    },
    timeContainer: {
        position:'absolute',
        bottom: -20,
    },
    timeText: {
        color: '#7D7D7D',
        fontFamily: 'DMSans-Regular',
        fontSize: 11,
    },


    receiverMssgSection: {
        flexDirection:'row',
        gap: 10,
        alignItems:'flex-end',
        marginTop: 20,
        justifyContent:'flex-end',
        paddingBottom:20,
    },
    receiverMssgContainer: {
        width: '70%',
        backgroundColor: '#56C4ED',
        elevation: 2,
        shadowColor: '#171717',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 16,
        borderBottomEndRadius: 2,
    },
    receiverMssgText: {
        color: '#FFF',
        fontFamily: 'DMSans-Regular',
        fontSize: 14,
    },
    typingContainer: {
        flexDirection:'row',
        alignItems:'center',
        gap: 10,
        marginVertical:10,
    },
    typingText: {
        color: '#8F8F8F',
        fontFamily:'DMSans-Regular',
        fontSize: 14,
    },

    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginHorizontal: 10,
        borderRadius: 60,
        backgroundColor:'#FFF',
        marginTop:10,
        elevation: 2,
        shadowColor: '#171717',
      },
      textInput: {
        flex: 1,
        borderRadius: 5,
        padding: 10,
        paddingVertical: 12,
        fontFamily: 'DMSans-Regular',
        fontSize: 14,
        color: '#8F8F8F',
      },
      icon: {
        marginHorizontal: 5,
        width: 22,
        height: 22,
      },
      sendIconContainer: {
        borderRadius: 100,
        backgroundColor: '#F57223',
        width: deviceWidth * 0.123,
        height: deviceWidth * 0.123,
        alignItems:'center',
        justifyContent:'center',
      },
});

export default ChatScreen;