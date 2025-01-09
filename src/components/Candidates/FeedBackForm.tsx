import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Title from "../../common/Title/TItle";
import { Box, Button, Container, Grid } from "@mui/material";
import TextInput from "../../common/Controls/TextInput";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SaveIcon from "@mui/icons-material/Save";
import MultiSelectDropdown from "../../common/Controls/MultiSelectDropdown";
import { getAllTechnology } from "../../services/TechnologyService";
import { DropdownModel } from "../../models/DropdownModel";
import { getAllInterviewRound } from "../../services/InterviewRoundService";
import SelectDropdown from "../../common/Controls/SelectDropdown";
import {
  communicationdropItems,
  recomonddropItems,
} from "../../helpers/CommonData";
import { getSecureLocalStorage } from "../../helpers/SecureLocalStorage";
import { feedBackModel } from "../../models/FeedBackModel";
import { insertFeedBack } from "../../services/FeedBackService";
import ErrorMessage from "../../common/Controls/ErrorMessage";

const FeedBackForm: React.FC = () => {
  const locationData = useLocation();
  const [technologyData, setTechnologyData] = useState<DropdownModel[]>([]);
  const [InterviewRoundDataList, setInterviewRoundDataList] = useState<
    DropdownModel[]
  >([]);

  const [feedbackData] = useState<feedBackModel>({
    id: 0,
    todayDate: new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(new Date()),
    interviewerFullName: getSecureLocalStorage("fullname") || "",
    candidateFullName: locationData?.state?.model?.fullName,
    experience: locationData?.state?.model?.experience,
    technologyIds: [],
    interviewRoundId: "",
    communication: "",
    practicalcompletion: "",
    codingstandard: "",
    techanicalround: "",
    recommandedforPractical: "",
    comments: "",
    candidateId: locationData?.state?.model?.id,
  });
  useEffect(() => {
    getTechnologyData();
    getInterviewRoundList();
  }, []);
  const getTechnologyData = async () => {
    const { data, success } = await getAllTechnology();
    if (success) {
      let technologyData = data.map((data: any) => {
        return {
          key: data.id,
          value: data.technologyName,
          text: data.technologyName,
        };
      });
      setTechnologyData(technologyData);
    }
  };

  const getInterviewRoundList = async () => {
    const { data, success } = await getAllInterviewRound();
    if (success) {
      let intRoundData = data.map((data: any) => {
        return {
          key: data.id,
          value: data.interviewRoundName,
          text: data.interviewRoundName,
        };
      });
      setInterviewRoundDataList(intRoundData);
    }
  };
  const validationSchema = yup.object().shape({
    interviewRoundId: yup.string().required("Interview Round required"),
    technologyIds: yup.array().min(1, "Minimum 1 technology required").required("At least one technology is required"),
    comments: yup.string().required("Comments name required"),
  });
  
  const navigate = useNavigate();
  const onFormSubmit = async (values: feedBackModel) => {
    values.candidateId = locationData?.state?.model?.id;
    let res = await insertFeedBack(values);
    if (res.success) {
      toast.success(res.message);
      setTimeout(() => {
        navigate("/candidates");
      }, 3000);
    } else toast.error("Something went wrong!!!");
  };
  return (
    <>
      <Title titleName="Feedback Form" />
      <div style={{ width: "100%" }}>
        <Container
          component="main"
          maxWidth="sm"
          sx={{ position: "relative", top: "4%" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "16px 24px",
              border: "1px solid #d4cfcf",
              boxShadow: "0px 5px 8px 2px rgb(206 204 204)",
              borderRadius: "10px",
            }}
          >
            <Formik
              initialValues={feedbackData}
              validationSchema={validationSchema}
              onSubmit={onFormSubmit}
              enableReinitialize
            >
              {({ resetForm, touched, errors }) => (
                <Form id="feedbackform">
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12}>
                      <TextInput
                        label="Date"
                        value={new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        }).format(new Date())}
                        name="todayDate"
                      />
                      <ErrorMessage touched={touched.todayDate} errors={errors.todayDate} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextInput
                        label="Interviewer Full Name"
                        value={getSecureLocalStorage("fullname")}
                        name="interviewerFullName"
                      />
                      <ErrorMessage touched={touched.interviewerFullName} errors={errors.interviewerFullName} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextInput
                        label="Candidate Full Name"
                        value={locationData?.state?.model?.fullName}
                        name="candidateFullName"
                      />
                      <ErrorMessage touched={touched.candidateFullName} errors={errors.candidateFullName} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextInput
                        label="Experience"
                        name="experience"
                        value={locationData?.state?.model?.experience}
                      />
                      <ErrorMessage touched={touched.experience} errors={errors.experience} />
                    </Grid>
                    <Grid item xs={12}>
                      <MultiSelectDropdown
                        items={technologyData}
                        label="Technology"
                        name="technologyIds"
                        valueField="value"
                      />
                      <ErrorMessage touched={touched.technologyIds} errors={errors.technologyIds} />
                    </Grid>
                    <Grid item xs={12}>
                      <SelectDropdown
                        items={InterviewRoundDataList}
                        label="Interview Round"
                        name="interviewRoundId"
                        valueField="value"
                      />
                      <ErrorMessage touched={touched.interviewRoundId} errors={errors.interviewRoundId} />
                    </Grid>
                    <Grid item xs={12}>
                      <SelectDropdown
                        items={communicationdropItems}
                        label="Communication"
                        name="communication"
                        valueField="value"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextInput
                        label="Practical completion (0 - 100)%"
                        name="practicalcompletion"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextInput
                        label="coding standard (0 - 100)%"
                        name="codingstandard"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextInput
                        label=" Technical Round (0 - 100)%"
                        name="techanicalround"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <SelectDropdown
                        items={recomonddropItems}
                        label="Recommanded for Practical"
                        name="recommandedforPractical"
                        valueField="value"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextInput
                        id="commentsid"
                        label="Notes (Please add done points and not done points)"
                        name="comments"
                        multiline
                        rows={6}
                        style={{ width: "100%" }}
                      />
                      <ErrorMessage touched={touched.comments} errors={errors.comments} />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ mb: 2 }} spacing={1}>
                    <Grid item xs={7.6}></Grid>
                    <Grid item xs={2}>
                      <Button
                        variant="contained"
                        color="inherit"
                        onClick={() => resetForm()}
                      >
                        Reset
                      </Button>
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<SaveIcon />}
                        type="submit"
                      >
                        Save
                      </Button>
                    </Grid>
                    <Grid item xs={3}></Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
          <ToastContainer autoClose={2000} closeOnClick />
        </Container>
      </div>
    </>
  );
};

export default FeedBackForm;
