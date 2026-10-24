import {useState,useEffect} from 'react'
import { useNavigate,useParams } from "react-router-dom";
import apiCall from "../../url";
const VacancyDetail = () => {
  const [jobDetail,setJobDetail] = useState({})
  const navigate = useNavigate();
  const {id} = useParams()
  const fetchJobDetail = async() =>{
    try{
      const response = await apiCall.get(`jobs/${id}`)
      if(response.status === 200){
        setJobDetail(response.data)
      }
    }
    catch(err){

    }

  }
  useEffect(()=>{
    fetchJobDetail()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  console.log(' job detail=',jobDetail)
  return (
    <div className="vacancy-detail">
    <div className="vacancy-wrapeer">
    <div className="p-3 p-lg-5 container">
     {
      jobDetail &&(
        <div className="border rounded-3 px-3 px-lg-4 pt-3 pb-5 bg-white">
        <div className="fs-5 p-2 fw-bold">Read the job description here carefully before applying</div>
          <div className="d-flex">
            <span className="fw-bold">Jop Title : </span>
            <span className="ms-2">{jobDetail.title}</span>
          </div>
          <div className="d-flex mt-2">
            <span className="fw-bold">Jop Type : </span>
            <span className="ms-2">{jobDetail.type}</span>
          </div>
          <div className="d-flex mt-2">
            <span className="fw-bold">Application deadline : </span>
            <span className="ms-2">{jobDetail.deadline}</span>
          </div>
          <div className="fs-5 fw-bold pt-3">Job Description</div>
          <div dangerouslySetInnerHTML={{__html:jobDetail.description}}>
          </div>
          <div className="fs-5 fw-bold">
            If you are Qualified and Interested click the button below to apply
            for this job.
          </div>
          <button
            onClick={() => navigate(`/application/${id}`)}
            className="next-btn px-4 py-1 mt-3"
          >
            Apply Here
          </button>
        </div>
      )
     }
    </div>
    </div>
    </div>
  );
};
export default VacancyDetail;
