import React from 'react';
import { Animated, Text, View } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import style from './style';

import {
  addDays,
  format,
  getDate,
  startOfWeek,
  getMonth,
  startOfMonth,
  getWeeksInMonth,
  addMonths,
  getYear,
} from 'date-fns';
import GestureRecognizer, {
  swipeDirections,
} from 'react-native-swipe-gestures';
import { TabBarIcon } from '../../navigation';

export class Calendar extends React.Component {
  state = {
    date: null,
    today: null,
    todayMonth: null,
    curMonth: null,
    curYear: null,
    weekLength: null,
    monthDays: [],
    nextCount: 0,
    calendarDay: null,
    fadeAni: null,
    schedule: [
      {
        date: 1,
        list: [
          {
            weightChange: 0.1,
          },
        ],
      },
    ],
    curListLength: 0,
  };

  async componentDidMount() {
    const date = new Date();
    const today = getDate(date);
    const curMonth = getMonth(date);
    const curYear = getYear(date);
    const monthDays = this.getMonthDays(date, curMonth);
    const fadeAni = new Animated.Value(1);
    const schedule = this.props.schedule;

    this.setState({
      date,
      today,
      curMonth,
      todayMonth: curMonth,
      curYear,
      monthDays,
      monthStart: date,
      fadeAni,
      schedule,
    });
  }

  getWeekDays(data, month) {
    const weekStart = startOfWeek(data, { weekStartOn: 1 });
    const weekLength = 7;
    const weekList = [];

    for (let i = 0; i < weekLength; i++) {
      const tempDate = addDays(weekStart, i);
      const formatted = this.getDay(format(tempDate, 'EEE'));

      if (getMonth(tempDate) === month) {
        weekList.push({
          key: getDate(tempDate),
          formatted,
          date: tempDate,
          day: getDate(tempDate),
          month: 'cur',
        });
      } else if (getMonth(tempDate) < month) {
        weekList.push({
          key: getDate(tempDate),
          formatted,
          date: tempDate,
          day: getDate(tempDate),
          month: 'pre',
        });
      } else if (getMonth(tempDate) > month) {
        weekList.push({
          key: getDate(tempDate),
          formatted,
          date: tempDate,
          day: getDate(tempDate),
          month: 'next',
        });
      }
    }
    return weekList;
  }

  getDay(day) {
    var dayWord = day;

    if (dayWord === 'Sun') {
      dayWord = '???';
    } else if (dayWord === 'Mon') {
      dayWord = '???';
    } else if (dayWord === 'Tue') {
      dayWord = '???';
    } else if (dayWord === 'Wed') {
      dayWord = '???';
    } else if (dayWord === 'Thu') {
      dayWord = '???';
    } else if (dayWord === 'Fri') {
      dayWord = '???';
    } else if (dayWord === 'Sat') {
      dayWord = '???';
    }

    return dayWord;
  }

  getMonthDays(data, month) {
    const monthStart = startOfMonth(data);

    const monthList = [];
    const weekLength = getWeeksInMonth(monthStart);
    this.setState({
      weekLength,
      calendarDay: monthStart,
    });
    for (let i = 0; i < weekLength; i++) {
      const count = i * 7;
      const weekStartDate = addDays(monthStart, count);
      monthList.push(this.getWeekDays(weekStartDate, month));
    }
    return monthList;
  }

  getNextMonth() {
    const nextDate = addMonths(this.state.monthStart, this.state.nextCount + 1);
    const month = getMonth(nextDate);
    const year = getYear(nextDate);
    const nextMonth = this.getMonthDays(nextDate, month);

    this.setState({
      nextCount: this.state.nextCount + 1,
      monthDays: nextMonth,
      curMonth: month,
      curYear: year,
    });
  }

  getPreMonth() {
    const preDate = addMonths(this.state.monthStart, this.state.nextCount - 1);
    const month = getMonth(preDate);
    const year = getYear(preDate);

    const preMonth = this.getMonthDays(preDate, month);

    this.setState({
      nextCount: this.state.nextCount - 1,
      monthDays: preMonth,
      curMonth: month,
      curYear: year,
    });
  }

