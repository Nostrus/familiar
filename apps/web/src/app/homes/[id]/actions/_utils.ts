export function parseId(value: FormDataEntryValue | null): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('Invalid id');
  }
  return id;
}

export function parseDate(value: FormDataEntryValue | null): string {
  if (typeof value !== 'string' || !value) {
    throw new Error('Invalid date');
  }
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }
  return value;
}
