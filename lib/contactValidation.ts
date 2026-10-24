const validate = (inputs: {
  name: string
  email: string
  phone_no: string
  address?: string
  service_id?: string
  message: string
}) => {
  const phoneno = /^\d{10}$/
  const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  
  let errors: { [key: string]: string } = {}
  
  if (!inputs.name) {
    errors.name = 'Name is required'
  } else if (inputs.name.trim().length > 30) {
    errors.name = 'Name is too long, please use shorter name'
  }
  
  if (!inputs.email) {
    errors.email = 'Email is required'
  } else if (!inputs.email.match(validRegex)) {
    errors.email = 'Invalid email address'
  }
  
  if (!inputs.phone_no) {
    errors.phone_no = 'Phone number is required'
  } else if (!inputs.phone_no.match(phoneno)) {
    errors.phone_no = 'Invalid phone number'
  }
  
  if (!inputs.message) {
    errors.message = 'Please write your message here'
  }
  
  return errors
}

export default validate