  render() {
    return (
      <GestureRecognizer
        style={[style.calendarView]}
        onSwipeRight={(state) => {
          this.getNextMonth();
        }}
        onSwipeLeft={(state) => {
          this.getPreMonth();
        }}
      >
        <View style={style.calendarHeader}>
          <View style={style.calendarIcon}>
            <TabBarIcon name="chevron-left" />
          </View>
          <View style={style.calendarTitle}>
            <Text style={style.calendarTitleText}>
              {this.state.curYear}??? {this.state.curMonth + 1}???
            </Text>
          </View>
          <View style={style.calendarIcon}>
            <TabBarIcon name="chevron-right" />
          </View>
        </View>
        <View style={style.calendar}>
          <View
            style={{ width: '100%', height: hp('3%'), flexDirection: 'row' }}
          >
            <View style={[style.dayView, style.dateView]}>
              <Text style={style.dayText}>???</Text>
            </View>
            <View style={[style.dayView, style.dateView]}>
              <Text style={style.dayText}>???</Text>
            </View>
            <View style={[style.dayView, style.dateView]}>
              <Text style={style.dayText}>???</Text>
            </View>
            <View style={[style.dayView, style.dateView]}>
              <Text style={style.dayText}>???</Text>
            </View>
            <View style={[style.dayView, style.dateView]}>
              <Text style={style.dayText}>???</Text>
            </View>
            <View style={[style.dayView, style.dateView]}>
              <Text style={style.dayText}>???</Text>
            </View>
            <View style={[style.dayView, style.dateView]}>
              <Text style={style.dayText}>???</Text>
            </View>
          </View>
          {this.state.monthDays
            ? this.state.monthDays.map((el, index) => {
                return el.map((sub, index) => {
                  return (
                    <View
                      style={[
                        style.dayView,
                        this.state.weekLength === 4
                          ? style.week4
                          : this.state.weekLength === 5
                          ? style.week5
                          : this.state.weekLength === 6
                          ? style.week6
                          : null,
                      ]}
                      key={index.toString()}
                    >
                      <Text
                        style={[
                          sub.month !== 'cur'
                            ? style.dayText2
                            : sub.formatted === '???' || sub.formatted === '???'
                            ? style.dayText3
                            : style.dayText,
                          sub.day === this.state.today &&
                          this.state.todayMonth === this.state.curMonth
                            ? style.today
                            : null,
                        ]}
                      >
                        {sub.day}
                      </Text>
                      {this.props.schedule
                        ? this.props.schedule.map((el, index) => {
                            return sub.day === el.date
                              ? el.list.map((elsub, index) => {
                                  const curListLength = el.list.length;
                                  if (index < 4) {
                                    return (
                                      <View
                                        key={index.toString()}
                                        style={[
                                          style.dayLine,
                                          {
                                            backgroundColor:
                                              elsub.backgroundColor,
                                          },
                                        ]}
                                      >
                                        <Text
                                          style={[
                                            style.dayLineText,
                                            elsub.day.getFullYear() ===
                                              sub.date.getFullYear() &&
                                            elsub.day.getMonth() ===
                                              sub.date.getMonth()
                                              ? elsub.weightChange > 0
                                                ? style.dayLineWeightPlus
                                                : style.dayLineWeightMinus
                                              : '',
                                            { color: elsub.color },
                                          ]}
                                          numberOfLines={1}
                                          ellipsizeMode="tail"
                                        >
                                          {elsub.day.getFullYear() ===
                                            sub.date.getFullYear() &&
                                          elsub.day.getMonth() ===
                                            sub.date.getMonth()
                                            ? elsub.weightChange > 0
                                              ? `+${elsub.weightChange.toFixed(
                                                  3
                                                )}`
                                              : `${elsub.weightChange.toFixed(
                                                  3
                                                )}`
                                            : ''}
                                        </Text>
                                      </View>
                                    );
                                  } else if (index === 4) {
                                    return (
                                      <View
                                        key={index.toString()}
                                        style={[style.dayLine]}
                                      >
                                        <Text style={[style.dayLineText]}>
                                          + {curListLength - 4}
                                        </Text>
                                      </View>
                                    );
                                  }
                                })
                              : null;
                          })
                        : null}
                    </View>
                  );
                });
              })
            : null}
        </View>
      </GestureRecognizer>
    );
  }
}
