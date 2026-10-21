// Turns the API's sourcePage ("3", "1-3", "Unknown" or null) into a label.
export function formatSourcePage(sourcePage: string | null | undefined): string | null {
  const value = sourcePage?.trim();

  if (!value || value.toLowerCase() === "unknown") {
    return null;
  }

  return value.includes("-") ? `Pages ${value}` : `Page ${value}`;
}
