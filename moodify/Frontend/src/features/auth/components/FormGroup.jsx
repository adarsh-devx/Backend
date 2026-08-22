import React from 'react'


const FormGroup = ({name, label, type = "text", value, onChange, placeholder = " "}) => {
  return (
    <div className="form-group">
        <div className="input-wrapper">
            <input type={type} id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required />
            <label htmlFor={name}>{label}</label>
            <div className="input-glow-border"></div>
        </div>
    </div>
  )
}

export default FormGroup