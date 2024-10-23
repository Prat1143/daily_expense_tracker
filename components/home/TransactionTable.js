import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

const TransactionTable = ({ data }) => {
    const tableHead = ['Type', 'Amount', 'Company', 'Date'];
    const widthArr = [80, 80, 100, 100];

    const tableData = data.map(item => [
        item.type,
        `₹${parseFloat(item.amount).toFixed(2)}`,
        item.company || 'N/A',
        new Date(parseInt(item.timestamp)).toLocaleDateString()
    ]);

    return (
        <View style={styles.container}>
            <ScrollView horizontal={true}>
                <View>
                    <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                        <Row 
                            data={tableHead} 
                            widthArr={widthArr} 
                            style={styles.tableHeader} 
                            textStyle={styles.tableHeaderText} 
                        />
                    </Table>
                    <ScrollView style={styles.dataWrapper}>
                        <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                            {tableData.map((rowData, index) => (
                                <Row
                                    key={index}
                                    data={rowData}
                                    widthArr={widthArr}
                                    style={[styles.tableRow, index % 2 && { backgroundColor: '#F7F6E7' }]}
                                    textStyle={styles.tableRowText}
                                />
                            ))}
                        </Table>
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    tableHeader: { height: 50, backgroundColor: '#537791' },
    tableHeaderText: { 
        textAlign: 'center', 
        fontWeight: 'bold', 
        color: '#fff'  // Header text color
    },
    tableRow: { height: 40, backgroundColor: '#E7E6E1' },
    tableRowText: { 
        textAlign: 'center', 
        fontWeight: '400',
        color: '#333'  // Row text color
    },
    dataWrapper: { marginTop: -1 },
});

export default TransactionTable;