import { StyleSheet } from 'react-native';
import { Calendar } from '../components/calendar';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { getItemFromAsync, setItemToAsync } from '../modules/asyncStroage';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
  HealthInputOptions,
} from 'react-native-health';
import { useEffect, useState } from 'react';

// 예상 체중 변화 구하기
// 변화량: (섭취칼로리 - (기초대사량 + 도보) / 7000)kg
function getWeightChange(
  calorieIntake: number,
  BMR: number,
  calorieWalk: number
) {
  return (calorieIntake - (BMR + calorieWalk)) / 7000;
}

function getCalorieFromWalkDistance(walkDistance: number) {
  // 10000보 == 300kcal로 계산
  const calorie = 0.03 * walkDistance;
  return calorie;
}

function getWalkFromDate(date: string) {
  let stepCount = 0;

  let optionsStepCount = {
    date,
    includeManuallyAdded: true,
  };

  AppleHealthKit.getStepCount(optionsStepCount, (err, results) => {
    if (err) {
      return;
    }
    stepCount = results.value;
  });
  return stepCount;
}

async function getSchedule() {
  const list = [];
  const today = new Date();
  const todayDate = today.getDate();
  for (let i = todayDate; i > 0; i--) {
    const date = today.toDateString();
    const calorieIntake = parseInt(await getItemFromAsync(date));
    const calorieWalk = getCalorieFromWalkDistance(getWalkFromDate(date));
    const weightChange = getWeightChange(calorieIntake, 1700, calorieWalk);

    const object = {
      date: i,
      list: [
        {
          weightChange,
        },
      ],
    };
    list.push(object);
    today.setDate(i - 1);
  }
  return list;
}

export default function TabTwoScreen() {
  const [schedule, setSchedule] = useState<any[]>();
  useEffect(() => {
    getSchedule().then((list) => setSchedule(list));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.calendar}>
        <Calendar schedule={schedule} />
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
