import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';



const steps = ['Select what to import', 'Select Lead Interested Products', 'Confirm Conversion'];

const ConvertProspect = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const totalSteps = () => steps.length;

  const completedSteps = () => Object.keys(completed).length;

  const isLastStep = () => activeStep === totalSteps() - 1;

  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    setCompleted({ ...completed, [activeStep]: true });
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
            <>
          {/* <form>
            <div className="w-210 ml-2 border border-gray-300 p-4 rounded-lg">
              <div className="text-gray-600 ml-5 mt-2">
                <label htmlFor="prospectId">Prospect ID</label>
                <input
                  id="prospectId"
                  className="p-2 rounded w-70 border border-gray-200 ml-6"
                  placeholder="Prospect ID"
                />
              </div>

             <div className="ml-5 mt-9 text-blue-700 space-y-5">
                    <div className="flex items-center">
                        <label className="w-56">Import Contact Persons?</label>
                        <input type="checkbox" />
                    </div>
                    <div className="flex items-center">
                        <label className="w-56">Import Emails?</label>
                        <input type="checkbox" />
                    </div>
                    <div className="flex items-center">
                        <label className="w-56">Import Addresses?</label>
                        <input type="checkbox" />
                    </div>
                    <div className="flex items-center">
                        <label className="w-56">Import Phones?</label>
                        <input type="checkbox" />
                    </div>
            </div>

            </div>
          </form> */}

          {/* <AddProspectAsLead/> */}
          </>
        );

      case 1:
        return (
          <div className="p-4 border border-gray-300 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Select Interested Products</h3>
            <select className="border border-gray-300 p-2 rounded w-full">
              <option value="">Select Product</option>
              <option value="product1">Product 1</option>
              <option value="product2">Product 2</option>
              <option value="product3">Product 3</option>
            </select>
          </div>
        );

      case 2:
        return (
          <div className="p-4 border border-gray-300 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Confirm Conversion</h3>
            <p className="mb-2">Please review the selected details before proceeding.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Confirm and Convert
            </button>
          </div>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>

      <div>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
              {getStepContent(activeStep)}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext} sx={{ mr: 1 }}>
                Next
              </Button>
              {activeStep !== steps.length && (
                completed[activeStep] ? (
                  <Typography variant="caption" sx={{ display: 'inline-block' }}>
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1 ? 'Finish' : 'Complete Step'}
                  </Button>
                )
              )}
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
};

export default ConvertProspect;
