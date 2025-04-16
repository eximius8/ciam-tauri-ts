import React, { useState, ChangeEvent } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  TextField,
  Container,
  Divider,
  Snackbar,
  Alert,
  AlertColor,
  Stack
} from '@mui/material';
import {
  DeleteForever as DeleteIcon,
  Sync as SyncIcon,
  Check as CheckIcon
} from '@mui/icons-material';

// Define types for our state objects
interface DatabaseStats {
  measurements: number;
  wells: number;
  workshops: number;
  ngdu: number;
}

interface SyncCredentials {
  login: string;
  password: string;
  uri: string;
}

interface AlertState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

const Settings: React.FC = () => {
  // State with TypeScript interfaces
  const [dbStats, setDbStats] = useState<DatabaseStats>({
    measurements: 15342,
    wells: 278,
    workshops: 45,
    ngdu: 8 // НГДУ (Oil and Gas Production Departments)
  });

  const [syncCredentials, setSyncCredentials] = useState<SyncCredentials>({
    login: '',
    password: '',
    uri: ''
  });

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setSyncCredentials({
      ...syncCredentials,
      [name]: value
    });
  };

  const handleCloseAlert = (): void => {
    setAlertState({
      ...alertState,
      open: false
    });
  };

  const handleClearDatabase = (): void => {
    // In a real app, this would make an API call to clear the database
    setAlertState({
      open: true,
      message: 'База данных очищена!',
      severity: 'success'
    });
    
    // Simulate database clearing
    setDbStats({
      measurements: 0,
      wells: 0,
      workshops: 0,
      ngdu: 0
    });
  };

  const handleSyncDatabase = (): void => {
    // In a real app, this would make an API call to sync with remote service
    setAlertState({
      open: true,
      message: 'Синхронизация с удаленным сервисом выполнена успешно!',
      severity: 'success'
    });
    
    // Simulate new data after sync
    setDbStats({
      measurements: 17652,
      wells: 312,
      workshops: 48,
      ngdu: 9
    });
  };

  const handleTestConnection = (): void => {
    // In a real app, this would test the connection to the remote service
    if (!syncCredentials.login || !syncCredentials.password || !syncCredentials.uri) {
      setAlertState({
        open: true,
        message: 'Пожалуйста, заполните все поля!',
        severity: 'error'
      });
      return;
    }
    
    setAlertState({
      open: true,
      message: 'Соединение с удаленным сервисом установлено успешно!',
      severity: 'success'
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Database Statistics Section */}
        <Typography variant="h5" gutterBottom sx={{ mt: 3, mb: 3 }}>
          Информация о базе данных
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3, 
          mb: 4,
          '& > *': { 
            flex: '1 1 200px',
            minWidth: '200px' 
          }
        }}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h3" component="div" color="primary">
                {dbStats.measurements}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Замеров
              </Typography>
            </CardContent>
          </Card>
          
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h3" component="div" color="primary">
                {dbStats.wells}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Скважин
              </Typography>
            </CardContent>
          </Card>
          
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h3" component="div" color="primary">
                {dbStats.workshops}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Цехов
              </Typography>
            </CardContent>
          </Card>
          
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h3" component="div" color="primary">
                {dbStats.ngdu}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                НГДУ
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Database Actions Section */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3,
          '& > *': { 
            flex: '1 1 300px',
            minWidth: '300px' 
          }
        }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Управление данными
            </Typography>
            
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                color="error" 
                startIcon={<DeleteIcon />}
                onClick={handleClearDatabase}
                fullWidth
              >
                Очистить БД
              </Button>
              
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<SyncIcon />}
                onClick={handleSyncDatabase}
                fullWidth
              >
                Синхронизировать БД
              </Button>
            </Box>
          </Paper>
          
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Настройки синхронизации
            </Typography>
            
            <Box component="form" sx={{ mt: 2 }}>
              <Stack spacing={2}>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 2,
                  '& > *': { 
                    flex: '1 1 200px'
                  }
                }}>
                  <TextField
                    name="login"
                    label="Логин"
                    variant="outlined"
                    fullWidth
                    value={syncCredentials.login}
                    onChange={handleInputChange}
                  />
                  
                  <TextField
                    name="password"
                    label="Пароль"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={syncCredentials.password}
                    onChange={handleInputChange}
                  />
                </Box>
                
                <TextField
                  name="uri"
                  label="URI адрес удаленного сервиса"
                  variant="outlined"
                  fullWidth
                  value={syncCredentials.uri}
                  onChange={handleInputChange}
                />
                
                <Box sx={{ mt: 1 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<CheckIcon />}
                    onClick={handleTestConnection}
                  >
                    Проверить соединение
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Container>

      {/* Notifications */}
      <Snackbar 
        open={alertState.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alertState.severity} 
          sx={{ width: '100%' }}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;