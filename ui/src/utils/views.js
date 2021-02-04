export function validateView (view) {
  return [
    'month', 'week', 'day',
    '2day', '3day', '4day', '5day', '6day',
    'month-scheduler', 'week-scheduler', 'custom-scheduler',
    'scheduler', 'day-scheduler', '2day-scheduler', '3day-scheduler',
    '4day-scheduler', '5day-scheduler', '6day-scheduler',
    'resource', 'day-resource',
    'month-agenda', 'week-agenda', 'custom-agenda',
    'agenda', 'day-agenda', '2day-agenda', '3day-agenda',
    '4day-agenda', '5day-agenda', '6day-agenda',
    'month-interval', 'custom-interval' ].includes(view)
}
