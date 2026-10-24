
const validateExperienceinfo = (values) =>{
    const errors = {}
    if(!values.title){
        errors.title = "position of employement is required"
    }
    else if(values.title?.lengh > 70){
        errors.title = 'please enter shorter position name'
    }
    if(!values.company){
        errors.company = "Organization name you were employed  is required"
    }
    else if(values.company?.lengh > 70){
        errors.company = 'please enter shorter organization name'
    }
    
    if(!values.start_date){
        errors.start_date = "start date is required"
    }
    if(!values.end_date){
        errors.end_date = 'end date is required'
    }
    return errors
}
export default validateExperienceinfo