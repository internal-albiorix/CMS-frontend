import React, { useEffect, useState } from "react";
import { Grid, Card } from "@mui/material";
import "./FirstGrid.css";
import { getAllCurrentOpenings } from "../../../services/CurrentOpeningService";
import Loader from "../../../helpers/Loader";
import {
  getCandidateByStatusNames,
  getCandidateCount,
  getInterviewerCount,
} from "../../../services/DashboardService";

const FirstGrid: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [noOfopeningCount, setnoOfopeningCount] = useState(0);
  const [noOfInterviewerCount, setOfInterviewerCount] = useState(0);
  const [candidateCount, setCandidateCount] = useState(0);
  const [selectedCandidateCount, setSelectedCandidateCount] = useState(0);

  useEffect(() => {
    getCurrentOpeningData();
    getInterviewerData();
    getCandidateCountData();
  }, []);

  const getCurrentOpeningData = async () => {
    setLoading(true);
    const { data, success } = await getAllCurrentOpenings(
      "CurrentOpening/GetAllCurrentOpening"
    );
    if (success) {
      let noOfOpening = 0;
      data.map((item: any) => {
        noOfOpening = noOfOpening + item.noofopening;
      });
      setnoOfopeningCount(noOfOpening);
      setLoading(false);
    }
  };

  const getCandidateCountData = async () => {
    setLoading(true);
    const { data, success } = await getCandidateCount(
      "Dashboard/GetCandidateCount"
    );
    if (success) {
      setCandidateCount(Number(data));
      const { data: selectedCandidateCount, success } =
        await getCandidateByStatusNames("Selected");
      if (success) {
        if (Number(data) > 0) {
          const successRatio = (
            (Number(selectedCandidateCount) / Number(data)) *
            100
          ).toFixed(2);
          setSelectedCandidateCount(Number(successRatio));
        } else {
          setSelectedCandidateCount(0);
        }
      }
    }
    setLoading(false);
  };

  const getInterviewerData = async () => {
    setLoading(true);
    const { data, success } = await getInterviewerCount();
    if (success) {
      setOfInterviewerCount(Number(data.length));
    }
    setLoading(false);
  };
  const cardData = [
    {
      cardheaderText: "CANDIDATES",
      cardSubText: "Total Candidates",
      amount: candidateCount,
    },
    {
      cardheaderText: "OPENINGS",
      cardSubText: "Current Openings",
      amount: noOfopeningCount,
    },
    {
      cardheaderText: "INTERVIEWERS",
      cardSubText: "Total Interviewers",
      amount: noOfInterviewerCount,
    },
    {
      cardheaderText: "SUCCESS RATIO",
      cardSubText: "Selected Candidates",
      amount: `${selectedCandidateCount}%`,
    },
  ];
  return (
    <>
      {loading && <Loader />} {/* Display loader when loading */}
      {!loading && (
    <Grid container spacing={3} className="firstGrid">
      {cardData.map((card) => (
        <Grid item xs={12} sm={6} md={3} key={card.cardheaderText}>
          <Card variant="outlined" className="eachCard">
            <Grid container columnSpacing={1}>
              <Grid item xs={8} className="leftSide">
                <span className="cardHeaderText">{card.cardheaderText}</span>
                <span className="cardSubText">{card.cardSubText}</span>
              </Grid>
              <Grid item xs={4} className="rightSide">
                <span className="cardAmount">{card.amount}</span>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      ))}
    </Grid>
  )}
    </>
  );
};

export default FirstGrid;
