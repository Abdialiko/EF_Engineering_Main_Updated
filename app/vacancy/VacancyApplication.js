// import { useEffect } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StepProgressBar from "./ProgressBar";
import Certificates from "./Certificates";
import EducationalInfo from "./EducationalInfo";
import ExperienceInfo from "./Experience";
import PersonalInfo from "./PersonalInfo";
import Documents from "./Document";
import validatePersonalInfo from "./validatePersonalInfo";
import Spinner from 'react-bootstrap/Spinner';
import apiCall from "../../url/filepath";
const VacancyApplication = () => {
  const [step, setStep] = useState(1);
  const [personalData, setPersonalData] = useState({
    f_name: "",
    m_name: "",
    l_name: "",
    birth_date: "",
    email: "",
    phone_no: "",
    city: "",
    sub_city: "",
    woreda:"",
    cv:null,
    supporting_doc:null,
    job_id:null
  });
  const [educationalData, setEducationalData] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading,setIstLoading] = useState(false)
  const {id} = useParams()
  useEffect(()=>{
    setPersonalData(prevData=>{
      return {...prevData,job_id:id}
    })
  },[id])

  const submitApplication = async () => {
    setIstLoading(true)
    let applicant = new FormData()
    applicant.append("f_name",personalData.f_name)
    applicant.append("m_name",personalData.m_name)
    applicant.append("l_name",personalData.l_name)
    applicant.append("birth_date",personalData.birth_date)
    applicant.append("email",personalData.email)
    applicant.append("phone_no",personalData.phone_no)
    applicant.append("cv",personalData.cv)
    applicant.append("supporting_doc",personalData.supporting_doc)
    applicant.append("city",personalData.city)
    applicant.append("sub_city",personalData.sub_city)
    applicant.append("woreda",personalData.woreda)
    applicant.append("job_id",personalData.job_id)
    
    educationalData.forEach((data,i)=>{
      applicant.append(`education[${i}],`,JSON.stringify(data))
    })
    experiences.forEach((data,i)=>{
      applicant.append(`experience[${i}],`,JSON.stringify(data))
    })
    certificates.forEach((data,i)=>{
      applicant.append(`certificate[${i}],`,JSON.stringify(data))
    })
    try {
      const response = await apiCall.post("applicants", applicant);
      if (response.status === 201) {
        setStep(6);
      }
    } catch (err) {
      setErrors(prevErrors =>{
        return {...prevErrors,notify:"Sorry, Faild to send your application.try again"}
      });
    }
    finally{
      setIstLoading(false)
    }
  };
  const nextHandler = ()=>{
    let errorValues = {}
    if(step === 1){
      errorValues= validatePersonalInfo(personalData)
      if(Object.values(errorValues).length === 0){
        setStep((step) => step + 1)
      }
      else{
        setErrors(errorValues)
        
      }
    }
    else{
      setStep((step) => step + 1)
    }
  }
  const getPage = () => {
    switch (step) {
      case 1:
        return <PersonalInfo data={personalData} setData={setPersonalData} errors={errors} setErrors={setErrors} />;
      case 2:
        return <EducationalInfo data={educationalData} setData={setEducationalData} />  
        case 3:
          return <ExperienceInfo data={experiences} setData={setExperiences} />;      
      case 4:
        return <Certificates data={certificates} setData={setCertificates} />;
      case 5:
        return <Documents data={personalData} setData={setPersonalData} errors={errors} setErrors={setErrors} />;
       
      case 6:
        return ""

      default:
        return <div>Some thing went wrong</div>;
    }
  };

  return (
    <>
      {step < 6 && (
        <div>
          <div className="multi-step-progress p-3 px-md-0 pt-lg-5 ">
            <StepProgressBar step={step} />
          </div>
          <div className="vacancy-parent-wraper px-3 px-md-5 my-md-5 pt-lg-5 pb-5">
            {getPage()}
            <div className="d-flex justify-content-between mt-5">
              {step > 1 && (
                <button
                  onClick={() => setStep((step) => step - 1)}
                  className="back-btn px-5 py-2"
                >
                  Back
                </button>
              )}
              {step < 5 ? (
                <button
                  onClick={nextHandler}
                  className="next-btn px-5 py-2 ms-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={submitApplication}
                  className="next-btn px-5 py-2 ms-auto"
                >
                {!isLoading ? "Submit": <span>Sending <Spinner animation="border" variant="white" size="sm" /></span>}
                  
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {step === 6 && (
        <div className="confirmation-message">
          <div className="border border-success rounded-3 p-3 p-5 fs-5 text-success">
            Your application is successfully completed, We will contact
            you.Thank you for applying
          </div>
        </div>
      )}
    </>
  );
};
export default VacancyApplication;
