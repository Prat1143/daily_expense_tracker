/* eslint-disable prettier/prettier */
import { AppState } from 'react-native';
import React, { useEffect, useCallback } from 'react';
import AppNavigator from './navigation/AppNavigator';
import { DropdownProvider } from './components/DropdownContext';
import { NativeModules, NativeEventEmitter, PermissionsAndroid } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { debounce } from 'lodash';

const { SmsListenerModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(SmsListenerModule);

let db;

function App() {
  const handleNotification = useCallback(async () => {
    console.log("handleNotification--------------------");

    const setupDatabase = async () => {
      try {
        db = await SQLite.openDatabase({ name: 'SmsDatabase.db', location: 'default' });
        console.log('Database opened successfully');

        await db.executeSql(`
          CREATE TABLE IF NOT EXISTS sms_transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT NULL,
            type TEXT NULL,
            amount REAL NULL,
            timestamp INTEGER NOT NULL,
            company TEXT NULL,
            date TEXT NULL
          )
        `);
        console.log('Table created or already exists');

        // Insert a test record
        // const insertResult = await db.executeSql(
        //   'INSERT INTO sms_transactions (message, type, amount, timestamp, company) VALUES (?, ?, ?, ?, ?)',
        //   ['Test message', 'credit', 100, Date.now(), 'Swiggy']
        // );
        // console.log('Test record inserted:', JSON.stringify(insertResult));

        // const [checkResult] = await db.executeSql('SELECT * FROM sms_transactions');
        // console.log('Records in database after insertion:', JSON.stringify(checkResult.rows.raw()));

        console.log('Database setup complete');
      } catch (insertError) {
        console.error('Error inserting test record:', insertError);
      }
    };

    const requestSmsPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          {
            title: "SMS Permission",
            message: "This app needs access to your SMS to function properly.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("SMS permission granted");
          SmsListenerModule.startListeningToSMS();
          SmsListenerModule.checkStoredSMS();
        } else {
          console.log("SMS permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    };

    // const handleSmsReceived = async (sms) => {
    //   const { messageBody, timestamp } = sms;

    //   // Simple regex patterns to detect credit/debit transactions
    //   const creditPattern = /credited|deposited|received/i;
    //   const debitPattern = /debited|withdrawn|sent/i;
    //   const amountPattern = /(?:RS|INR|₹)\s?(\d+(:?\,\d+)?(:?\.\d{1,2})?)/i;

    //   console.log("handleSmsReceived--------------------", creditPattern.test(messageBody));

    //   let type = '';
    //   if (creditPattern.test(messageBody)) {
    //     type = 'credit';
    //   } else if (debitPattern.test(messageBody)) {
    //     type = 'debit';
    //   }

    //   const company = detectCompany(messageBody);
    //   console.log("type--------------------", type);

    //   if (type) {
    //     const amountMatch = messageBody.match(amountPattern);
    //     console.log("amountMatch--------------------", amountMatch);
    //     console.log("company--------------------", company);
    //     const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '')) : 0;

    //     // Store in database
    //     try {
    //       await db.executeSql(`
    //         INSERT INTO sms_transactions (message, type, amount, timestamp, company)
    //         VALUES (?, ?, ?, ?, ?)
    //       `, [messageBody, type, amount, timestamp, company]);
    //       console.log('Transaction saved');
    //     } catch (error) {
    //       console.error('Error saving transaction', error);
    //     }
    //   }
    // };

    const handleStoredSMS = (storedSMS) => {
      storedSMS.forEach(sms => handleSmsReceived(sms));
    };

    const handleSmsReceived = debounce(async (sms) => {
      const { messageBody, timestamp } = sms;
    
      // Define an array of templates
      const templates = [
        {
          regex: /Rs\.(\d+(?:\.\d{1,2})?)\s+is\s+Debited\s+to\s+A\/c\s+\.\.\.\d+\s+on\s+\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2}:\d{2}\s+\(Clear Bal\s+Rs\.\d+(?:\.\d{1,2})?\)\s+by\s+UPI\s+Ref:\d+\s+-\s+(\w+)/i,
          type: 'debit'
        },
        {
          regex: /Rs\.(\d+(?:\.\d{1,2})?)\s+is\s+Credited\s+to\s+A\/c\s+\.\.\.\d+\s+on\s+(\d{2}-\d{2}-\d{4})\s+\d{2}:\d{2}:\d{2}\s+\(Clear Bal\s+Rs\.\d+(?:\.\d{1,2})?\)\s+by\s+UPI\s+Ref:\d+\s+-\s+(\w+)/i,
          type: 'credit'
        },
      ];
    
      let amount = 0;
      let type = '';
      let company = null;
      let date = null;
    
      // Check each template
      for (const template of templates) {
        const match = messageBody.match(template.regex);
        if (match) {
          amount = parseFloat(match[1]);
          date = match[2];
          type = template.type;
          if(template.type == "debit") {
            company = match[2];
          } else {
            company = match[3];
          }
          break;
        }
      }
    
      // If no valid template matched, return early
      if (!type) {
        console.log("No valid template matched for message:", messageBody);
        return;
      }
    
      console.log("Extracted data - Amount:", amount, "Type:", type, "Company:", company, "Date:", date);
    
      // Store in database
      try {
        const storeData = await db.executeSql(`
          INSERT INTO sms_transactions (message, type, amount, timestamp, company)
          VALUES (?, ?, ?, ?, ?)
        `, [messageBody, type, amount, timestamp, company]);
        console.log("storeData---------------",storeData);
        console.log('Transaction saved:', { message: messageBody, type, amount, timestamp, company, date });
      } catch (error) {
        console.error('Error saving transaction', error);
      }
    }, 300, { leading: true, trailing: false });

    // const handleSmsReceived = debounce(async (sms) => {
    //   const { messageBody, timestamp } = sms;
    
    //   // Improved regex patterns
    //   const creditPattern = /refund|credited|deposited|received/i;
    //   const debitPattern = /debited|withdrawn|sent|paid/i;
    //   // const amountPattern = /Rs\.?\s?(\d+(?:,\d+)?(?:\.\d{1,2})?)/i;
    //   const amountPattern = /Rs\.?\s?(\d+(?:,\d+)?(?:\.\d{1,2})?)/g;
    //   const companyPattern = /(JioMart|Amazon|Flipkart|Swiggy|Zomato)/i;
    //   const spamIndicators = [
    //     /congratulations/i, /winner/i, /free/i, /urgent/i, /limited offer/i,
    //     /click here/i, /http\b/i, /www\./i
    //   ];

    //   let isSpam = spamIndicators.some((pattern) => pattern.test(messageBody));

    //   if (isSpam) {
    //     console.log("Spam detected:", messageBody);
    //     return; // Early return if spam
    //   }
    
    //   console.log("handleSmsReceived--------------------", messageBody);
    
    //   let type = '';
    //   if (creditPattern.test(messageBody)) {
    //     type = 'credit';
    //   } else if (debitPattern.test(messageBody)) {
    //     type = 'debit';
    //   }
    
    //   const companyMatch = messageBody.match(companyPattern);
    //   const company = companyMatch ? companyMatch[1] : null;
    
    //   console.log("type--------------------", type);
    
    //   if (type) {
    //     const amountMatches = messageBody.match(new RegExp(amountPattern, 'g'));
    //     console.log("amountMatches--------------------", amountMatches);
        
    //     let amount = 0;
    //     if (amountMatches) {
    //       // Sum up all amounts found in the message
    //       amount = amountMatches.reduce((sum, match) => {
    //         const numericPart = match.match(/\d+(?:,\d+)?(?:\.\d{1,2})?/);
    //         const cleanedMatch = numericPart ? numericPart[0].replace(/,/g, '') : '0';
    //         const value = parseFloat(cleanedMatch);
    //         console.log("Parsed amount:", match, "->", cleanedMatch, "->", value);
    //         return sum + value;
    //       }, 0);
    //     }
    
    //     console.log("Final amount--------------------", amount);
    //     console.log("company--------------------", company);
    
    //     // Store in database
    //     try {
    //       await db.executeSql(`
    //         INSERT INTO sms_transactions (message, type, amount, timestamp, company)
    //         VALUES (?, ?, ?, ?, ?)
    //       `, [messageBody, type, amount, timestamp, company]);
    //       console.log('Transaction saved:', { message: messageBody, type, amount, timestamp, company });
    //     } catch (error) {
    //       console.error('Error saving transaction', error);
    //     }
    //   }
    // }, 300, { leading: true, trailing: false });

    const checkDatabaseData = () => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT COUNT(*) as count FROM sms_transactions',
          [],
          (tx, results) => {
            console.log('Raw results:', results);
            const count = results.rows.item(0).count;
            console.log(`Number of records in sms_transactions: ${count}`);

            if (count > 0) {
              // tx.executeSql(
              //   'Delete from sms_transactions'
              // )
              tx.executeSql(
                'SELECT * FROM sms_transactions',
                [],
                (tx, sampleResults) => {
                  console.log('Sample data:');
                  for (let i = 0; i < sampleResults.rows.length; i++) {
                    console.log(sampleResults.rows.item(i));
                  }
                },
                (error) => {
                  console.error('Error fetching sample data:', error);
                }
              );
            } else {
              console.log('No data in sms_transactions table');
            }
          },
          (error) => {
            console.error('Error checking database data:', error);
          }
        );
      });
    };

    await setupDatabase();
    checkDatabaseData();
    await requestSmsPermission();

    let eventListener;
    try {
      eventListener = eventEmitter.addListener('onSMSReceived', handleSmsReceived);
    } catch (error) {
      console.error('Error setting up SMS listener:', error);
    }

    return async () => {
      if (eventListener) {
        await eventListener.remove();
      }
      await SmsListenerModule.stopListeningToSMS();
      if (db) {
        await db.close();
      }
    };
  }, []);

  // useEffect(() => {
  //   console.log("useEffect--------------------");
  //   const cleanup = handleNotification();
  //   return () => {
  //     cleanup.then(cleanupFn => cleanupFn());
  //   };
  // }, [handleNotification]);

  useEffect(() => {
    console.log("useEffect--------------------");
    let cleanup;
    let appStateSubscription;
  
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        SmsListenerModule.checkStoredSMS();
      }
    };
  
    const initialize = async () => {
      cleanup = await handleNotification();
      SmsListenerModule.startListeningToSMS();
      SmsListenerModule.checkStoredSMS();
      appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    };
  
    initialize();
  
    return () => {
      if (cleanup) {
        cleanup.then(cleanupFn => cleanupFn());
      }
      SmsListenerModule.stopListeningToSMS();
      if (appStateSubscription) {
        appStateSubscription.remove();
      }
    };
  }, [handleNotification]);

  const detectCompany = (messageBody) => {
    const companyPatterns = {
      'Swiggy': /swiggy/i,
      'Zomato': /zomato/i,
      // Add more companies as needed
      'Amazon': /amazon/i,
      'Flipkart': /flipkart/i,
    };

    for (const [company, pattern] of Object.entries(companyPatterns)) {
      if (pattern.test(messageBody)) {
        return company;
      }
    }

    return null; // If no company is detected
  };

  return (
    <DropdownProvider>
      <AppNavigator />
    </DropdownProvider>
  );
}

export default App;