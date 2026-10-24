import { useState } from "react";
import Form from "react-bootstrap/Form";
import Toast from 'react-bootstrap/Toast';
import validateExperienceinfo from "./ValidateExperience";
const ExperienceInfo = ({ data, setData }) => {
    
  const [experience, setExperience] = useState({
    title: "",
    company: "",
    start_date: "",
    end_date: "",
    summary:"",
    is_current:false
  });
  const [errors,setErrors] = useState({})
  const [show,setShow] = useState(false)
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setExperience((previousExperience) => {
      return { ...previousExperience, [name]: value };
    });
    if(value){
      setErrors({...errors,[name]:""})
    }
  };
  const addEducationInfo = (e) => {
    e.preventDefault();
    const errorValues = validateExperienceinfo(experience)
    if(Object.values(errorValues)?.length > 0){
      setErrors(errorValues)
    }
    else{
      setData((previousData) => {
        return [...data, experience];
      });
      setExperience({});
      setShow(true)
    }
   
  };
  return (
    <>
      <div className="text-center pb-3 pb-lg-5">
        Fill your experience information here,Click Add Button to save each
        experience information,you can add more than one experience. Finally click Next button to go to the next form
      </div>

      <Form className="border rounded p-3">
        <div className="d-md-flex">
          <Form.Group className="mb-3 me-md-4 flex-fill " controlId="fname">
            <Form.Label>Position</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={experience.title || ""}
              onChange={changeHandler}
              className={errors.title ?"red-border":""}
              />
              {errors.title ?<span className="red-text">{errors.title }</span>:""}
          </Form.Group>
          <Form.Group className="mb-3 me-3 flex-fill" controlId="mname">
            <Form.Label>Organization</Form.Label>
            <Form.Control
              type="text"
              name="company"
              value={experience.company || ""}
              onChange={changeHandler}
              className={errors.company ?"red-border":""}
              />
              {errors.company ?<span className="red-text">{errors.company }</span>:""}
          </Form.Group>
        </div>
        <div className="d-md-flex">
          <Form.Group className="mb-3 flex-fill me-md-4" controlId="mname">
            <Form.Label>Start Date </Form.Label>
            <Form.Control
              type="date"
              name="start_date"
              value={experience.start_date || ""}
              onChange={changeHandler}
              className={errors.start_date ?"red-border":""}
              />
              {errors.start_date ?<span className="red-text">{errors.start_date }</span>:""}
          </Form.Group>
          <Form.Group className="mb-3 me-3 flex-fill " controlId="fname">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="end_date"
              value={experience.end_date || ""}
              onChange={changeHandler}
              className={errors.end_date ?"red-border":""}
              />
              {errors.end_date ?<span className="red-text">{errors.end_date }</span>:""}
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
        <Toast.Body className="text-white p-2 fs-5">successfully Added, You can add more qualification.</Toast.Body>
      </Toast>
          <button
            onClick={addEducationInfo}
            className="next-btn px-4 py-2 ms-auto me-2 align-self-center"
          >
            Add
          </button>
        </div>
      </Form>
    </>
  );
};
export default ExperienceInfo;
