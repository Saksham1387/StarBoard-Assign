export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const calculateRemainingTerm = (expiryDate: string): string => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffMs = expiry.getTime() - today.getTime();
  const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
  );
  return `${years} Years, ${months} Months`;
};

export function extractJsonFromGeminiResponse(text: string): string {
  const jsonPattern = /```json\s*([\s\S]*?)\s*```/;
  const match = text.match(jsonPattern);
  return match ? match[1] : text;
}



