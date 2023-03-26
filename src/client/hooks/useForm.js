import { useState } from "react";

export default function useForm(initialValues){

  const [formData, setFormData] = useState(initialValues || {})

  const handleFormSubmit = (e) => {
    e.preventDefault()
  }

  const handleChange = (e) => {
    const {name, value } = e.target
    setFormData(prev => {
      return {...prev, [name] : value}
    })
  }

  return {formData, handleFormSubmit, handleChange}
}