// app/(root)/events/[id]/analytics/page.tsx

import AnalyticsDashboard from "@/components/shared/AnalyticsDashboard";
import { getEventAnalytics } from "@/lib/actions/eventAnalytics.actions";

// Fix: params is a Promise in Next.js 15+
const AnalyticsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  
  // 1. Fetch raw data from the server action
  const rawAnalytics = await getEventAnalytics(id);

  // 2. Sanitize/Convert the data to match the Component's strict types
  const analytics = {
    ...rawAnalytics,
    // Safely convert "10%" (string) -> 10 (number)
    conversionRate: typeof rawAnalytics.conversionRate === 'string'
      ? parseFloat(rawAnalytics.conversionRate.replace('%', '')) || 0
      : Number(rawAnalytics.conversionRate) || 0,
  };

  return (
    <div>
      <AnalyticsDashboard analytics={analytics} />
    </div>
  );
};

export default AnalyticsPage;