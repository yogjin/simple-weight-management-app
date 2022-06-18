import { Button, StyleSheet, TouchableOpacity } from 'react-native';
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
import { getItemFromAsync, setItemToAsync } from '../modules/asyncStroage';

// setItemToAsync(new Date().toDateString(), 450).then(console.log);
// 오늘날짜 string
// 형식: Tue Sep 20 2022
const todayDate: string = new Date().toDateString();

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
): number {
  return (calorieIntake - (BMR + calorieWalk)) / 7000;
}

const BMR: number = getBMR('male', 25, 173, 69);

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  const [walkDistance, setWalkDistance] = useState<number>(0);
  const [walkCalorie, setWalkCalorie] = useState<number>(0);
  const [calorieIntake, setCalorieIntake] = useState<number>(0);
  const [weightChange, setWeightChange] = useState<number>(0);

  // set State
  // state: walkDistance, walkCalorie
  useEffect(() => {
    let optionsStepCount = {
      date: new Date(2022, 5, 18).toISOString(),
      // endDate: new Date(2022, 6, 4).toISOString(),
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

  // Set state
  // state: calorieIntake(asyncStorage)
  useEffect(() => {
    getItemFromAsync(todayDate)
      .then((calorie) =>
        calorie ? setCalorieIntake(parseInt(calorie)) : setCalorieIntake(0)
      )
      .catch(console.error);
  }, []);

  // Set state
  // state: weightChange
  useEffect(() => {
    setWeightChange(getWeightChange(calorieIntake, BMR, walkCalorie));
  });

  // 섭취 칼로리 변경 & 예상 체중 변화 변경
  const onClickCalorieIntake = (calorieChange: number) => {
    setItemToAsync(todayDate, calorieIntake + calorieChange).then(console.log);
    getItemFromAsync(todayDate)
      .then((value) => {
        if (value) {
          const calorie = parseInt(value);
          setCalorieIntake(calorie);
          setWeightChange(getWeightChange(calorie, BMR, walkCalorie));
        } else {
          setCalorieIntake(0);
        }
      })
      .catch(console.error);
  };

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
        <Text style={styles.calorieIntake}>섭취 칼로리</Text>
        <Text style={styles.calorieIntake}>{calorieIntake}kcal</Text>
        <View style={styles.calorieBtnContainer}>
          <View style={styles.caloriePlusBtnContainer}>
            <TouchableOpacity
              style={[styles.calorieIntakeBtn, styles.calorieIntakeMinusBtn]}
              onPress={() => onClickCalorieIntake(-100)}
            >
              <Text style={styles.calorieIntakeText}>-100</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.calorieIntakeBtn, styles.calorieIntakeMinusBtn]}
              onPress={() => onClickCalorieIntake(-10)}
            >
              <Text style={styles.calorieIntakeText}>-10</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.caloriePlusBtnContainer}>
            <TouchableOpacity
              style={[styles.calorieIntakeBtn, styles.calorieIntakePlusBtn]}
              onPress={() => onClickCalorieIntake(100)}
            >
              <Text style={styles.calorieIntakeText}>+100</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.calorieIntakeBtn, styles.calorieIntakePlusBtn]}
              onPress={() => onClickCalorieIntake(10)}
            >
              <Text style={styles.calorieIntakeText}>+10</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.weight}>
        <Text style={styles.weightChangeText}>예상 체중변화</Text>
        <View style={styles.weightChangeValueContainer}>
          {weightChange.toFixed(2) > 0 ? (
            <Text
              style={[styles.weightChangeValue, styles.weightChangeValuePlus]}
            >
              +{weightChange.toFixed(2)}kg
            </Text>
          ) : (
            <Text
              style={[styles.weightChangeValue, styles.weightChangeValueMinus]}
            >
              {weightChange.toFixed(2)}kg
            </Text>
          )}
        </View>
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
  calorie: { flex: 1, alignItems: 'center' },
  calorieIntake: {
    fontSize: 20,
  },
  calorieBtnContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  caloriePlusBtnContainer: {},
  calorieMinusBtnContainer: {},
  calorieIntakeBtn: {
    padding: 15,
    borderRadius: 5,
    margin: 5,
    alignItems: 'center',
  },
  calorieIntakeMinusBtn: { backgroundColor: 'rgb(229, 80, 57)' },
  calorieIntakePlusBtn: { backgroundColor: 'rgb(120, 224, 143)' },
  calorieIntakeText: {
    fontSize: 20,
  },

  weight: { flex: 1, alignItems: 'center' },
  weightChangeText: { fontSize: 20 },
  weightChangeValueContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  weightChangeValue: {
    fontSize: 35,
  },
  weightChangeValuePlus: { color: '#44bd32' },
  weightChangeValueMinus: { color: '#c23616' },
});
