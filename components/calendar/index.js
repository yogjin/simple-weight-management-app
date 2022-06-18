import React from 'react';
import { Animated, Text, View } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// import { use } from '../../context';

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
    // schedule: [
    //   {
    //     no: 1,
    //     date: 2,
    //     list: [
    //       {
    //         no: 1,
    //         color: '#000000',
    //         backgroundColor: '#2b78a2',
    //         title: '오늘의 일정',
    //         type: '일정',
    //       },
    //       {
    //         no: 2,
    //         color: '#000000',
    //         backgroundColor: '#6ea8c9',
    //         title: '오늘의 일정',
    //         type: '일정',
    //       },
    //     ],
    //   },
    //   {
    //     no: 2,
    //     date: 4,
    //     list: [
    //       {
    //         no: 1,
    //         color: '#000000',
    //         backgroundColor: '#2b78a2',
    //         title: '오늘의 일정이 있습니다',
    //         type: '일정',
    //       },
    //     ],
    //   },
    //   {
    //     no: 3,
    //     date: 6,
    //     list: [
    //       {
    //         no: 1,
    //         color: '#000000',
    //         backgroundColor: '#2b78a2',
    //         title: '오늘의 일정',
    //         type: '일정',
    //       },
    //     ],
    //   },
    //   {
    //     no: 4,
    //     date: 12,
    //     list: [
    //       {
    //         no: 1,
    //         color: '#000000',
    //         backgroundColor: '#b6d227',
    //         title: '오늘의 일정',
    //         type: '일정',
    //       },
    //     ],
    //   },
    //   {
    //     no: 5,
    //     date: 24,
    //     list: [
    //       {
    //         no: 1,
    //         color: '#000000',
    //         backgroundColor: '#b6d227',
    //         title: '오늘의 일정',
    //         type: '일정',
    //       },
    //       {
    //         no: 2,
    //         color: '#000000',
    //         backgroundColor: '#b6d227',
    //         title: '오늘의 일정',
    //         type: '일정',
    //       },
    //       {
    //         no: 3,
    //         color: '#000000',
    //         backgroundColor: '#2b78a2',
    //         title: '오늘의 일정',
    //         type: '일정',
    //       },
    //       {
    //         no: 4,
    //         color: '#000000',
    //         backgroundColor: '#2b78a2',
    //         title: '오늘의 일정',
    //         type: '일정',
    //       },
    //       {
    //         no: 5,
    //         color: '#000000',
    //         backgroundColor: '#2b78a2',
    //         title: '오늘의 일정',
    //         type: '일정',
    //       },
    //       {
    //         no: 6,
    //         color: '#000000',
    //         backgroundColor: '#2b78a2',
    //         title: '오늘의 일정',
    //         type: '일정',
    //       },
    //       {
    //         no: 7,
    //         color: '#000000',
    //         backgroundColor: '#2b78a2',
    //         title: '오늘의 일정',
    //         type: '일정',
    //       },
    //     ],
    //   },
    // ],
    curListLength: 0,
  };

  componentDidMount() {
    const date = new Date();
    const today = getDate(date);
    const curMonth = getMonth(date);
    const curYear = getYear(date);
    const monthDays = this.getMonthDays(date, curMonth);
    const fadeAni = new Animated.Value(1);

    this.setState({
      date,
      today,
      curMonth,
      todayMonth: curMonth,
      curYear,
      monthDays,
      monthStart: date,
      fadeAni,
    });
    // this.props.$data.setCurDate(this.props.$data.prop, curYear, curMonth);
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
      dayWord = '일';
    } else if (dayWord === 'Mon') {
      dayWord = '월';
    } else if (dayWord === 'Tue') {
      dayWord = '화';
    } else if (dayWord === 'Wed') {
      dayWord = '수';
    } else if (dayWord === 'Thu') {
      dayWord = '목';
    } else if (dayWord === 'Fri') {
      dayWord = '금';
    } else if (dayWord === 'Sat') {
      dayWord = '토';
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

    this.props.$data.setCurDate(this.props.$data.prop, year, month);
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

    this.props.$data.setCurDate(this.props.$data.prop, year, month);
  }

  render() {
    return (
      <GestureRecognizer
        style={[style.calendarView]}
        onSwipeUp={(state) => {
          this.getNextMonth();
        }}
        onSwipeDown={(state) => {
          this.getPreMonth();
        }}
      >
        <View style={style.calendar}>
          <View
            style={{ width: '100%', height: hp('3%'), flexDirection: 'row' }}
          >
            <View style={[style.dayView, style.dateView]}>
              <Text style={style.dayText}>일</Text>
            </View>
            <View style={[style.dayView, style.dateView]}>
              <Text style={style.dayText}>월</Text>
            </View>
            <View style={[style.dayView, style.dateView]}>
              <Text style={style.dayText}>화</Text>
            </View>
            <View style={[style.dayView, style.dateView]}>
              <Text style={style.dayText}>수</Text>
            </View>
            <View style={[style.dayView, style.dateView]}>
              <Text style={style.dayText}>목</Text>
            </View>
            <View style={[style.dayView, style.dateView]}>
              <Text style={style.dayText}>금</Text>
            </View>
            <View style={[style.dayView, style.dateView]}>
              <Text style={style.dayText}>토</Text>
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
                            : sub.formatted === '토' || sub.formatted === '일'
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
                      {this.state.schedule
                        ? this.state.schedule.map((el, index) => {
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
                                            { color: elsub.color },
                                          ]}
                                          numberOfLines={1}
                                          ellipsizeMode="tail"
                                        >
                                          {elsub.title}
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
// export default use(Calendar);
