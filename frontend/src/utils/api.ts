export const apiUrl = import.meta.env.VITE_API_URL;

export async function fetchData(endpoint: string) {
  const response = await fetch(`${apiUrl}${endpoint}`);
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
}
