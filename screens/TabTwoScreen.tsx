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
import { getWalkFromDate } from './TabOneScreen';

// 기초대사량 구하기
function getBMR(gender: string, age: number, cm: number, kg: number): number {
  return gender === 'male'
    ? 66.47 + 13.75 * kg + 5 * cm - 6.76 * age
    : 655.1 + 9.56 * kg + 1.85 * cm - 4.68 * age;
}

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

const getSchedule = async () => {
  const list = [];
  const today = new Date();
  const todayDate = today.getDate();
  const BMR: number = getBMR('male', 25, 173, 69);
  for (let i = todayDate; i > 0; i--) {
    const date = today.toDateString();
    const walk = await getWalkFromDate(today.toISOString());
    const calorieIntake = parseInt(await getItemFromAsync(date));
    const calorieWalk = getCalorieFromWalkDistance(walk);
    const weightChange = getWeightChange(calorieIntake, BMR, calorieWalk);

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
};

// 예상 체중변화 (달력 내 모든 날의 합)
function getSumOfWeightChange(schedule: any[]): number {
  if (schedule == null) {
    throw new Error('예상 체중변화 에러');
  }
  let sum = 0;
  for (let day of schedule) {
    sum += day['list'][0]['weightChange'];
  }
  return sum;
}

export default function TabTwoScreen() {
  const [schedule, setSchedule] = useState<any[]>([]);
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
          <Text style={styles.weightChangeValueText}>
            {getSumOfWeightChange(schedule).toFixed(3)}kg
          </Text>
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
    flex: 4,
    marginTop: 10,
  },
  separator: {
    height: 1,
    width: '80%',
  },
  weightChangeContainer: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
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
