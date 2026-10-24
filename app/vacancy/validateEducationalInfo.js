const validateEducationalInfo = (values) => {
  const errors = {};
  if (!values.study_field) {
    errors.study_field = "title of field of study is required";
  } else if (values.study_field?.lengh > 70) {
    errors.study_field = "please enter shorter title";
  }
  if (!values.company) {
    errors.company = "institution name  is required";
  } else if (values.company?.lengh > 70) {
    errors.company = "please enter shorter institution name";
  }
  if (!values.degree_type) {
    errors.degree_type = "qualification name  is required";
  } else if (values.degree_type?.lengh > 70) {
    errors.degree_type = "please enter shorter qualification name";
  }
  if (!values.cgpa) {
    errors.cgpa = "final grade is required";
  }

  if (!values.start_date) {
    errors.start_date = "start date is required";
  }
  if (!values.end_date) {
    errors.end_date = "end date is required";
  }
  return errors;
};
export default validateEducationalInfo;
