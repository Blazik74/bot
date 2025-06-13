import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  height: '100%',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const initialTasks = [
  {
    id: 1,
    name: 'Market Analysis',
    status: 'running',
    progress: 75,
    type: 'analysis',
    description: 'Analyzing market trends and competitor strategies',
  },
  {
    id: 2,
    name: 'Content Generation',
    status: 'completed',
    progress: 100,
    type: 'content',
    description: 'Generating marketing content for social media',
  },
  {
    id: 3,
    name: 'Audience Research',
    status: 'pending',
    progress: 0,
    type: 'research',
    description: 'Researching target audience demographics and behavior',
  },
];

export const AICenterPage = () => {
  const theme = useStore((state) => state.theme);
  const [tasks, setTasks] = useState(initialTasks);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'analysis',
    description: '',
  });

  const handleOpenDialog = (task = null) => {
    if (task) {
      setSelectedTask(task);
      setFormData({
        name: task.name,
        type: task.type,
        description: task.description,
      });
    } else {
      setSelectedTask(null);
      setFormData({
        name: '',
        type: 'analysis',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
    setFormData({
      name: '',
      type: 'analysis',
      description: '',
    });
  };

  const handleSaveTask = () => {
    if (selectedTask) {
      setTasks(
        tasks.map((task) =>
          task.id === selectedTask.id
            ? {
                ...task,
                name: formData.name,
                type: formData.type,
                description: formData.description,
              }
            : task
        )
      );
    } else {
      setTasks([
        ...tasks,
        {
          id: tasks.length + 1,
          name: formData.name,
          status: 'pending',
          progress: 0,
          type: formData.type,
          description: formData.description,
        },
      ]);
    }
    handleCloseDialog();
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleToggleStatus = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === 'running' ? 'paused' : 'running',
            }
          : task
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'success';
      case 'completed':
        return 'primary';
      case 'paused':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'analysis':
        return 'info';
      case 'content':
        return 'success';
      case 'research':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">AI Tasks</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Task
        </Button>
      </Box>

      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} md={6} key={task.id}>
            <StyledCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6">{task.name}</Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(task)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box display="flex" gap={1} mb={2}>
                  <Chip
                    label={task.status}
                    color={getStatusColor(task.status)}
                    size="small"
                  />
                  <Chip
                    label={task.type}
                    color={getTypeColor(task.type)}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" mb={2}>
                  {task.description}
                </Typography>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={task.progress}
                    color={task.status === 'completed' ? 'primary' : 'secondary'}
                  />
                  <Typography variant="body2" color="text.secondary" align="right" mt={0.5}>
                    {task.progress}%
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  color={task.status === 'running' ? 'error' : 'success'}
                  startIcon={task.status === 'running' ? <StopIcon /> : <PlayArrowIcon />}
                  fullWidth
                  onClick={() => handleToggleStatus(task.id)}
                  disabled={task.status === 'completed'}
                >
                  {task.status === 'running' ? 'Stop Task' : 'Start Task'}
                </Button>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedTask ? 'Edit Task' : 'New Task'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Task Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Task Type"
              select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              SelectProps={{
                native: true,
              }}
              sx={{ mb: 2 }}
            >
              <option value="analysis">Analysis</option>
              <option value="content">Content</option>
              <option value="research">Research</option>
            </TextField>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveTask} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}; 