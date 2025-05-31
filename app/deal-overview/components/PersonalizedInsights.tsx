interface PersonalizedInsightsProps {
  insights?: string[];
}

const isValidValue = (value: any): boolean => {
  return (
    value !== "N/A" &&
    value !== "NA" &&
    value !== null &&
    value !== undefined &&
    value !== ""
  );
};

export function PersonalizedInsights({ insights }: PersonalizedInsightsProps) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-3">
        Personalized Insights
      </h3>
      <ul className="list-disc pl-5 text-sm space-y-2">
        {insights?.map(
          (insight, index) =>
            isValidValue(insight) && <li key={index}>{insight}</li>
        )}
      </ul>
    </div>
  );
} 