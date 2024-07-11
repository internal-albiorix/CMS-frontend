import React, { useState, useEffect } from 'react'
import { Grid, Button, FormControl, InputLabel, MenuItem, Box, TextField, Checkbox } from '@mui/material';
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Title from '../../common/Title/TItle';
import { DataGrid, GridColDef, GridToolbarExport, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DropdownModel } from "../../models/DropdownModel";
import { getAllTechnology } from "../../services/TechnologyService";
import { getAllStatus } from "../../services/StatusService";
import { candidateDataModel } from "../../models/CandidateModel";
import { getAllCandidate ,getfilterCandidateData} from "../../services/CandidateService";
import { getAllTimeFrame } from '../../services/TimeFrameService';

const Reports: React.FC = () => {
    const [statusData, setStatusData] = useState<DropdownModel[]>([]);
    const [timeFrameData, setTimeFrameData] = useState<DropdownModel[]>([]);
    const [technologyData, setTechnologyData] = useState<DropdownModel[]>([]);
    const [selectedTechnology, setSelectedTechnology] = useState<string[]>([]);
    const [candidateDataList, setCandidateDataList] = useState<candidateDataModel[]>([]);
    const [timeFrame, setTimeFrame] = useState('')
   const [fromDateDisabled, setFromDateDisabled] = useState(false);
    const [toDateDisabled, setToDateDisabled] = useState(false);
    const [candidateStatus, setCandidateStatus] = useState<string[]>([])
    const [toDate, setToDate] = useState(null);
    const [fromDate, setFromDate] = useState(null);

    const [pageSize, setPageSize] = React.useState(10);


    useEffect(() => {
        getStatusData();
        getTechnologyData();
        getTimeFrameData();
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

    const getTimeFrameData = async () => {
        const { data, success } = await getAllTimeFrame("TimeFrame/GetAllTimeFrame");
        if (success) {
            let timeframeData = data.map((data: any) => {
                return {
                    key: data.id,
                    value: data.value,
                    text: data.name,
                };
            });
            setTimeFrameData(timeframeData);
        }
    };

    const getStatusData = async () => {
        const { data, success } = await getAllStatus("Status/GetAllStatus");
        if (success) {
            let statusData = data.map((data: any) => {
                return {
                    key: data.id,
                    value: data.statusName,
                    text: data.statusName,
                };
            });
            setStatusData(statusData);
        }
    };
    

    const GridCustomToolBar = () => {
        return (
            <Box sx={{ height: "45px" }} >
                <GridToolbarQuickFilter
                    className="muiGridSearch"
                    sx={{ float: "left", width: "30%" }} />
                <GridToolbarExport sx={{ float: 'right' }} />
            </Box>
        );
    }

    const columns: GridColDef[] = [
        {
            field: "fullName",
            headerName: "Full Name",
            headerClassName: "dataGridHeader",
            flex: 1,
            align: "left",
            headerAlign: "left",
        },
        {
            field: "mobileNumber",
            headerName: "Mobile No.",
            headerClassName: "dataGridHeader",
            flex: 1,
            align: "left",
            headerAlign: "left",
        },
        {
            field: "email",
            headerName: "Email",
            headerClassName: "dataGridHeader",
            flex: 1,
            align: "left",
            headerAlign: "left",
        },
        {
            field: "technology",
            headerName: "Technology",
            headerClassName: "dataGridHeader",
            flex: 1,
            align: "left",
            headerAlign: "left",
            minWidth: 200,
            renderCell(params) {
               const technologyDataModel = params.row.candidateTechnologies.map(
          (techName: any) => techName.technology.technologyName
        );
              return technologyDataModel.join(", ");
            },
          },
          {
            field: "status",
            headerName: "Status",
            headerClassName: "dataGridHeader",
            flex: 1,
            align: "left",
            headerAlign: "left",
            minWidth: 100,
            renderCell(params) {
              return params.row.statusModel.statusName;
            },
          },
    ];

    const handleTechnologyChange = (event: SelectChangeEvent<typeof selectedTechnology>) => {
        setSelectedTechnology(event.target.value as string[]);
    };
    const handleStatusChange = (event: SelectChangeEvent<typeof candidateStatus>) => {
        setCandidateStatus(event.target.value as string[]);
    };
    const handleTimeFrameChange = (event:any) => {
        const selectedTimeFrame = event.target.value;
        setTimeFrame(selectedTimeFrame);

        // Disable date pickers if a time frame is selected
        setFromDateDisabled(selectedTimeFrame !== '');
        setToDateDisabled(selectedTimeFrame !== '');
    };

    const handleFilter = async () => {
        debugger
        const timeFrameInt = parseInt(timeFrame);
        const { data, success } = await getfilterCandidateData(timeFrameInt,selectedTechnology, candidateStatus, fromDate, toDate);
        if (success) {
            setCandidateDataList(data);
        }
    };

    return (
        <div className="reportsWrapper">
            <Title titleName='Reports' />

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6} md={2}>
                    <FormControl fullWidth>
                        <InputLabel>Time Frame</InputLabel>
                        <Select label="Time Frame" value={timeFrame} onChange={handleTimeFrameChange}>
                            {timeFrameData.map((data: any) => (
                                <MenuItem key={data.key} value={data.value}>
                                    {data.text}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <FormControl fullWidth>
                        <InputLabel>Technology</InputLabel>
                        <Select
                            label="Technology"
                            value={selectedTechnology}
                            multiple
                            onChange={handleTechnologyChange}
                            renderValue={(selected) => selected.join(", ")}
                        >
                            {technologyData.map((tech) => (
                                <MenuItem key={tech.value} value={tech.value}>
                                    <Checkbox checked={selectedTechnology.includes(tech.value)} />
                                    {tech.text}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <FormControl fullWidth>
                        <InputLabel>Candidate Status</InputLabel>
                        <Select label="Candidate Status" value={candidateStatus} multiple onChange={handleStatusChange}
                            renderValue={(selected) => selected.join(", ")}>
                            {statusData.map((data: any) => (
                                <MenuItem key={data.value} value={data.value}>
                                    <Checkbox checked={candidateStatus.includes(data.value)} />
                                    {data.text}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DesktopDatePicker label="From Date" value={fromDate} onChange={(newValue) => { setFromDate(newValue) }}
                            renderInput={(props: any) => <TextField {...props} />}
                            disabled={fromDateDisabled} />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DesktopDatePicker label="To Date" value={toDate} onChange={(newValue) => { setToDate(newValue) }}
                            renderInput={(props: any) => <TextField {...props} />}
                            disabled={toDateDisabled} />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button variant="outlined" color="error" style={{ width: '60%', height: '100%' }} onClick={handleFilter}>Filter</Button>
                </Grid>
            </Grid>

            <DataGrid
                sx={{ p: 1 }}
                disableColumnMenu
                disableSelectionOnClick
                headerHeight={60}
                density="standard"
                rows={candidateDataList}
                columns={columns}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[5, 10, 15]}
                getRowId={(row) => row.id}
                components={{ Toolbar: GridCustomToolBar }}
                autoHeight={true}
            />
        </div>
    )
}

export default Reports