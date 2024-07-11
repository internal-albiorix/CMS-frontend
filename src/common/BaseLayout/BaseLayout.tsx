import React from 'react'
import Sidebar from './Sidebar';
import HeaderBar from './HeaderBar';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline';

const BaseLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const toggleSideBar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <div>
            <HeaderBar toggleSideBar={toggleSideBar} isSidebarOpen={isSidebarOpen} />
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Sidebar isSidebarOpen={isSidebarOpen} />

                <Box sx={{ flexGrow: 1, overflow: 'auto', padding: '0px 24px', height: 'calc(100vh - 64px)' }}>
                    {/* Render children routes */}
                    <Outlet />
                </Box>
            </Box>
        </div>
    )
}

export default BaseLayout;
