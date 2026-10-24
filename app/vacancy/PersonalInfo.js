import Form from "react-bootstrap/Form";
const PersonalInfo = ({data,setData,errors,setErrors}) => {

  const changeHandler = (e) =>{
       const {name,value} = e.target
    setData(previousValue=>{
        return {...previousValue,[name]:value}
       })
       if(value){
        setErrors({...errors,[name]:""})
       }
  }

  return (
    <Form>
      <div className="d-md-flex">
      <Form.Group className="mb-3 me-md-4 flex-fill " controlId="fname">
        <Form.Label>First Name</Form.Label>
        <Form.Control
         type="text"
         name="f_name"
         value={data.f_name ||''}
         onChange={changeHandler}
         className={errors.f_name ?"red-border":""}
          />
          {errors.f_name?<span className="red-text">{errors.f_name}</span>:""}
      </Form.Group>
      <Form.Group className="mb-3 flex-fill" controlId="mname">
        <Form.Label>Father Name</Form.Label>
        <Form.Control
         type="text"
         name="m_name"
         value={data.m_name ||''}
         onChange={changeHandler}
         className={errors.m_name ?"red-border":""}
         />
         {errors.m_name?<span className="red-text">{errors.m_name}</span>:""}
      </Form.Group>
      </div>
      <div className="row">
      <Form.Group className="mb-3 col-md-6" controlId="lname">
        <Form.Label>Grand Father Name</Form.Label>
        <Form.Control
         type="text"
         name="l_name"
         value={data.l_name || ''}
         onChange={changeHandler}
         className={errors.l_name ?"red-border":""}
         />
         {errors.l_name?<span className="red-text">{errors.l_name}</span>:""}
      </Form.Group>
      <Form.Group className="mb-3 col-md-6 " controlId="dob">
        <Form.Label>Birth Date</Form.Label>
        <Form.Control
         type="date" 
         name="birth_date"
         value={data.birth_date ||''}
         onChange={changeHandler}
         className={errors.birth_date ?"red-border":""}
          />
          {errors.birth_date?<span className="red-text">{errors.birth_date}</span>:""}
      </Form.Group>
      </div>
     <div className="d-md-flex">
     <Form.Group className="mb-3 me-md-4 flex-fill" controlId="email">
     <Form.Label>Email Addres</Form.Label>
     <Form.Control
      type="email"
      name="email"
      value={data.email || ''}
      onChange={changeHandler}
      className={errors.email ?"red-border":""}
      />
      {errors.email?<span className="red-text">{errors.email}</span>:""}
   </Form.Group>
   <Form.Group className="mb-3 flex-fill" controlId="phoneno">
     <Form.Label>Phone Number</Form.Label>
     <Form.Control
      type="number"
      name="phone_no"
      value={data.phone_no ||''}
      onChange={changeHandler}
      className={errors.phone_no ?"red-border":""}
      />
      {errors.phone_no?<span className="red-text">{errors.phone_no}</span>:""}
   </Form.Group>
     </div>
     <div className="d-md-flex">
     <Form.Group className="mb-3 me-md-4 flex-fill" controlId="city">
     <Form.Label>City</Form.Label>
     <Form.Control
      type="text"
      name="city"
      value={data.city || ''}
     onChange={changeHandler}
       />
   </Form.Group>
   <Form.Group className="mb-3 flex-fill" controlId="subcity">
     <Form.Label>Subcity</Form.Label>
     <Form.Control
      type="text"
      name="sub_city"
      value={data.sub_city || ''}
      onChange={changeHandler}
       />
   </Form.Group>
     </div>
      <div className="row">
      <Form.Group className="col-md-6 mb-3" controlId="woreda">
        <Form.Label>Woreda</Form.Label>
        <Form.Control
         type="text"
         name="woreda"
        value={data.woreda || ''}
         onChange={changeHandler}
          />
      </Form.Group>
      </div>
      
    </Form>
  );
};
export default PersonalInfo;
