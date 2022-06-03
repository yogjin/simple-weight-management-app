import { Button, StyleSheet } from 'react-native';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
  HealthInputOptions,
} from 'react-native-health';
import { useEffect } from 'react';
import { useState } from 'react';

/* Permission options */
const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.Steps],
    write: [],
  },
} as HealthKitPermissions;

AppleHealthKit.initHealthKit(permissions, (error: string) => {
  /* Called after we receive a response from the system */

  if (error) {
    console.log('[ERROR] Cannot grant permissions!');
  }

  /* Can now read or write to HealthKit */
});

function getCalorieFromWalkDistance(walkDistance: number): number {
  // 10000보 == 300kcal로 계산
  const calorie: number = 0.03 * walkDistance;
  return calorie;
}
export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  const [walkDistance, setWalkDistance] = useState<number>(0);
  const [walkCalorie, setWalkCalorie] = useState<number>(0);
  useEffect(() => {
    let optionsStepCount = {
      // startDate: new Date(2022, 4, 1).toISOString(),
      // endDate: new Date(2022, 6, 4).toISOString(),
      // date: new Date(2022, 5, 2).toISOString(),
      includeManuallyAdded: true,
    };

    AppleHealthKit.getStepCount(
      optionsStepCount,
      (err: Object, results: HealthValue) => {
        if (err) {
          return;
        }
        console.log(results);
        const stepCount = results.value;
        setWalkDistance(stepCount);
        setWalkCalorie(getCalorieFromWalkDistance(stepCount));
      }
    );
  }, [walkDistance]);

  return (
    <View style={styles.container}>
      <View style={styles.walk}>
        <Text style={styles.walkDistance}>
          {walkDistance} 걸음, {walkCalorie}kcal 소모
        </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  walkDistance: {
    fontSize: 20,
  },
  calorie: { flex: 1, backgroundColor: 'blue' },
  weight: { flex: 1, backgroundColor: 'green' },
});
