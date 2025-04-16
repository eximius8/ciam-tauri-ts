import { useState, useEffect } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  AppBar, 
  Toolbar, 
  Typography, 
  CssBaseline, 
  ThemeProvider, 
  createTheme 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import DevicesIcon from '@mui/icons-material/Devices';
import SettingsIcon from '@mui/icons-material/Settings';
import { invoke } from '@tauri-apps/api/core';

// Импорт компонентов для вкладок
import AllMeasurements from './tabs/AllMeasurements';
import Settings from './tabs/Settings';
/*import FileReader from './tabs/FileReader';
import DeviceReader from './tabs/DeviceReader';
*/
// Создаем тему для приложения
const theme = createTheme({
  palette: {
    primary: {
      main: "#379994",
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Интерфейс для TabPanel
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Компонент панели вкладки
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [value, setValue] = useState(0);
  const [version, setVersion] = useState('');

  useEffect(() => {
    const getversion = async () =>{
      setVersion(await invoke('get_version'));
    };
    getversion();
  }, [])

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Приложение ЦИАМ{version && <>, {version}</>}
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Tabs 
          value={value} 
          onChange={handleChange} 
          variant="fullWidth"
          indicatorColor="secondary"
          textColor="primary"
          aria-label="navigation tabs"
        >
          <Tab icon={<DashboardIcon />} label="Все замеры" />
          <Tab icon={<FolderOpenIcon />} label="Чтение из файлов" />
          <Tab icon={<DevicesIcon />} label="Чтение из приборов" />
          <Tab icon={<SettingsIcon />} label="Настройки" />
        </Tabs>
        
        <TabPanel value={value} index={0}>
         <AllMeasurements />
        </TabPanel>
        <TabPanel value={value} index={1}>
          {/* <FileReader /> */}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {/* <DeviceReader /> */}
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Settings />
        </TabPanel>
      </Box>
    </ThemeProvider>
  );
}

export default App;