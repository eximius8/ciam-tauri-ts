import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  AlertTitle,
  Snackbar,
  Grid,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { open } from '@tauri-apps/api/dialog';
import { readTextFile } from '@tauri-apps/api/fs';

interface FileData {
  id: number;
  name: string;
  path: string;
  processed: boolean;
  dataCount?: number;
}

export default function FileReader() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'info' | 'warning' | 'error'
  });

  // Обработчик выбора файла
  const handleFileSelect = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'Data files',
          extensions: ['csv', 'txt', 'dat', 'json', 'xlsx']
        }]
      });
      
      if (selected && !Array.isArray(selected)) {
        setFilePath(selected);
      }
    } catch (error) {
      console.error('Error selecting file:', error);
      showNotification('Ошибка при выборе файла', 'error');
    }
  };

  // Обработчик загрузки файла
  const handleFileUpload = async () => {
    if (!filePath) {
      showNotification('Выберите файл', 'warning');
      return;
    }

    setLoading(true);
    try {
      const fileNameParts = filePath.split(/[\/\\]/);
      const fileName = fileNameParts[fileNameParts.length - 1];
      
      // Для демонстрации - чтение файла
      const fileContent = await readTextFile(filePath);
      console.log('File content:', fileContent.substring(0, 100) + '...');
      
      // Добавление файла в список
      const newFile: FileData = {
        id: Date.now(),
        name: fileName,
        path: filePath,
        processed: true,
        dataCount: Math.floor(Math.random() * 100) + 1 // Случайное количество данных для демонстрации
      };
      
      setFiles(prevFiles => [...prevFiles, newFile]);
      setFilePath('');
      showNotification(`Файл "${fileName}" успешно обработан`, 'success');
    } catch (error) {
      console.error('Error reading file:', error);
      showNotification('Ошибка при обработке файла', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Удаление файла из списка
  const handleRemoveFile = (id: number) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== id));
    showNotification('Файл удален из списка', 'info');
  };

  // Показать уведомление
  const showNotification = (message: string, severity: 'success' | 'info' | 'warning' | 'error') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Закрыть уведомление
  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Чтение из файлов
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Загрузить новый файл
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Путь к файлу"
              variant="outlined"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              disabled={loading}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<UploadFileIcon />}
              onClick={handleFileSelect}
              disabled={loading}
            >
              Выбрать файл
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleFileUpload}
              disabled={!filePath || loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Загрузка...' : 'Загрузить'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {files.length > 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Обработанные файлы
          </Typography>
          
          <List>
            {files.map((file, index) => (
              <Box key={file.id}>
                {index > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <Button
                      edge="end"
                      color="error"
                      onClick={() => handleRemoveFile(file.id)}
                      startIcon={<DeleteIcon />}
                    >
                      Удалить
                    </Button>
                  }
                >
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={
                      <>
                        {`Путь: ${file.path}`}
                        <br />
                        {file.dataCount && `Количество измерений: ${file.dataCount}`}
                      </>
                    }
                  />
                </ListItem>
              </Box>
            ))}
          </List>
          
          <Box sx={{ mt: 2 }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Общая статистика
                </Typography>
                <Typography variant="body1">
                  Всего файлов: {files.length}
                </Typography>
                <Typography variant="body1">
                  Общее количество измерений: {files.reduce((sum, file) => sum + (file.dataCount || 0), 0)}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Paper>
      ) : (
        <Alert severity="info">
          <AlertTitle>Нет загруженных файлов</AlertTitle>
          Выберите и загрузите файл для обработки данных.
        </Alert>
      )}
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}