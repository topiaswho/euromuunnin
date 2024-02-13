
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, KeyboardAvoidingView } from 'react-native';
import { Picker } from '@react-native-picker/picker';


export default function App() {
  
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');

  useEffect(() => {
    fetchCurrencies();
  }, []);

  async function fetchCurrencies() {
    try {
      const response = await fetch('https://api.apilayer.com/exchangerates_data/latest', {
        headers: {
          'apikey': 'btQ8Z9dX1tPCvXlxRwGCC3Mk4CmbEI9w'
        }
      });

      const data = await response.json();
      const currencies = Object.keys(data.rates);
      setCurrencies(currencies);
      setSelectedCurrency(currencies[0]);
    } catch (error) {
      console.error('Error ' + error);
    }
  };

  const convertCurrency = () => {
    const apikey = 'btQ8Z9dX1tPCvXlxRwGCC3Mk4CmbEI9w';
    const apiurl = `https://api.apilayer.com/exchangerates_data/latest?apikey=${apikey}`;
    fetch(apiurl)
      .then(response => response.json())
      .then(data => {
        const rate = data.rates[selectedCurrency];
        const euroAmount = parseFloat(amount) * rate;
        setConvertedAmount(euroAmount.toFixed(2));
      })
      .catch(error => console.error('Error', error));
  };
  
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Picker
        selectedValue={selectedCurrency}
        onValueChange={(itemValue, itemIndex) => setSelectedCurrency(itemValue)}
        style={styles.picker}>
        {currencies.map(currency => (
          <Picker.Item key={currency} label={currency} value={currency} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        value={amount}
        keyboardType='numeric'
        onChangeText={text => setAmount(text)}
      />
      <Button title='Convert' onPress={convertCurrency} />
      {convertedAmount ? (
        <Text style={styles.result}>{convertedAmount} EUR </Text>
      ) : null}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  picker: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  result: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
