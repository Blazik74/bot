export const TASK_TYPES = {
  ANALYSIS: 'analysis',
  CONTENT: 'content',
  RESEARCH: 'research',
};

export const TASK_STATUSES = {
  RUNNING: 'running',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  PENDING: 'pending',
};

export const TASK_TYPE_COLORS = {
  [TASK_TYPES.ANALYSIS]: 'info',
  [TASK_TYPES.CONTENT]: 'success',
  [TASK_TYPES.RESEARCH]: 'warning',
};

export const TASK_STATUS_COLORS = {
  [TASK_STATUSES.RUNNING]: 'success',
  [TASK_STATUSES.COMPLETED]: 'primary',
  [TASK_STATUSES.PAUSED]: 'warning',
  [TASK_STATUSES.PENDING]: 'default',
}; 