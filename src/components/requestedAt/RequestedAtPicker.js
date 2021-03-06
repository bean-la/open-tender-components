import React, { useState } from 'react'
import propTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import {
  isEmpty,
  dateToIso,
  isoToDate,
  makeLocalDate,
  makeWeekdaysExcluded,
  makeDatepickerArgs,
  timezoneMap,
  todayDate,
  errMessages,
} from '@open-tender/js'

const RequestedAtPicker = ({
  revenueCenter,
  serviceType,
  requestedAt,
  setRequestedAt,
}) => {
  const { timezone, settings, revenue_center_type } = revenueCenter
  const tz = timezoneMap[timezone]
  const st = serviceType === 'WALKIN' ? 'PICKUP' : serviceType
  const requestedAtDate =
    requestedAt === 'asap' ? null : isoToDate(requestedAt, tz)
  const [date, setDate] = useState(requestedAtDate)
  const [error, setError] = useState(null)

  const submitDate = (evt) => {
    evt.preventDefault()
    const reqestedAtIso = date ? dateToIso(date, tz) : 'asap'
    setRequestedAt(reqestedAtIso)
    evt.target.blur()
  }

  let args = {}
  if (isEmpty(settings.first_times)) {
    setError(errMessages.revenueCenterClosed)
  } else if (!settings.first_times[st]) {
    setError(errMessages.serviceTypeNotAvailable)
  } else {
    const validTimes = settings.valid_times[st]
    const daysAhead = settings.days_ahead[st]
    const firstTimes = settings.first_times[st]
    const interval = settings.first_times[st].interval
    const holidays = settings.holidays[st].map((i) => makeLocalDate(i))
    const weekdayTimes = makeWeekdaysExcluded(validTimes)
    const excludedTimes = settings.excluded_times
      ? settings.excluded_times[st]
      : {}
    args = makeDatepickerArgs(
      date,
      weekdayTimes,
      excludedTimes,
      firstTimes,
      interval,
      daysAhead
    )
    const first = isoToDate(firstTimes.utc, tz)
    if (args.updatedDate) {
      setDate(args.updatedDate)
    } else if (!error && (date === null || date < first)) {
      setDate(first)
    }
    args.holidays = holidays
    args.interval = interval
    args.hasAsap =
      revenue_center_type === 'OLO' && firstTimes.date === todayDate()
  }
  const {
    excludeTimes,
    isClosed,
    minDate,
    maxDate,
    holidays,
    interval,
    hasAsap,
  } = args

  return (
    <>
      <div className="datepicker-inline ot-font-size-small ot-border ot-border-radius-small ot-bg-color-primary">
        {error ? (
          <p className="ot-color-error">{error}</p>
        ) : (
          <DatePicker
            showPopperArrow={false}
            showTimeSelect
            timeCaption="Time"
            timeFormat="h:mm aa"
            dateFormat="yyyy-MM-dd h:mm aa"
            minDate={minDate}
            maxDate={maxDate}
            timeIntervals={interval}
            excludeDates={holidays}
            excludeTimes={excludeTimes}
            filterDate={isClosed}
            selected={date}
            onChange={(date) => setDate(date)}
            inline
            shouldCloseOnSelect={false}
          />
        )}
      </div>
      <div className="form__submit">
        {!error && (
          <>
            {hasAsap && (
              <button className="ot-btn" onClick={() => setRequestedAt('asap')}>
                {requestedAt === 'asap' ? 'Keep ASAP' : 'Change to ASAP'}
              </button>
            )}
            <button className="ot-btn" onClick={submitDate}>
              {hasAsap ? 'Update Order Time' : 'Choose Order Time'}
            </button>
          </>
        )}
      </div>
    </>
  )
}

RequestedAtPicker.displayName = 'RequestedAtPicker'
RequestedAtPicker.propTypes = {
  revenueCenter: propTypes.object,
  serviceType: propTypes.string,
  requestedAt: propTypes.string,
  setRequestedAt: propTypes.func,
}

export default RequestedAtPicker
