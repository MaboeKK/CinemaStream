import React from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import AdminNavbar from '../../../components/admin/AdminNavbar';
import StatsWidget from '../../../components/admin/StatsWidget';
import TopShowsChart from '../../../components/admin/TopShowsChart';
import UserGrowthChart from '../../../components/admin/UserGrowthChart';
import ActivityHeatmap from '../../../components/admin/ActivityHeatmap';
import './DashboardPage.scss';

const DashboardPage = () => (
  <div className="dashboard-home">
    <AdminSidebar />
    <div className="dashboard-homeContainer">
      <AdminNavbar />
      <div className="widgets">
        <StatsWidget type="users" />
        <StatsWidget type="genres" />
      </div>
      <div className="charts">
        <TopShowsChart />
      </div>
      <div className="chart-wrapper">
        <UserGrowthChart />
      </div>
      <div className="heatmap">
        <ActivityHeatmap />
      </div>
    </div>
  </div>
);

export default DashboardPage;
