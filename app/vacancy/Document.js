import { useEffect } from "react";
import Form from "react-bootstrap/Form";
const Documents = ({data,setData,errors,setErrors}) => {
  useEffect(()=>{
    
  },[])
  const changeHandler = (e) =>{
    const {name,files} = e.target
      setData({...data,[name]:files[0]})
      setErrors({...errors,notify:""})
  }
  return (
    <>
    <Form>
    <div className="text-center pb-5">Upload your CV and Certificate here in PDF format and click Submit button to finish your application</div>
    <div className="d-md-flex">
    <Form.Group className="mb-3 me-md-4 flex-fill " controlId="cv">
    <Form.Label>Upload your CV in pdf format</Form.Label>
    <Form.Control
     type="file"
     accept="application/pdf"
     name="cv"
     onChange={changeHandler}
      />
  </Form.Group>
  <Form.Group className="mb-3 me-3 flex-fill" controlId="document">
    <Form.Label>Upload Certificate and Supporting Documents in pdf format</Form.Label>
    <Form.Control
     type="file"
     accept="application/pdf"
     name="supporting_doc"
     onChange={changeHandler}
      />
  </Form.Group>
    </div>
   
      
      
        </Form>
        {errors.notify &&(
          <div className="red-text py-4 text-center">{errors.notify}</div>
        )}
        </>
  );
};
export default Documents;
