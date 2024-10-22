import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { deviceHeight, deviceWidth } from '../styles/size';
import AppTopBar from '../components/AppTopBar';
import { API_URL } from '../constants/constant';
import RenderHtml from 'react-native-render-html';

const BlogDetails = ({ route, navigation }) => {
    const { blogData } = route.params;
    const { width: screenWidth } = Dimensions.get('window');

    useEffect(() => {
        console.log("BlogDetailssss------------------------",blogData);
    }, []);

    const detailsSource = { html: blogData?.description };

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <AppTopBar navigation={navigation} title={'Blogs'} />
            <ScrollView style={styles.blogDetails} contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.detailsContainer}>
                    <View>
                        <Image source={{uri: `${API_URL}${blogData?.blogCoverImageUrl}`}} style={styles.productImage} />
                    </View>

                    <View style={styles.blogTitleContainer}>
                        <View>
                            <Text style={styles.blogTitle}>{blogData?.blogTitle}</Text>
                        </View>
                        <View><Text>{blogData?.date}12-12-1234</Text></View>
                    </View>

                    <RenderHtml contentWidth={screenWidth} source={detailsSource} style={styles.text1} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    detailsContainer: {
        marginTop:50,
        paddingHorizontal:10
    },
    productImage: {
        width: '100%',
        height: deviceHeight * 0.22,
        borderRadius:16,
        resizeMode: 'contain',
    },
    blogTitleContainer: {
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row',
        paddingTop:10
    },
    blogTitle: {
        fontSize:16,
        fontWeight:'bold'
    },
    blogDetails: {
        flex:1,
        marginTop:15,
        marginBottom:20,
        // height:'100%'
    },
    scrollViewContent: {
        paddingBottom: 10,
    },
});

export default BlogDetails;