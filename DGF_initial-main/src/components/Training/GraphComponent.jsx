import { Box, Typography } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import PropTypes from 'prop-types';
 
ChartJS.register(ArcElement, Tooltip, Legend);
 
// Create individual Box components for the graph sections
const GraphHeader = ({ title }) => (
  <Typography
    variant="h5"
    sx={{
      mb: 1,
      fontWeight: 'bold',
      textAlign: 'left',
      whiteSpace: 'normal',
      marginLeft: '10px',
    }}
  >
    {title}
  </Typography>
);
 
GraphHeader.propTypes = {
  title: PropTypes.string.isRequired,
};
 
const GraphChart = ({ chartData, chartOptions, totalRequests }) => (
  <Box sx={{
    width: '30%',
    height: '100%',
    position: 'relative',
  }}>
    <Doughnut data={chartData} options={chartOptions} />
    <Box sx={{
      position: 'absolute',
      top: '48%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
    }}>
      <Typography className="numbers" variant="h6" sx={{
        fontSize: '1.5rem !important',
        fontWeight: 'bold',
        color: 'black',
      }}>
        {totalRequests}
      </Typography>
      <Typography variant="body1" sx={{
        color: '#555555',
        fontSize: '2rem',
      }}>
        Requests
      </Typography>
    </Box>
  </Box>
);
 
GraphChart.propTypes = {
  chartData: PropTypes.object.isRequired,
  chartOptions: PropTypes.object.isRequired,
  totalRequests: PropTypes.number.isRequired,
};
 
const GraphDetails = ({ details, colors }) => (
  <Box sx={{
    textAlign: 'left',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginLeft: 2,
    gap: 2, // Add gap between details
  }}>
    {details.map((detail, index) => {
      const [label, value] = detail.split(': ');
      const isFourthChild = index === 3;
      return (
        <Typography className="details"
          key={index}
          variant="body1"
          sx={{ display: 'inline-flex', marginRight: 3, marginBottom: 1.4, whiteSpace: 'normal' }}
          dangerouslySetInnerHTML={{ __html: `<span style="font-weight: bold; font-size: 1.5rem; color: ${colors[index]}; ${isFourthChild? 'padding-left: 4px;':''}">${value}</span><span style="margin-left: 5px;margin-top:7px; color: #555555; font-size: 0.7rem;">${label}</span>` }}
        />
      );
    })}
  </Box>
);
 
GraphDetails.propTypes = {
  details: PropTypes.arrayOf(PropTypes.string).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
};
 
const GraphComponent = ({ title, data, details }) => {
  const totalRequests = data.values.reduce((a, b) => a + b, 0);
 
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: data.colors,
        hoverBackgroundColor: data.hoverColors,
        borderWidth: 1,
      },
    ],
  };
 
  const chartOptions = {
    cutout: '85%',
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };
 
  return (
    <Box className="graph-container" sx={{
      textAlign: "center",
      backgroundColor: "#FFFFFF",
      padding: '10px',
      borderRadius: 3,
      height: '150px',
      marginBottom: 1,
    }}>
      <GraphHeader title={title} />
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        height: 'calc(100% - 50px)',
        marginRight: '-60px',
        flexBasis: 'calc(80% - 20px)',
        padding: '0px 20px 35px 0px',
        gap: 2, // Add gap between graph and details
      }}>
        <GraphChart chartData={chartData} chartOptions={chartOptions} totalRequests={totalRequests} />
        <GraphDetails details={details} colors={data.colors} />
      </Box>
    </Box>
  );
};
 
GraphComponent.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    values: PropTypes.arrayOf(PropTypes.number).isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    hoverColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  details: PropTypes.arrayOf(PropTypes.string).isRequired,
};
 
export default GraphComponent;
 