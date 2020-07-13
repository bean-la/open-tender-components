import React, { useContext } from 'react'
import Button from './Button'
import { FormContext } from './CheckoutForm'

const CheckoutSignUp = () => {
  const formContext = useContext(FormContext)
  const { config, login, signUp, iconMap } = formContext
  const icon = iconMap ? iconMap.signUp : null
  return (
    <div className="form__fieldset">
      <div className="form__legend">
        <p className="form__legend__title ot-heading ot-font-size-h3">
          {config.sign_up.title}
        </p>
        <p className="form__legend__subtitle ot-line-height ot-color-secondary">
          {config.sign_up.subtitle}
        </p>
      </div>
      <div className="form__signup">
        <Button
          classes="ot-btn"
          text="Create An Account"
          icon={icon}
          onClick={signUp}
        />
        <Button
          classes="ot-btn-link"
          text="or log into an existing account"
          onClick={login}
        />
      </div>
    </div>
  )
}

CheckoutSignUp.displayName = 'CheckoutSignUp'

export default CheckoutSignUp
