import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Checkbox,
  TextField,
  InputAdornment,
  IconButton,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

// Интерфейс для данных измерений
interface Measurement {
  id: number;
  type: string;
  date: string;
  source: string;
  ngdu: string;
  workshop: string;
  well: string;
  executor: string;
  operator: string;
}

// Тестовые данные для примера
const demoData: Measurement[] = [
  { id: 1, type: 'Давление', date: '2025-04-10', source: 'Прибор', ngdu: 'НГДУ-1', workshop: 'Цех-2', well: 'Скв-123', executor: 'Иванов И.И.', operator: 'Петров П.П.' },
  { id: 2, type: 'Температура', date: '2025-04-10', source: 'Файл', ngdu: 'НГДУ-1', workshop: 'Цех-3', well: 'Скв-456', executor: 'Сидоров С.С.', operator: 'Кузнецов К.К.' },
  { id: 3, type: 'Расход', date: '2025-04-11', source: 'Прибор', ngdu: 'НГДУ-2', workshop: 'Цех-1', well: 'Скв-789', executor: 'Николаев Н.Н.', operator: 'Смирнов С.С.' },
  { id: 4, type: 'Уровень', date: '2025-04-12', source: 'Файл', ngdu: 'НГДУ-2', workshop: 'Цех-4', well: 'Скв-101', executor: 'Иванов И.И.', operator: 'Федоров Ф.Ф.' },
  { id: 5, type: 'Давление', date: '2025-04-13', source: 'Прибор', ngdu: 'НГДУ-3', workshop: 'Цех-2', well: 'Скв-112', executor: 'Сидоров С.С.', operator: 'Козлов К.К.' },
  { id: 6, type: 'Температура', date: '2025-04-14', source: 'Файл', ngdu: 'НГДУ-3', workshop: 'Цех-1', well: 'Скв-115', executor: 'Петров П.П.', operator: 'Новиков Н.Н.' },
  { id: 7, type: 'Расход', date: '2025-04-15', source: 'Прибор', ngdu: 'НГДУ-1', workshop: 'Цех-3', well: 'Скв-118', executor: 'Федоров Ф.Ф.', operator: 'Иванов И.И.' },
  { id: 8, type: 'Уровень', date: '2025-04-16', source: 'Файл', ngdu: 'НГДУ-2', workshop: 'Цех-2', well: 'Скв-121', executor: 'Кузнецов К.К.', operator: 'Сидоров С.С.' },
  { id: 9, type: 'Давление', date: '2025-04-17', source: 'Прибор', ngdu: 'НГДУ-3', workshop: 'Цех-4', well: 'Скв-124', executor: 'Смирнов С.С.', operator: 'Петров П.П.' },
  { id: 10, type: 'Температура', date: '2025-04-18', source: 'Файл', ngdu: 'НГДУ-1', workshop: 'Цех-1', well: 'Скв-127', executor: 'Николаев Н.Н.', operator: 'Федоров Ф.Ф.' },
  { id: 11, type: 'Расход', date: '2025-04-19', source: 'Прибор', ngdu: 'НГДУ-2', workshop: 'Цех-3', well: 'Скв-130', executor: 'Козлов К.К.', operator: 'Смирнов С.С.' },
  { id: 12, type: 'Уровень', date: '2025-04-20', source: 'Файл', ngdu: 'НГДУ-3', workshop: 'Цех-2', well: 'Скв-133', executor: 'Новиков Н.Н.', operator: 'Кузнецов К.К.' },
];

export default function AllMeasurements() {
  const [measurements] = useState<Measurement[]>(demoData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Обработчики пагинации
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Обработчики выбора строк
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = measurements.map(n => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else if (selectedIndex === 0) {
      newSelected = selected.slice(1);
    } else if (selectedIndex === selected.length - 1) {
      newSelected = selected.slice(0, -1);
    } else if (selectedIndex > 0) {
      newSelected = [
        ...selected.slice(0, selectedIndex),
        ...selected.slice(selectedIndex + 1),
      ];
    }

    setSelected(newSelected);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  // Обработчик поиска
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Фильтрация данных по поисковому запросу
  const filteredData = measurements.filter((measurement) => {
    if (searchQuery === '') return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      measurement.type.toLowerCase().includes(searchLower) ||
      measurement.date.includes(searchLower) ||
      measurement.source.toLowerCase().includes(searchLower) ||
      measurement.ngdu.toLowerCase().includes(searchLower) ||
      measurement.workshop.toLowerCase().includes(searchLower) ||
      measurement.well.toLowerCase().includes(searchLower) ||
      measurement.executor.toLowerCase().includes(searchLower) ||
      measurement.operator.toLowerCase().includes(searchLower)
    );
  });

  // Отображаемые данные с учетом пагинации
  const visibleRows = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Все замеры
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        {/* Левая колонка с таблицей (50% ширины) */}
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            {/* Поиск */}
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                placeholder="Поиск по всем полям..."
                value={searchQuery}
                onChange={handleSearchChange}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        aria-label="clear search"
                        onClick={handleClearSearch}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />
            </Box>
            
            <Divider />
            
            {/* Таблица */}
            <TableContainer sx={{ maxHeight: 'calc(100vh - 280px)' }}>
              <Table 
                stickyHeader 
                aria-label="table of measurements" 
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selected.length > 0 && selected.length < measurements.length}
                        checked={measurements.length > 0 && selected.length === measurements.length}
                        onChange={handleSelectAllClick}
                        inputProps={{ 'aria-label': 'select all measurements' }}
                      />
                    </TableCell>
                    <TableCell>Тип</TableCell>
                    <TableCell>Дата</TableCell>
                    <TableCell>Источник</TableCell>
                    <TableCell>НГДУ</TableCell>
                    <TableCell>Цех</TableCell>
                    <TableCell>Скважина</TableCell>
                    <TableCell>Исполнитель</TableCell>
                    <TableCell>Оператор</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleRows.map((row) => {
                    const isItemSelected = isSelected(row.id);
                    
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${row.id}` }}
                          />
                        </TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.source}</TableCell>
                        <TableCell>{row.ngdu}</TableCell>
                        <TableCell>{row.workshop}</TableCell>
                        <TableCell>{row.well}</TableCell>
                        <TableCell>{row.executor}</TableCell>
                        <TableCell>{row.operator}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Пагинация */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Строк на странице:"
              labelDisplayedRows={({ from, to, count }) => 
                `${from}–${to} из ${count !== -1 ? count : `более чем ${to}`}`
              }
            />
          </Paper>
        </Box>
        
        {/* Правая колонка - детали замера (будет реализована позже) */}
        <Box sx={{ width: { xs: '100%', md: '50%' } }}>
          {selected.length > 0 ? (
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Информация о выбранных замерах
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Выбрано замеров: {selected.length}
              </Typography>
              {/* Здесь будет компонент с деталями о выбранных замерах */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Детальная информация о замерах будет реализована позже.
                </Typography>
              </Box>
            </Paper>
          ) : (
            <Paper sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Выберите замер для просмотра подробной информации
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
}