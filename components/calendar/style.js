import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { isIphoneX } from 'react-native-iphone-x-helper';

export default StyleSheet.create({
  calendarView: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  calendarTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  calendar: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  dateView: {
    justifyContent: 'center',
  },
  dayView: {
    width: '14%',
    alignItems: 'center',
    borderWidth: 0.3,
  },
  week4: {
    height: hp('13.75%'),
  },
  week5: {
    height: hp('11%'),
  },
  week6: {
    height: hp('9.166%'),
  },
  dayText: {
    fontSize: 10,
    color: '#222222',
  },
  dayText2: {
    fontSize: 10,
    color: '#b1b1b1',
  },
  dayText3: {
    fontSize: 10,
    color: 'red',
  },
  today: {
    color: 'purple',
    fontWeight: 'bold',
  },
  dayLine: {
    width: '100%',
    alignContent: 'flex-start',
    marginBottom: 4,
  },
  dayLineText: {
    fontSize: 10,
  },
});
