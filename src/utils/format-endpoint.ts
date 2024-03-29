export default function formatEndpoint(endpoint: string): string {
  const cleanedEndpoint = endpoint.replace(/[^a-zA-Z0-9 ]/g, ' ');

  const words = cleanedEndpoint.split(' ');

  const capitalizedWords = words.map((word) => {
    if (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
  });

  return capitalizedWords.join(' ');
}
