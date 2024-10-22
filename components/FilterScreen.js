/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Button, TextInput, Image } from 'react-native';
import { getRequest, postRequest } from '../utils/api_call';
import AppTopBar from './AppTopBar';
import { deviceWidth, deviceHeight } from '../styles/size';
import CheckBox from '@react-native-community/checkbox';
import { arrowLeftIconBlack } from '../assets/icons';

const FilterScreen = ({ navigation, route }) => {
  const [selectedFilter, setSelectedFilter] = useState('Sub Category');
  const [categoriesArr, setCategoriesArr] = useState([]);
  const {serviceId, categoryId, productData} = route?.params;
  const [selectedCategories, setSelectedCategories] = useState({});
  const [selectedGender, setSelectedGender] = useState('Unisex');
  const [checkedIds, setCheckedIds] = useState([]);
  const [checkedBrands, setCheckedBrands] = useState([]);
  const [ageRanges, setAgeRanges] = useState([]);
  const [selectAll, setSelectAll] = useState(true);
  const [brands, setBrands] = useState([]);
  const [selectedAgeRangeId, setSelectedAgeRangeId] = useState("0");
  const [searchQuery, setSearchQuery] = useState('');
  const [selectAllBrands, setSelectAllBrands] = useState(true);

  const filters = ['Sub Category', 'Gender', 'Age', 'Brand'];
  const genders = ['Unisex', 'Boy', 'Girl'];

  // useEffect(()=>{
  //     getAllCategories();
  //     getAllAges();
  //     getAllBrands();
  // },[]);

  // useEffect(() => {
  //   if (route.params?.currentFilters) {
  //     const { selectedCategories, selectedGender, checkedIds, checkedBrands } = route.params.currentFilters;
  //     console.log("currentFilters=============----------------=",route.params?.currentFilters);
  //     setSelectedCategories(selectedCategories || {});
  //     setSelectedGender(selectedGender || 'Unisex');
  //     setCheckedIds(checkedIds || []);
  //     setCheckedBrands(checkedBrands || []);
  //   } else {
  //     // Fetch filters if no current filters are passed (initial navigation to FilterScreen)
  //     getAllCategories();
  //     getAllAges();
  //     getAllBrands();
  //   }
  // }, []);

  useEffect(() => {
    getAllCategories(); // Always fetch categories
    getAllAges();
    getAllBrands();
  
    if (route.params?.currentFilters) {
      const { selectedCategories, selectedGender, selectedAgeRangeId, checkedBrands, selectAllBrands, selectAll } = route.params.currentFilters;
      console.log("currentFilters--------------",route.params.currentFilters);
      setSelectedCategories(selectedCategories);
      setSelectedGender(selectedGender);
      setSelectedAgeRangeId(selectedAgeRangeId);
      setCheckedBrands(checkedBrands);
      setSelectAllBrands(selectAllBrands);
      setSelectAll(selectAll);
    }
  }, []);

  // useEffect(() => {
  //   if (
  //     checkedIds.length === ageRanges.length - 1 &&
  //     !checkedIds.includes(0) // Assuming IDs are integers and the "ALL AGE GROUP" has ID 0
  //   ) {
  //     setSelectAll(true);
  //   }
  // }, [checkedIds]);

  const getAllBrands = async() => {
    const res = await getRequest(`/api/Toys/GetAllBrands`);
    const resData = await res.json();
    if(resData?.success == true) {
      setBrands(resData?.data);
      console.log("selectAllBrands_currentFilters======================",route.params.currentFilters)
      if(route.params.currentFilters?.selectAllBrands !== false) {
        const allBrandIds = resData.data.map(brand => brand.id);
        setCheckedBrands(allBrandIds);
      }
    }
  };

  const getAllAges = async() => {
    const res = await getRequest(`/api/Toys/GetAge`);
    const resData = await res.json();
    if(resData?.success == true) {
      setAgeRanges(resData?.data);
    }
  };

  const handleSelectAllBrandsToggle = (newValue) => {
    setSelectAllBrands(newValue);
    console.log("newValue==============",newValue);
    if (newValue) {
      // Select all brands
      const allBrandIds = brands.map(brand => brand.id);
      setCheckedBrands(allBrandIds);
    } else {
      // Deselect all brands
      setCheckedBrands([]);
    }
  };

  const handleBrandCheckboxChange = (id, isChecked) => {
    if (isChecked) {
      // Add the ID to the checkedBrands array if it's not already there
      setCheckedBrands(prevIds => [...prevIds, id]);
      if (checkedBrands.length + 1 === brands.length) {
        setSelectAllBrands(true); // If all brands are now selected, also check the "Select All" checkbox
      }
    } else {
      // Remove the ID from the checkedBrands array
      setCheckedBrands(prevIds => prevIds.filter(prevId => prevId !== id));
      setSelectAllBrands(false);
    }
  };

  // const getAllCategories = async() => {
  //     const res = await getRequest(`/api/Toys/GetSubCategories/${categoryId}`);
  //     const resData = await res.json();
  //     if(resData?.success == true) {
  //       setCategoriesArr(resData?.data);
  //       const initialSelections = resData.data.reduce((acc, category) => {
  //         acc[category.id] = false; // Initialize each category as not selected
  //         return acc;
  //       }, {});
  //       setSelectedCategories(initialSelections);
  //     }
  // };

  const getAllCategories = async() => {
    const res = await getRequest(`/api/Toys/GetSubCategories/${categoryId}`);
    const resData = await res.json();
    if(resData?.success) {
      setCategoriesArr(resData.data);
      
      // Adjust initialSelections to respect existing selections from currentFilters
      const initialSelections = resData.data.reduce((acc, category) => {
        if(route.params.currentFilters?.selectAll !== false) {
          acc[category.id] = true;
        } else {
          acc[category.id] = route.params?.currentFilters?.selectedCategories?.[category.id] ?? false;
        }
        // acc[category.id] = route.params?.currentFilters?.selectedCategories?.[category.id] ?? false;
        return acc;
      }, {});
  
      setSelectedCategories(initialSelections);
    }
  };

  const handleSelectAllToggle = (newValue) => {
    setSelectAll(newValue);
    if (newValue) {
      const allSelected = categoriesArr.reduce((acc, category) => {
        acc[category.id] = true; // Select all categories
        return acc;
      }, {});
      setSelectedCategories(allSelected);
    } else {
      const noneSelected = categoriesArr.reduce((acc, category) => {
        acc[category.id] = false; // Deselect all categories
        return acc;
      }, {});
      setSelectedCategories(noneSelected);
    }
  };

  const renderFilterOptions = () => {
    switch (selectedFilter) {
        case 'Sub Category':
        return (
            <SafeAreaView style={{ flex: 1, }} >
              <View style={styles.categoryFilterContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop:10 }}>
                <CheckBox
                  value={selectAll}
                  onValueChange={handleSelectAllToggle}
                />
                <Text style={{ fontWeight:'bold' }}>Select All</Text>
              </View>
              {
                categoriesArr?.length > 0 &&
                categoriesArr.map((val, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CheckBox
                      value={selectedCategories[val.id]}
                      onValueChange={(newValue) => {
                        setSelectedCategories({
                          ...selectedCategories,
                          [val.id]: newValue,
                        });
                      }}
                    />
                    <Text>{val.categoryName}</Text>
                  </View>
                ))
              }
              </View>
            </SafeAreaView>
        );
        case 'Gender':
        return (
          <SafeAreaView style={{ flex: 1, marginTop:30 }} >
            {genders.map((gender, index) => (
              <View key={index} style={styles.genderContainer}>
                <CheckBox
                  value={selectedGender === gender}
                  onValueChange={(newValue) => {
                    if (newValue) {
                      setSelectedGender(gender);
                    }
                  }}
                />
                <Text style={styles.genderText}>{gender}</Text>
              </View>
            ))}
          </SafeAreaView>
        );
        case 'Age':
        return (
          <SafeAreaView style={{ flex: 1, marginTop:30 }}>
            {ageRanges.map((ageRange) => (
              <View key={ageRange.id} style={styles.ageRangeContainer}>
                <CheckBox
                  value={selectedAgeRangeId === ageRange.id}
                  onValueChange={() => setSelectedAgeRangeId(ageRange.id === selectedAgeRangeId ? null : ageRange.id)}
                  style={styles.checkbox}
                />
                <Text style={styles.ageRangeText}>{ageRange.value}</Text>
              </View>
            ))}
          </SafeAreaView>
        );
        case 'Brand':
        return (
          <SafeAreaView style={{ flex: 1, marginTop: 40 }}>
            <View style={styles.brandFilterContainer}>
              {/* <TextInput
                style={styles.searchBar}
                placeholder="Search brands"
                value={searchQuery}
                onChangeText={handleSearchQueryChange}
              /> */}
              {/* <Text>Brand Filter Options</Text> */}
              <ScrollView>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckBox
                    value={selectAllBrands}
                    onValueChange={handleSelectAllBrandsToggle}
                  />
                  <Text style={{ fontWeight:'bold' }}>Select All</Text>
                </View>
                {brands?.length > 0 && brands.map((brand) => (
                  <View key={brand.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CheckBox
                      value={checkedBrands.includes(brand.id)}
                      onValueChange={(isChecked) => handleBrandCheckboxChange(brand.id, isChecked)}
                    />
                    <Text>{brand.brandName}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </SafeAreaView>
        );
      default:
        return <Text>Select a filter</Text>;
    }
  };

  const handleCloseFilter = () => {
    navigation.goBack();
  };

  const handleCheckboxChange = (id, isChecked) => {
    if (id === "0") {
      setSelectAll(!selectAll);
  
      const updatedCheckedIds = isChecked
        ? ageRanges.map((item) => parseInt(item.id, 10))
        : [];
      setCheckedIds(updatedCheckedIds);
    } else {
      const intId = parseInt(id, 10); 
      if (isChecked) {
        setCheckedIds((prevIds) => [...prevIds, intId]);
      } else {
        setCheckedIds((prevIds) => prevIds.filter((prevId) => prevId !== intId));
      }
      if (!isChecked && selectAll) {
        setSelectAll(false);
      }
    }
  };

  const handleApplyFilter = async() => {
    console.log("selectAllBrands------------------===============",selectAllBrands);
    const selectedIds = Object.keys(selectedCategories).filter(key => selectedCategories[key]).map(Number);
    const data = {
      'serviceId': serviceId,
      'categoryId': categoryId,
      'gender': selectedGender,
      'age': selectedAgeRangeId,
      'brandId':checkedBrands,
      'subCategoryId':selectedIds,
      'pageNumber': 0,
      // 'selectAllBrands':selectAllBrands
    };
    
    console.log("filterPayload===============",data);

    const res = await postRequest('/api/Toys/GetStoreProducts', JSON.stringify(data), 'POST');
    const resData = await res.json();

    console.log("data==================",data);
    if(resData?.success == true) {
      console.log("GetStoreProductsLength==================",resData?.data?.length);
      const currentFilters = {
        selectedCategories,
        selectedGender,
        selectedAgeRangeId,
        checkedBrands,
        selectAllBrands:selectAllBrands,
        selectAll:selectAll
        // Include any other relevant filter states
      };
      navigation.navigate('Products', {
        serviceId: serviceId,
        categoryId: categoryId,
        productDataArr: resData?.data?.length > 0 ? resData?.data : [],
        currentFilters, // Pass the current filter states as part of navigation parameters
      });
      // navigation.navigate('Products', {serviceId: serviceId, categoryId: categoryId, productDataArr:resData?.data?.length > 0 ? resData?.data : productData});
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
      {/* <AppTopBar navigation={navigation} title={'Product Filter'} /> */}
      {/* <TouchableOpacity onPress={goBack}  style={styles.arrowIconContainer}>
        <Image source={arrowLeftIconBlack} style={styles.icon} />
      </TouchableOpacity> */}

      <View style={styles.container}>
        <View style={styles.sidebar}>
          {filters.map((filter) => (
            <TouchableOpacity key={filter} onPress={() => setSelectedFilter(filter)}>
              <Text style={styles.filterItem}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.content}>
          {renderFilterOptions()}
        </View>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          onPress={handleCloseFilter}
          style={styles.closeBtn}
        >
          <Text>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleApplyFilter}
          style={styles.applyBtn}
        >
          <Text style={{ color:'#ffffff' }}>Apply</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebar: {
    width: '30%',
    backgroundColor: '#f0f0f0',
    padding: 10,
    paddingTop:40,
  },
  content: {
    width: '70%',
    padding: 10,
  },
  filterItem: {
    paddingVertical: 10,
  },
  categoryFilterContainer: {
    marginTop:30,
  },
  btnContainer: {
    display:'flex',
    flexDirection:'row',
    width:'100%'
  },
  closeBtn: {
    width:'50%',
    backgroundColor:"#ffffff",
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    height:deviceHeight*0.05,
  },
  applyBtn: {
    width:'50%',
    backgroundColor:"#6BD3FB",
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    height:deviceHeight*0.05,
    color:'#ffffff'
  },
  genderFilterContainer: {
    marginTop:30,
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderText: {
    marginLeft: 8,
  },
  ageFilterContainer: {
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  brandFilterContainer: {
    padding: 10,
  },
  ageRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  arrowIconContainer: {
    width: 42,
    height: 42,
    backgroundColor: '#FFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#171717',
    position:'absolute',
    zIndex: 11,
    top: 60,
    left: 20,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default FilterScreen;