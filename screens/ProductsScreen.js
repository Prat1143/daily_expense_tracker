/* eslint-disable prettier/prettier */
import { View, Text, SafeAreaView, ScrollView, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { appBackColor } from '../styles/colors';
import AppTopBar from '../components/AppTopBar';
import { summersImg } from '../assets/images/services';
import { frameIcon, heartIcon, settingIcon } from '../assets/icons';
import { deviceHeight, globalViewHeight } from '../styles/size';
import GlobalMargin from '../components/GlobalMargin';
import ProductCard from '../components/products/ProductCard';
import { getRequest, postRequest } from '../utils/api_call';

const ProductsScreen = ({navigation, route}) => {
  // const [cardData, setCardData] = useState([{},{},{},{}, {}, {}, {}]);

  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const {serviceId, categoryId, productDataArr} = route?.params;

  const [selectedCategories, setSelectedCategories] = useState({});
  const [selectedGender, setSelectedGender] = useState('Unisex');
  const [selectedAgeRangeId, setSelectedAgeRangeId] = useState("0");
  const [checkedBrands, setCheckedBrands] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [selectAllBrands, setSelectAllBrands] = useState(true);
  const [selectAll, setSelectAll] = useState(true);

  useEffect(() => {
    if (route.params?.currentFilters) {
      const { selectedCategories, selectedGender, selectedAgeRangeId, checkedBrands, selectAllBrands, selectAll } = route.params.currentFilters;
      // Update your component's state or UI based on these filters
      console.log("selectAllBrands==========",route.params.currentFilters);
      setSelectedCategories(selectedCategories);
      setSelectedGender(selectedGender);
      setSelectedAgeRangeId(selectedAgeRangeId);
      setCheckedBrands(checkedBrands);
      setSelectAllBrands(selectAllBrands);
      setSelectAll(selectAll);
    }
  }, [route.params?.currentFilters]);

  useEffect(() => {
    if (productDataArr) { 
      console.log("productDataArrrrrrrrrrrrrrrr===========",productDataArr[0])
      setProductData(productDataArr);
      setLoading(false);
    }
   }, [productDataArr]);

  const handleRedirect = async(selectedProduct) => {
    setLoading(true);
    // console.log("GetItemDetails------------=-=-=-=-==============================",resData?.data);

    const res = await getRequest(`/api/Toys/GetItemDetails/${selectedProduct?.id}/${selectedProduct?.serviceId}/`);
    const resData = await res.json();
    // console.log("handleRedirect_resData==============",resData?.data);
    if(resData.success == true) {
      setLoading(false);
      // console.log("GetItemDetails------------=-=-=-=-==============================",resData?.data);
      navigation.navigate('ProductDetails', {selectedProduct:resData?.data});
    }
    //  navigation.navigate('ProductDetails', {selectedProduct:selectedProduct});
    // navigation.navigate('Services', {serviceId: serviceId});
  };

  const getProductDetailsNew = async (nextPg) => {
    setLoading(true);

    try {
    // console.log('servicesId and category id In the products fetch function======-----------------', serviceId, categoryId);
    console.log('pageNumber======-----------------', pageNumber);
    console.log('serviceId======-----------------', pageNumber);
    console.log('categoryId======-----------------', categoryId);
    const selectedIds = Object.keys(selectedCategories).filter(key => selectedCategories[key]).map(Number);
    
    const data = {
      'serviceId': serviceId,
      'categoryId': categoryId,
      'gender':selectedGender,
      'age':selectedAgeRangeId,
      'brandId':checkedBrands,
      'subCategoryId':selectedIds,
      //  'pageNumber': 0,
      'pageNumber': nextPg,
      'selectAllBrands':selectAllBrands
    };
    console.log("getProductDetailsNew=====================",data);
     const res = await postRequest('/api/Toys/GetStoreProducts', JSON.stringify(data), 'POST');
     const resData = await res.json();
     console.log('Store Products Data ---------', resData?.data[0]);
    //  console.log('Store Products Data ---------', resData?.data[0], res.status);
    //  if (res.status === 200) {
    //    setProductData(resData?.data);
    //    setLoading(false);
    //  }

      if (resData.success && resData?.data?.length > 0) {
        // If it's the first page, replace the existing product data
        // For subsequent pages, append the new products to the existing array
        if (nextPg === 0) {
          setProductData(resData.data);
        } else {
          console.log('Store Products Data ---------', resData?.data[0]);
          if(resData?.data?.length > 0) {
            console.log('length greater----------------------', resData?.data[0]);
            setProductData((prevProducts) => [...prevProducts, ...resData.data]);
          }
        }
        setLoading(false);
      } else {
          // Handle error or no more products
          setLoading(false);
      }
    } catch (err) {
     console.log('err', err);
     setLoading(false);
    }
   };

  const getProductDetails = async () => {
    try {
    // console.log('servicesId and category id In the products fetch function======-----------------', serviceId, categoryId);
    console.log('pageNumber======-----------------', pageNumber);
    console.log('serviceId======-----------------', pageNumber);
    console.log('categoryId======-----------------', categoryId);
    const selectedIds = Object.keys(selectedCategories).filter(key => selectedCategories[key]).map(Number);
    
    const data = {
      'serviceId': serviceId,
      'categoryId': categoryId,
      'gender':selectedGender,
      'age':selectedAgeRangeId,
      'brandId':checkedBrands,
      'subCategoryId':selectedIds,
      //  'pageNumber': 0,
      'pageNumber': pageNumber,
      'selectAllBrands':selectAllBrands
    };
    console.log("getProductDetails_data=====================",data);
     const res = await postRequest('/api/Toys/GetStoreProducts', JSON.stringify(data), 'POST');
     const resData = await res.json();
     console.log('Store Products Data ---------', resData);
    //  console.log('Store Products Data ---------', resData?.data[0], res.status);
    //  if (res.status === 200) {
    //    setProductData(resData?.data);
    //    setLoading(false);
    //  }

      if (resData.success) {
        // If it's the first page, replace the existing product data
        // For subsequent pages, append the new products to the existing array
        if (pageNumber === 0) {
          setProductData(resData.data);
        } else {
          setProductData((prevProducts) => [...prevProducts, ...resData.data]);
        }
        setLoading(false);
      } else {
          // Handle error or no more products
          setLoading(false);
      }
    } catch (err) {
     console.log('err', err);
     setLoading(false);
    }
   };

   useEffect(() => {
    if (serviceId && categoryId) {
      getProductDetails(serviceId, categoryId);
    }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [serviceId, categoryId]);

  const handleFilter = () => {
    //  console.log("productData==============",productData);
     navigation.navigate('FilterScreen', {productData:productData, serviceId, categoryId,
      currentFilters: {
        selectedCategories,
        selectedGender,
        selectedAgeRangeId,
        checkedBrands,
        selectAllBrands,
        selectAll
      }
    });
  };

  const handleLoadMore = () => {
    console.log("handleLoadMore_called-----------------------==========================================");

    if (!isFetchingMore) { // Prevent multiple calls
      setIsFetchingMore(true);
      const nextPage = pageNumber + 1;
      console.log("nextPage==========================================", nextPage);
      setPageNumber(nextPage);
      getProductDetailsNew(nextPage).then(() => setIsFetchingMore(false));
    }
  };

  const renderProductCard = ({ item, index }) => (
    <View style={styles.cardSection}>
      <ProductCard item={item} key={index} handleRedirect={() => handleRedirect(item)} />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {loading &&<View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      </View>}
      <AppTopBar navigation={navigation} title={'Products'} />

      <SafeAreaView style={{ flex: 1, backgroundColor: appBackColor, justifyContent: 'center', alignItems: 'center' }} >
        <View style={styles.container} >
          <GlobalMargin />
          {/* <Text style={styles.title} >Products</Text> */}

          {/* <View style={styles.cardSection}>
            {productData.map((item, id) => (
              <ProductCard item={item} key={id} handleRedirect={() => handleRedirect(item)} />
            ))}
          </View> */}

          <View style={{flex:1, marginBottom:50}}>
            {productData?.length > 0 ?
            <FlatList
              data={productData}
              renderItem={renderProductCard}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.cardSection}
              onEndReached={()=> {
                productData?.length > 24 && handleLoadMore()
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={loading && <ActivityIndicator size="large" color="#0000ff" style={styles.pagination_loader} />}
            /> : 
            <Text>No products found.</Text>
            }
          </View>
        </View>
        <View style={styles.bottmBtnContainer} >
          <TouchableOpacity style={styles.bottomBtn} onPress={handleFilter}>
            <Image source={frameIcon} style={styles.bottomIcon} />
            <Text style={styles.btnText} > Sort </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBtn} onPress={handleFilter}>
          {/* <TouchableOpacity style={styles.bottomBtn}> */}
            <Image source={settingIcon} style={styles.bottomIcon} />
            <Text style={styles.btnText} > Filter </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#F9FDFF',
  },
  loader: {
    position:'fixed',
    zIndex:9999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height:'100%'
  },
  pagination_loader: {
    position:'fixed',
    top:deviceHeight*0.5,
    zIndex:9999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height:'100%'
  },
  loaderContainer: {
    position:'absolute',
    zIndex:9999,
    display:'flex',
    height:'100%',
    width:'100%'
  },
  title: {
    color: '#0C0C0C',
    fontFamily: 'DMSans-Bold',
    fontSize: 24,
    fontStyle: 'normal',
  },
  cardSection: {
    flexDirection:'row',
    justifyContent:'space-between',
    flexWrap:'wrap',
    gap: 0,
    marginVertical: 8,
  },
  cardImg: {
    width: 155,
    height: 140,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  heart: {
    width: 20,
    height: 20,
    position: 'absolute',
    right: 15,
    top: 10,
  },
  cardBody: {
    gap: 10,
    backgroundColor: '#FFF',
    borderBottomEndRadius: 6,
    borderBottomStartRadius: 6,
    borderTopLeftRadius: 16,
    paddingHorizontal: 10,
    paddingVertical:10,
    marginTop: -10,
    elevation: 2,
    shadowColor: '#171717',
  },
  cardLayout: {
    marginBottom: 13,
    borderRadius: 30,
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
    bottom: 0,
    left: 0,
    right: 0,
    gap: 0,
    paddingHorizontal: 0,
  },
  bottomBtn: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5EFF2',
    width: '50%',
    height: 44,
    borderRadius: 0,
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

});


export default ProductsScreen;