import AnalyticsDashboard from "@/components/shared/AnalyticsDashboard";
import { getEventAnalytics } from "@/lib/actions/eventAnalytics.actions";

const AnalyticsPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const analytics = await getEventAnalytics(id);

  return (
    
      <div>
      <AnalyticsDashboard analytics={analytics} />
      </div>
  
  );
};

export default AnalyticsPage;

