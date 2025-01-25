export const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

export function formatString(input: string): string {
  return input.toLowerCase().replace(/\s+/g, "-");
}
