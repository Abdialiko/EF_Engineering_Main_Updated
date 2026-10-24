const validatePersonalInfo = (values) =>{
    const errors = {}
    var phoneno = /^\d{10}$/;
    // eslint-disable-next-line no-useless-escape
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!values.f_name){
        errors.f_name = 'first name is required'
    }
    else if(values.f_name?.trim().lengh >20){
        errors.f_name = 'please use lessthan or equal to 20 letters for first name'
    }
    if(!values.m_name){
        errors.m_name = 'middel name is required'
    }
    else if(values.m_name?.trim().lengh >20){
        errors.m_name = 'please use lessthan or equal to 20 letters for middel name'
    }
    if(!values.l_name){
        errors.l_name = 'last name is required'
    }
    else if(values.l_name?.trim().lengh >20){
        errors.l_name = 'please use lessthan or equal to 20 letters for last name'
    }
    if(!values.birth_date){
        errors.birth_date = 'date of birth is required'
    }
    if(!values.email){
        errors.email = 'email address is required'
    }
    
    else if(!values.email.match(mailformat)){
          errors.email = "invalid email address"
    }
    if(!values.phone_no){
        errors.phone_no = 'phone number is required'
    }
    else if(!values.phone_no.match(phoneno)){
        errors.phone_no = "invalid phone number"
    }
    return errors

}

export default validatePersonalInfo