import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import TransactionTable from '../components/home/TransactionTable';
import PaginationControls from '../components/home/PaginationControls';
import CustomBottomTabBar from '../navigation/CustomBottomTabBar';
import SQLite from 'react-native-sqlite-storage';

const HomeScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [companies, setCompanies] = useState(['all']);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const itemsPerPage = 10;

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const db = await SQLite.openDatabase({ name: 'SmsDatabase.db', location: 'default' });
      const offset = (currentPage - 1) * itemsPerPage;
      
      let query = `SELECT * FROM sms_transactions WHERE timestamp BETWEEN ? AND ?`;
      let params = [startDate.getTime(), endDate.getTime()];

      if (selectedType !== 'all') {
        query += ` AND type = ?`;
        params.push(selectedType);
      }

      if (selectedCompany !== 'all') {
        query += ` AND company = ?`;
        params.push(selectedCompany);
      }

      query += ` ORDER BY timestamp DESC LIMIT ? OFFSET ?`;
      params.push(itemsPerPage, offset);

      db.transaction((tx) => {
        tx.executeSql(
          query,
          params,
          (tx, results) => {
            const data = [];
            for (let i = 0; i < results.rows.length; i++) {
              data.push(results.rows.item(i));
            }
            setTransactions(data);
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching transactions:', error);
            setLoading(false);
          }
        );

        // Get total count for pagination
        let countQuery = `SELECT COUNT(*) as count FROM sms_transactions WHERE timestamp BETWEEN ? AND ?`;
        let countParams = [startDate.getTime(), endDate.getTime()];

        if (selectedType !== 'all') {
          countQuery += ` AND type = ?`;
          countParams.push(selectedType);
        }

        if (selectedCompany !== 'all') {
          countQuery += ` AND company = ?`;
          countParams.push(selectedCompany);
        }

        tx.executeSql(
          countQuery,
          countParams,
          (tx, results) => {
            const totalCount = results.rows.item(0).count;
            setTotalPages(Math.ceil(totalCount / itemsPerPage));
          },
          (error) => {
            console.error('Error getting count:', error);
          }
        );
      });
    } catch (error) {
      console.error('Error opening database:', error);
      setLoading(false);
    }
  }, [currentPage, startDate, endDate, selectedType, selectedCompany]);

  const fetchCompanies = useCallback(async () => {
    try {
      const db = await SQLite.openDatabase({ name: 'SmsDatabase.db', location: 'default' });
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT DISTINCT company FROM sms_transactions',
          [],
          (tx, results) => {
            const companyList = ['all'];
            for (let i = 0; i < results.rows.length; i++) {
              companyList.push(results.rows.item(i).company);
            }
            setCompanies(companyList);
          },
          (error) => {
            console.error('Error fetching companies:', error);
          }
        );
      });
    } catch (error) {
      console.error('Error opening database:', error);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
    fetchCompanies();
  }, [fetchTransactions, fetchCompanies]);

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Transaction History</Text>
        
        <View style={styles.filterContainer}>
          <View style={styles.datePickerContainer}>
            <Text>Start Date:</Text>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
              <Text>{startDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={onStartDateChange}
              />
            )}
          </View>
          <View style={styles.datePickerContainer}>
            <Text>End Date:</Text>
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
              <Text>{endDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={onEndDateChange}
              />
            )}
          </View>
          <View>
            <View style={styles.pickerContainer}>
              <Text>Type:</Text>
              <Picker
                selectedValue={selectedType}
                onValueChange={(itemValue) => setSelectedType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="All" value="all" />
                <Picker.Item label="Credit" value="credit" />
                <Picker.Item label="Debit" value="debit" />
              </Picker>
            </View>
            <View style={styles.pickerContainer}>
              <Text>Company:</Text>
              <Picker
                selectedValue={selectedCompany}
                onValueChange={(itemValue) => setSelectedCompany(itemValue)}
                style={styles.picker}
              >
                {companies.map((company, index) => (
                  <Picker.Item key={index} label={company != null ? company : 'No Company'} value={company} />
                ))}
              </Picker>
            </View>
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={fetchTransactions}>
            <Text style={styles.filterButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
        ) : transactions.length > 0 ? (
          <View style={styles.tableContainer}>
            <TransactionTable data={transactions} />
          </View>
        ) : (
          <Text style={styles.noDataText}>No transactions found</Text>
        )}
        
        <PaginationControls 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </ScrollView>
      {/* <CustomBottomTabBar routeName={'home'} navigation={navigation} /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterContainer: {
    marginBottom: 20,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  pickerContainer: {
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: 150,
  },
  filterButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tableContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

export default HomeScreen;