const LOCATION_ICONS: Record<number, string> = {
  1: 'public',
  2: 'blur_circular',
  3: 'map',
  4: 'map',
  5: 'flag',
  6: 'flag',
  7: 'landscape',
  8: 'location_city',
  9: 'home',
  10: 'grid_view',
  11: 'apartment',
  12: 'meeting_room',
  13: 'account_balance',
  14: 'forest',
  15: 'forest',
  16: 'terrain',
  17: 'wb_sunny',
  18: 'beach_access',
  19: 'water',
  20: 'route',
  21: 'foundation',
  22: 'domain_disabled',
  23: 'castle',
  24: 'temple_buddhist',
  25: 'shield',
  99: 'place',
}

/** Иконка Material Icons для типа места (LocationTypeChoices на бэкенде). */
export const getLocationIconName = (locationType: number): string => {
  return LOCATION_ICONS[locationType] ?? 'place'
}
