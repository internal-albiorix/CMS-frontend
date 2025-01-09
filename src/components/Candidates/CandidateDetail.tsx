import { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  Typography,
  Container,
  Box,
  Link,
  Paper,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { getCandidateById } from '../../services/CandidateService';
import Loader from "../../helpers/Loader";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import formatDateTime from '../../helpers/FormatDateTime';

function CandidateDetail() {
  const location = useLocation();
  const { candidateId } = location.state || {};

  const [candidateDetailData, setCandidateDetailData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch candidate data by ID
  const fetchCandidateData = async () => {
    if (candidateId) {
      const numericCandidateId = Number(candidateId); // Ensure the candidateId is a number
      try {
        setLoading(true);
        const { data, success } = await getCandidateById(numericCandidateId);

        if (success) {
          setCandidateDetailData(data);
        } else {
          toast.error("Failed to fetch candidate details. Please try again.");
        }
      } catch (error) {
        toast.error("Error fetching candidate details. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCandidateData();
  }, [candidateId]);

  return (
    <>
      {loading && <Loader />} {/* Display loader when loading */}
      {!loading && (
          <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
            <Grid container spacing={4} alignItems="flex-start">
              {/* Title */}
              <Grid item xs={12}>
                <Typography variant="h4" component="h1" gutterBottom>
                  Candidate Details
                </Typography>
              </Grid>

              {/* Candidate Details */}
              <Grid item xs={12} md={6}>
                <Box sx={{ marginBottom: 2 }}>
                  <Typography variant="h5">{candidateDetailData?.fullName}</Typography>
                  <Typography variant="subtitle1">
                    <strong>Email:</strong> {candidateDetailData?.email || 'N/A'}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Mobile:</strong> {candidateDetailData?.mobileNumber || 'N/A'}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Technologies:</strong>{' '}
                    { candidateDetailData?.technologyModel.map((tech: { technologyName: any; }) => tech.technologyName).join(', ') || 'N/A'}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Experience:</strong> {candidateDetailData?.experience || 'N/A'} years
                  </Typography>
                </Box>
              </Grid>

              {/* Additional Candidate Info */}
              <Grid item xs={12} md={6}>
                <Box sx={{ marginBottom: 2 }}>
                  <Typography variant="subtitle1">
                    <strong>Status:</strong> {candidateDetailData?.statusModel?.statusName || 'N/A'}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Interview Link:</strong>{' '}
                    {candidateDetailData?.candidateInterviewSchedule[0]?.googleMeetLink ? (
                      <Link
                        href={candidateDetailData?.candidateInterviewSchedule[0]?.googleMeetLink}
                        target="_blank"
                        rel="noopener"
                        variant="body1"
                      >
                        Join Meeting
                      </Link>
                    ) : (
                      'N/A'
                    )}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Interview Date:</strong>{' '}
                    {candidateDetailData?.candidateInterviewSchedule[0] ? (formatDateTime(candidateDetailData?.candidateInterviewSchedule[0]?.startDate) || 'N/A') : 'N/A'}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Resume:</strong>{' '}
                    {candidateDetailData?.driveLink ? (
                      <Link
                        href={candidateDetailData?.driveLink}
                        target="_blank"
                        rel="noopener"
                        variant="body1"
                      >
                        View Resume
                      </Link>
                    ) : (
                      'N/A'
                    )}
                  </Typography>
                </Box>
              </Grid>

              {/* Back Button */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </Button>
              </Grid>
            </Grid>
          </Paper>
      )}
    </>
  );
}

export default CandidateDetail;
