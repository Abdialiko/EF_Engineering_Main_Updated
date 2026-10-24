
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Toast from 'react-bootstrap/Toast';
import validateCertificateInfo from "./validateCertificateInfo";
const Certificates = ({data,setData}) => {
  const [certificate,setCertificate] = useState({})
  const [errors,setErrors] = useState({})
  const [show,setShow] = useState(false)

  const changeHandler = (e) =>{
    const {name,value} = e.target
    setCertificate(previousData=>{
      return {...previousData,[name]:value}
    })
  }
  const addCertificates = (e)=>{
    e.preventDefault()
    const errorValue = validateCertificateInfo(certificate)
    if(Object.values(errorValue)?.length > 0){
      setErrors(errorValue)
    }
    else {
      setData([...data,certificate])
      setCertificate({})
      setShow(true)
    }
  }
    return (
    <>
      <div className="text-center pb-5">
        Add your Certificate here,Click Add Button to save each Certificate.
        You can add more than one Certificate, finally click Next button to go
        to the next form
      </div>
      <Form className="border rounded p-3">
        <div className="d-md-flex">
          <Form.Group
            className="mb-3 me-md-4 flex-fill "
            controlId="titleofCertificate"
          >
            <Form.Label>Title of Certificate</Form.Label>
            <Form.Control
             type="text"
             name='title'
             value={certificate.title || ''}
             onChange={changeHandler}
             className={errors.title ?"red-border":""}
             />
             {errors.title ?<span className="red-text">{errors.title }</span>:""}
          </Form.Group>
          <Form.Group className="mb-3 me-3 flex-fill" controlId="eshuer">
            <Form.Label>Issued by</Form.Label>
            <Form.Control
             type="text"
             name='issuer'
             value={certificate.issuer || ''}
             onChange={changeHandler}
             className={errors.issuer ?"red-border":""}
             />
             {errors.issuer ?<span className="red-text">{errors.issuer }</span>:""}
          </Form.Group>
        </div>
        <div className="d-md-flex">
          <Form.Group
            className="mb-3 flex-fill me-md-4"
            controlId="eshued-date"
          >
            <Form.Label>Issued Date </Form.Label>
            <Form.Control 
            type="date"
            name='date'
             value={certificate.date || ''}
             onChange={changeHandler}
             className={errors.date ?"red-border":""}
             />
             {errors.date ?<span className="red-text">{errors.date }</span>:""}
          </Form.Group>
          <Form.Group className="mb-3 me-3 flex-fill " controlId="summary">
            <Form.Label>Summary</Form.Label>
            <Form.Control
             type="text"
             name='summary'
             value={certificate.summary || ''}
             onChange={changeHandler}
              />
          </Form.Group>
        </div>
        <div className="d-flex justify-content-between">
        <Toast
        onClose={() => setShow(false)}
         show={show}
          delay={5000}
           autohide
           bg="success"
           >
           <Toast.Header>
           <img
             src="holder.js/20x20?text=%20"
             className="rounded me-2"
             alt=""
           />
           <strong className="me-auto fs-5 fw-bold">Successful</strong>
         </Toast.Header>
       <Toast.Body className="text-white p-2 fs-5">successfully Added, You can add more Certificates.</Toast.Body>
     </Toast>
     <button
     onClick={addCertificates}
     className="next-btn px-4 py-2 ms-auto me-2 align-self-center"
     >
       Add
     </button>
     </div>
      </Form>
    </>
  );
};
export default Certificates;
