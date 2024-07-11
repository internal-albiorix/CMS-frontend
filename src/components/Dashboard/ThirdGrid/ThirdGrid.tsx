import React, { useState, useEffect } from "react";
import { Grid, Card } from "@mui/material";
import "./ThirdGrid.css";
import { PieChart } from "@mui/x-charts/PieChart";
import { candidateChartData } from "../../../models/DashboardModel";
import { getAllCandidatesForChart } from "../../../services/DashboardService";

const ThirdGrid: React.FC = () => {
  const [data, setGraphData] = useState<candidateChartData[]>([]);
  useEffect(() => {
    getAllCandidateData();
  }, []);
  const getAllCandidateData = async () => {
    const { data: candidateData, success } = await getAllCandidatesForChart();
    if (success) setGraphData(candidateData);
  };
  return (
    <Grid container spacing={3} className="thirdGrid">
      <Grid item xs={12} sm={12} md={12}>
        <Card variant="outlined" className="eachCard">
          <span className="chartTitle">Candidates By Technology</span>
          <PieChart
            series={[
              {
                data,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: "gray",
                },
              },
            ]}
            height={200}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default ThirdGrid;
