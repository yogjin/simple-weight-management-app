import { StyleSheet } from 'react-native';
import { Calendar } from '../components/calendar';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.calendar}>
        <Calendar />
      </View>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.weightChangeContainer}>
        <Text style={styles.weightChangeText}>예상 체중변화</Text>
        <View style={styles.weightChangeValueContainer}>
          <Text style={styles.weightChangeValueText}>+2kg</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  calendar: {
    flex: 3,
    marginTop: 10,
  },
  separator: {
    height: 1,
    width: '80%',
  },
  weightChangeContainer: {
    flex: 1,
    marginTop: 10,
  },
  weightChangeText: {
    fontSize: 20,
  },
  weightChangeValueContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weightChangeValueText: {
    fontSize: 35,
    marginBottom: 20,
  },
});
