import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Container, Grid, Typography } from "@mui/material";
import { AppCurrentVisits, AppWebsiteVisits, AppWidgetSummary, AppSeatAvailability } from "./index";
import { useAuth } from '../../../../hooks/useAuth';
import { dashboardApi, seatApi } from '../../../../services/api';

export default function DashboardAppPage() {
  const { user } = useAuth();
  const theme = useTheme();
  const [seatStatistics, setSeatStatistics] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashRes, seatRes] = await Promise.all([
        dashboardApi.getStats(),
        seatApi.getStatistics()
      ]);
      if (dashRes.data?.success) setStats(dashRes.data.data);
      if (seatRes.data?.success) setSeatStatistics(seatRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Build chart labels + data arrays from real activityChart
  const buildChartData = () => {
    if (!stats?.activityChart) return { labels: [], checkIns: [], booksIssued: [] };
    const { checkIns = [], booksIssued = [] } = stats.activityChart;
    const labels = checkIns.map(d => `${d._id.day}/${d._id.month}/${d._id.year}`);
    return { labels, checkIns: checkIns.map(d => d.count), booksIssued: booksIssued.map(d => d.count) };
  };

  const chartData = buildChartData();

  return (
    <>
      <Helmet>
        <title> Library | Dashboard </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Smart Library Admin Dashboard - Hi {user.name.split(' ')[0]}!
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Books" total={stats?.summaryCards?.totalBooks ?? 0} icon={'eva:book-outline'} color="primary" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Active Members" total={stats?.summaryCards?.activeMembers ?? 0} color="info" icon={'eva:people-outline'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Books Issued Today" total={stats?.summaryCards?.issuedToday ?? 0} color="warning" icon={'eva:bookmark-outline'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Overdue Books" total={stats?.summaryCards?.overdueBooks ?? 0} color="error" icon={'eva:alert-triangle-outline'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Library Usage Analytics"
              subheader="Daily check-ins and book issues (Last 7 days)"
              chartLabels={chartData.labels}
              chartData={[
                { name: 'Check-ins', type: 'column', fill: 'solid', data: chartData.checkIns },
                { name: 'Books Issued', type: 'area', fill: 'gradient', data: chartData.booksIssued },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Book Categories Distribution"
              chartData={
                stats?.booksByGenre?.length > 0
                  ? stats.booksByGenre.map(g => ({ label: g.label, value: g.value }))
                  : [{ label: 'No data', value: 1 }]
              }
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
                theme.palette.success.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppSeatAvailability statistics={seatStatistics} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
