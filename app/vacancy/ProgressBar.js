import React from "react";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
 
const StepProgressBar = ({step}) => {

    return (
      <ProgressBar
        percent={((step-1)*100/4)}
        filledBackground="linear-gradient(to right, #010648, #010648)"
      >
        <Step transition="scale">
          {({ accomplished }) => (
           <div className={`step ${accomplished ? 'completed':''}`}>1</div>
            
          )}
        </Step>
        <Step transition="scale">
          {({ accomplished }) => (
            <div className={`step ${accomplished ? 'completed':''}`}>2</div>
          )}
        </Step>
        <Step transition="scale">
          {({ accomplished }) => (
            <div className={`step ${accomplished ? 'completed':''}`}>3</div>
          )}
        </Step>
        <Step transition="scale">
        {({ accomplished }) => (
          <div className={`step ${accomplished ? 'completed':''}`}>4</div>
        )}
      </Step>
      <Step transition="scale">
        {({ accomplished }) => (
          <div className={`step ${accomplished ? 'completed':''}`}>5</div>
        )}
      </Step>
      </ProgressBar>
    );
  }
export default StepProgressBar