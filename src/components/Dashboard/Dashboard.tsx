import React from 'react';
import Title from '../../common/Title/TItle';
import "./Dashboard.css"
import FirstGrid from './FirstGrid/FirstGrid';
import SecondGrid from './SecondGrid/SecondGrid';
import ThirdGrid from './ThirdGrid/ThirdGrid';

const Dashboard: React.FC = () => {

    return (
        <div className="dashboardWrapper">
            <Title titleName='Dashboard' />

            <FirstGrid />

            <SecondGrid />

            <ThirdGrid />

        </div>
    )
}

export default Dashboard