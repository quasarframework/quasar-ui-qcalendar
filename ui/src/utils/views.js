export function validateView (view) {
  return [
    'month', 'week', 'day',
    '2day', '3day', '4day', '5day', '6day',
    'custom-interval', 'month-interval',
    'scheduler', 'week-scheduler', 'month-scheduler',
    'day-agenda', '2day-agenda', '3day-agenda',
    '4day-agenda', '5day-agenda', '6day-agenda',
    'week-agenda'].includes(view)
}
