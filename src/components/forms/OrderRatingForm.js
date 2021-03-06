import React, { useState, useRef } from 'react'
import propTypes from 'prop-types'
import { Textarea } from '../index'

const OrderRatingForm = ({
  orderId,
  orderRating,
  icon,
  updateRating,
  callback,
}) => {
  const submitButton = useRef()
  const [rating, setRating] = useState(orderRating.rating || 0)
  const [comments, setComments] = useState(orderRating.comments || '')
  const stars = [1, 2, 3, 4, 5]

  const handleRating = (evt, star) => {
    evt.preventDefault()
    setRating(star)
    evt.target.blur()
  }

  const handleComments = (evt) => {
    setComments(evt.target.value)
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    submitButton.current.blur()
    const data = { rating, comments }
    updateRating(orderId, data)
    if (callback) callback()
  }

  return (
    <form id="rating-form" className="form" onSubmit={handleSubmit} noValidate>
      <div className="form__inputs">
        <div className="order__stars">
          {stars.map((star, index) => {
            const classes = star <= rating ? 'ot-color-link' : ''
            return (
              <button
                key={star}
                type="button"
                className={classes}
                onClick={(evt) => handleRating(evt, star)}
                aria-label={`Give ${index + 1} star rating`}
              >
                <span>{icon}</span>
              </button>
            )
          })}
        </div>
        <Textarea
          label="Comments"
          name="commments"
          value={comments}
          onChange={handleComments}
          classes="form__input"
          showLabel={false}
          placeholder="add comments (optional)"
        />
      </div>
      <div className="form__submit">
        <button className="ot-btn" type="submit" ref={submitButton}>
          Submit
        </button>
      </div>
    </form>
  )
}

OrderRatingForm.displayName = 'OrderRatingForm'
OrderRatingForm.propTypes = {
  orderId: propTypes.number,
  orderRating: propTypes.object,
  icon: propTypes.element,
  updateRating: propTypes.func,
  callback: propTypes.func,
}

export default OrderRatingForm
