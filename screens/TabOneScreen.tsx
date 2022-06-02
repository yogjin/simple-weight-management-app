import { Button, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  return (
    <View style={styles.container}>
      <View style={styles.walk}>
        <Text>도보(자동): api이용해서 걸음 수 가져오기 -> 소모칼로리 보여주기</Text>
      </View>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.calorie}>
        <Text>섭취 칼로리: 수동입력</Text>
      </View>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.weight}>
        <Text>예상 체중변화: 섭취칼로리 - 기초대사량 + 도보</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
  walk: {
    flex: 1,
    backgroundColor: 'red',
  },
  calorie: { flex: 1, backgroundColor: 'blue' },
  weight: { flex: 1, backgroundColor: 'green' },
});
