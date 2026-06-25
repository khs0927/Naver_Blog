export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

export function parseOptionalDate(input?: string) {
  return input ? new Date(input) : undefined;
}
