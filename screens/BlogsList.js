import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, Dimensions, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native';
import { deviceHeight, deviceWidth } from '../styles/size';
import AppTopBar from '../components/AppTopBar';
import { API_URL } from '../constants/constant';
import RenderHtml from 'react-native-render-html';
import { getRequest } from '../utils/api_call';

function stripHtml(html) {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
}

const BlogsList = ({ route, navigation }) => {
    const { width } = useWindowDimensions();
    const [blogsArr, setBlogsArr] = useState([]);

    useEffect(()=> {
        getAllBlogs();
    },[]);

    const truncateHtml = (htmlContent) => {
        const textContent = stripHtml(htmlContent);
        const maxLength = 50; // Max length of text content
        if (textContent.length <= maxLength) return { html: htmlContent }; // Return full content if within limit

        // Truncate and add ellipsis
        const truncatedText = textContent.substring(0, maxLength) + '...';
        return { html: `<p>${truncatedText}</p>` }; // You might want to handle HTML tags better
    };

    const renderBlogItem = ({ item }) => (
        <TouchableOpacity style={styles.blogCard} onPress={() => navigation.navigate('BlogDetails', {blogData:item})}>
            <Image
                source={{ uri: API_URL + item.blogCoverImageUrl }}
                style={styles.blogImage}
            />
            <View style={styles.blogInfo}>
                <Text style={styles.blogTitle}>{item.blogTitle}</Text>
                <Text style={styles.blogDate}>{item.date || 'No date provided'}</Text>
                <RenderHtml
                    contentWidth={width}
                    source={truncateHtml(item.description)}
                />
                {/* <Text style={styles.blogDescription}>
                    {item.description.substring(0, 50)}...
                </Text> */}
            </View>
        </TouchableOpacity>
    );

    const getAllBlogs = async() => {
        const res = await getRequest('/api/Toys/GetAllBlogs');
        const resData = await res.json();
        setBlogsArr(resData?.data);
        console.log("resData-------------",resData?.data[1]);
    }

    return (
        <SafeAreaView style={styles.container}>
            <AppTopBar navigation={navigation} title={'Blogs'} />
            <FlatList
                data={blogsArr}
                renderItem={renderBlogItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 10,
        marginTop: 30
    },
    blogCard: {
        flexDirection: 'row',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    blogImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 10,
    },
    blogInfo: {
        flex: 1,
    },
    blogTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    blogDate: {
        fontSize: 12,
        color: '#666',
    },
    blogDescription: {
        fontSize: 12,
        color: '#666',
    },
});

export default BlogsList;