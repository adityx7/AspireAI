import { Typography } from '@mui/material';

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

function App() {
  return (
    <div>
      <Typography variant="h6">
        AspireAI
      </Typography>
    </div>
  );
}

export default App;
export { reportWebVitals };
