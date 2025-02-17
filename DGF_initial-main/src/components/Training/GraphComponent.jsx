import { Box, Typography } from "@mui/material";
 
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import PropTypes from 'prop-types';
// import '../Training/GraphComponent.css';  // Import the CSS file
 
ChartJS.register(ArcElement, Tooltip, Legend);
 
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
    cutout: '85%', // Adjust the cutout percentage to reduce the donut circumference
    plugins: {
      legend: {
        display: false, // Disable the legend
      },
    },
    maintainAspectRatio: false, // Ensure the chart resizes correctly
  };
 
  return (
    <Box
      sx={{
        textAlign: "center",
        backgroundColor: "#ebebf8fa",  // Apply the background color here
        padding: 2,
        marginLeft: 0,
        borderRadius: 2,
        boxShadow: 3,
        height: '160px', // Reduce the height of the box
        width:'96%'
      }}
    >
      <Typography
        variant="h5"  // Increase the size of the header
        sx={{ mb: 1, fontWeight: 'bold', textAlign: 'left', whiteSpace: 'normal' }}  // Reduce margin-bottom to 1
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: 'flex', // Use flexbox layout
          alignItems: 'center', // Center items vertically
          height: 'calc(100% - 48px)', // Adjust height to account for padding and title
        }}
      >
        <Box sx={{ width: '30%', height: '100%', position: 'relative' }}> {/* Adjust width and height */}
          <Doughnut data={chartData} options={chartOptions} />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',  
              left: '50%',  
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <Typography className="numbers"
              variant="h6"  
              component="div"
             sx={{
                fontSize: '1.4rem !important',  // Increased font size
                fontWeight: 'bold',
                color: 'black',
             }}
            >
              {totalRequests}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#555555',
                fontSize: '2rem',  // Optional: Reduce "Requests" text size
              }}
            >
              Requests
            </Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'left', display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginLeft: 2 }}> {/* Allow wrapping */}
          {details.map((detail, index) => {
            const [label, value] = detail.split(': ');
            return (
              <Typography
                key={index}
                variant="body1"
                sx={{ display: 'inline-flex', marginRight: 3, marginBottom: 1, whiteSpace: 'normal' }}
                dangerouslySetInnerHTML={{ __html: `<span style="font-weight: bold; font-size: 1.5rem; color: ${data.colors[index]}">${value}</span><span style="margin-left: 5px; color: #555555; font-size: 0.7rem;">${label}</span>` }} // Highlighted change
              />
            );
          })}
        </Box>
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