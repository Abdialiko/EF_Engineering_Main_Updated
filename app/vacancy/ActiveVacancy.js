import { useEffect,useState } from "react";
import { spinnerAction } from "../../stores/spinner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {TfiFaceSad} from 'react-icons/tfi'
import apiCall from "../../url";
const ActiveVacancy = () => {
  const [jobs,setJobs] = useState([])
  const navigate = useNavigate();
  const dispatch = useDispatch()
   const fetchJobs = async () =>{
     try{
      dispatch(spinnerAction.setIsLoading(true))
      const response = await apiCall.get('jobs')
      if(response.status === 200){
        setJobs(response.data)
      }
     }
     catch(err){}
     finally{
      dispatch(spinnerAction.setIsLoading(false))
     }
   }
useEffect(()=>{
  fetchJobs()
// eslint-disable-next-line react-hooks/exhaustive-deps
},[])
  return (
    <div className="px-3 px-lg-5 py-5 mb-lg-5">
    {
      jobs.length > 0 && 
      <div>
    <h3 className="text-center py-3">Currently Opened Vacancies at EF Engineering and Consalting Organization</h3>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">      
          {
            jobs.map(job=>(
              <div key={job.id} className="col">
              <div className="card h-100">
                <div className="card-body p-3">
                  <div className="d-flex">
                    <span className="fw-bold">Job Title : </span>
                    <span className="ms-2">{job.title}</span>
                  </div>
                  <div className="d-flex mt-2">
                    <span className="fw-bold">Job Type : </span>
                    <span className="ms-2">{job.type}</span>
                  </div>
                  <div className="d-flex mt-2">
                    <span className="fw-bold">Application deadline : </span>
                    <span className="ms-2">{job.deadline}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/vacancy/${job.id}`)}
                    className="next-btn px-4 py-1 mt-3"
                  >
                    View Detail
                  </button>
                </div>
              </div>
            </div>
         
          ))
            }
      </div>
      </div>
       }

          {
            jobs.length === 0 && <div className="w-100 h-100 fs-4 d-flex justify-content-center align-items-center">
            <div className="fs-1 me-2 text-warning align-self-start"><TfiFaceSad /></div>
            <div>There is No currently available vacancy  in our Organization</div>
            </div>
          }
    </div>
  );
};
export default ActiveVacancy;
