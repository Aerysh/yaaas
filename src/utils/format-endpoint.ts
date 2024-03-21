export default function formatEndpoint(endpoint: string): string {
  const words = endpoint.replace(/-/g, ' ').split(' ');
  const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return capitalizedWords.join(' ');
}
