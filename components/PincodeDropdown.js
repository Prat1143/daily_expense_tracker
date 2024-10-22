import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { deviceWidth, deviceHeight } from '../styles/size';

const PincodeDropdown = ({ pincodes, onSelect, onChooseDifferentCity, isPincodeDropdownVisible, closePincodeModal }) => (
    <Modal
      animationType="fade" // Changed to 'fade' for smoother appearance
      transparent={true}
      visible={isPincodeDropdownVisible}
      onRequestClose={() => closePincodeModal()}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPressOut={() => closePincodeModal()} // Close modal when clicking outside
        onPress={() => closePincodeModal()} 
      >
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <ScrollView style={styles.scrollView}>
            <TouchableOpacity 
              onPress={onChooseDifferentCity} 
              style={styles.changeCityButton}
            >
              <Text style={styles.changeCityText}>Change City</Text>
            </TouchableOpacity>
            {pincodes.map((pincode, index) => (
                <TouchableOpacity 
                    key={index} 
                    onPress={() => onSelect(pincode)} 
                    style={styles.pincodeItem}
                >
                    <Text style={styles.pincodeText}>{pincode?.pincode} - {pincode?.areaName}</Text>
                </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    width: deviceWidth * 0.8, // 80% of device width
    maxHeight: deviceHeight * 0.5, // Max height is 50% of device height
    borderRadius: 20,
    padding: 20,
  },
  scrollView: {
    flexGrow: 0, // Prevent ScrollView from filling the entire modal if not necessary
  },
  changeCityButton: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  changeCityText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pincodeItem: {
    paddingVertical: 15, // Padding top and bottom for each pincode item
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // Slight border between items
  },
  pincodeText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default PincodeDropdown;