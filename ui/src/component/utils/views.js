export function validateView (view) {
  return [
    'month', 'week', 'day',
    '2day', '3day', '4day', '5day', '6day',
    'custom-interval', 'month-interval',
    'scheduler', 'week-scheduler', 'month-scheduler'].includes(view)
}
