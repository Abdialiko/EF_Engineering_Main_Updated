
const validateCertificateInfo = (values) =>{
    const errors = {}
    if(!values.title){
        errors.title = "title of certificate is required"
    }
    else if(values.title?.lengh > 70){
        errors.title = 'please enter shorter title of certificate'
    }
    if(!values.issuer){
        errors.issuer = "certificate issuer is required"
    }
    else if(values.issuer?.lengh > 70){
        errors.issuer = 'please enter shorter issuer name'
    }
    if(!values.date){
        errors.date = "issued date is required"
    }
    return errors
}
export default validateCertificateInfo