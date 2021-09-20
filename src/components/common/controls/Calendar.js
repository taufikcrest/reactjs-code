import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import moment from "moment";

export class Calendar extends PureComponent {
  static defaultProps = {
    baseClassName: "Calendar",
    mode: "weekly", // [ yearly, monthly | weekly | daily ]
    date: moment()
  };

  constructor(props) {
    super(props);
    const date = this._getDate(this.props);

    this.state = {
      selectedDt: date,
      date: date.date(),
      month: date.month(),
      year: date.year()
    };

    [
      "_getNoOfWeeks",
      "_setDate",
      "_handleChange",
      "_handleMonthPrev",
      "_handleMonthNext",
      "_handleYearPrev",
      "_handleYearNext",
      "_renderDates",
    ].map(fn => (this[fn] = this[fn].bind(this)));
  }

  _getDate(props) {
    let { date } = props;

    if (typeof date === "string") {
      date = moment(date);
    }
    if (moment(date).isValid()) {
      return date;
    }

    return moment();
  }

  componentWillReceiveProps(nextProps) {
    const { date } = nextProps;
    const { selectedDt } = this.state;

    if (!moment(date).isSame(selectedDt, "date")) {
      this._setDate(date.year(), date.month(), date.date());
    }

    if (nextProps.mode !== this.props.mode) {
      this._handleChange(nextProps.mode);
    }

  }

  _getNoOfWeeks() {
    const { month, year } = this.state;

    let dt = moment({ month, year }),
      startOfMonth = moment(dt).startOf("month"),
      firstWeek = moment(startOfMonth).startOf("week"),
      endOfMonth = moment(dt).endOf("month"),
      tmp = moment(firstWeek),
      weeks = 0;

    while (tmp.isSameOrBefore(endOfMonth)) {
      weeks++;
      tmp = moment(tmp).add(1, "weeks");
    }

    return weeks;
  }

  _setDate(year, month, date) {
    let _selectedDt = this.state.selectedDt;
    let selectedDt = moment({ year, month, date });

    if (!_selectedDt.isSame(selectedDt, "date")) {
      this.setState({ year, month, date, selectedDt }, this._handleChange);
    }
  }

  _handleChange(mode) {
    const { onChange } = this.props;
    const { selectedDt, year, month } = this.state;
    mode = mode || this.props.mode;

    let from = moment(selectedDt).startOf("day"),
      to = moment(selectedDt).startOf("day");

    switch (mode) {
      case "weekly":
        from = moment(selectedDt).startOf("week");
        to = moment(selectedDt).endOf("week");
        break;
      case "monthly":
        from = moment(selectedDt).startOf("month");
        to = moment(selectedDt).endOf("month");
        break;
      case "yearly":
        from = moment({ year, month }).startOf("year");
        to = moment({ year, month }).endOf("year");
        break;
      default:
    }

    typeof onChange === "function" && onChange({ range: { from, to }, date: selectedDt });
  }

  _handleMonthPrev() {
    let { month, year } = this.state;

    if (month > 0) {
      month -= 1;
    } else {
      month = 11;
      year -= 1;
    }

    this.setState({ year, month });
  }

  _handleMonthNext() {
    let { month, year } = this.state;

    if (month < 11) {
      month += 1;
    } else {
      month = 0;
      year += 1;
    }

    this.setState({ year, month });
  }

  _handleYearPrev() {
    let { month, year } = this.state;

    year -= 1;

    this.setState({ year, month });
  }

  _handleYearNext() {
    let { month, year } = this.state;

    year += 1;

    this.setState({ year, month });
  }

  _renderDates() {
    const { baseClassName, mode } = this.props;
    const { selectedDt, month, year } = this.state;
    let date = moment({ month, year }),
      dt = moment(date).startOf("week"),
      weeks = this._getNoOfWeeks();

    return Array.apply(null, { length: weeks }).map((t, k) => {
      let tmp = moment(dt);
      dt.add(1, "weeks");

      return (
        <div key={k} className={classNames({ [`${baseClassName}__week`]: true, [`${baseClassName}__week--first`]: k === 0, [`${baseClassName}__week--last`]: k === (weeks - 1) }, "row no-gutters", { [`${baseClassName}--active`]: (mode === "weekly" && moment(selectedDt).isBetween(moment(tmp).day(0), moment(tmp).day(6), "date", "[]")) })} >
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            return (
              <div
                key={i}
                className={classNames("col sub-title sub-title--lg sub-title--bold text-dark", {
                  [`${baseClassName}__date`]: true,
                  [`${baseClassName}--disable`]: month !== tmp.day(i).month(),
                  [`${baseClassName}--active`]: (
                    (mode === "daily" && moment(selectedDt).isSame(moment(tmp), "date")) ||
                    (mode === "monthly" && moment(selectedDt).isSame(moment(tmp), "month"))
                  )
                })}
                onClick={() => this._setDate(tmp.day(i).year(), tmp.day(i).month(), tmp.day(i).date())}
              >
                {moment(tmp).day(i).date()}
              </div>
            )
          })}
        </div>
      );
    });
  }

  render() {
    const { baseClassName, className, mode } = this.props;
    const { month, year } = this.state;

    return (
      <div className={classNames({ [baseClassName]: true, [`${baseClassName}--${mode}`]: true }, "row no-gutters", className)}>

        <div className={classNames({ [`${baseClassName}__picker`]: true }, "col-6 calendar--picker title title--lg text-center m-0")}>
          <span className={classNames({ [`${baseClassName}__prev`]: true }, "icon fal fa-long-arrow-alt-left")} onClick={this._handleMonthPrev} />
          {moment.months()[month]}
          <span className={classNames({ [`${baseClassName}__next`]: true }, "icon fal fa-long-arrow-alt-right")} onClick={this._handleMonthNext} />
        </div>

        <div className={classNames({ [`${baseClassName}__picker`]: true }, "col-6 calendar--picker title title--lg text-center m-0")}>
          <span className={classNames({ [`${baseClassName}__prev`]: true }, "icon fal fa-long-arrow-alt-left")} onClick={this._handleYearPrev} />
          {year}
          <span className={classNames({ [`${baseClassName}__next`]: true }, "icon fal fa-long-arrow-alt-right")} onClick={this._handleYearNext} />
        </div>

        <div className="col-12 mt-4">
          <div className={classNames({ [`${baseClassName}__weeks`]: true }, "row no-gutters")}>
            {(moment.weekdaysShort() || []).map((name, i) => (
              <div className={classNames({ [`${baseClassName}__day`]: true }, "col sub-title sub-title--lg default")} key={i}>
                {name}
              </div>
            ))}
          </div>

          <div className={classNames({ [`${baseClassName}__dates`]: true })}>
            {this._renderDates()}
          </div>
        </div>
      </div>
    );
  }
}

Calendar.propTypes = {
  baseClassName: PropTypes.string,
  mode: PropTypes.string,
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(moment)
  ]).isRequired,
};

export default Calendar;