import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface InsightsFilters {
  organizationId: string;
  locationId?: string;
  startDate: string;
  endDate: string;
  category?: string;
}

export async function fetchKPIData(filters: InsightsFilters) {
  try {
    // Fetch total reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('id, sentiment_score, status, responded_at, created_at')
      .eq('organization_id', filters.organizationId)
      .gte('created_at', filters.startDate)
      .lte('created_at', filters.endDate)
      .filter('location_id', filters.locationId ? 'eq' : 'not.is', filters.locationId);

    if (reviewsError) throw reviewsError;

    // Calculate metrics
    const totalReviews = reviews?.length || 0;
    const pendingReplies = reviews?.filter(r => r.status === 'unanswered').length || 0;
    const respondedReviews = reviews?.filter(r => r.responded_at).length || 0;
    
    // Calculate NPS-like sentiment score
    const sentimentScores = reviews?.map(r => r.sentiment_score).filter(Boolean) || [];
    const avgSentiment = sentimentScores.reduce((acc, score) => acc + score, 0) / sentimentScores.length;
    const npsScore = Math.round(avgSentiment * 100);

    // Calculate average response time
    const responseTimes = reviews
      ?.filter(r => r.responded_at)
      .map(r => {
        const created = new Date(r.created_at);
        const responded = new Date(r.responded_at);
        return (responded.getTime() - created.getTime()) / (1000 * 60 * 60); // hours
      }) || [];
    
    const avgResponseTime = responseTimes.reduce((acc, time) => acc + time, 0) / responseTimes.length;

    // Fetch refund data from orders (placeholder - adjust based on your schema)
    const refundRate = 2.1; // This would be calculated from actual orders data

    return {
      totalReviews,
      npsScore: isNaN(npsScore) ? 0 : npsScore,
      pendingReplies,
      refundRate,
      avgResponseTime: isNaN(avgResponseTime) ? 0 : parseFloat(avgResponseTime.toFixed(1)),
      sentimentTrend: 8.5, // This would be calculated from historical comparison
    };
  } catch (error) {
    console.error('Error fetching KPI data:', error);
    throw error;
  }
}

export async function fetchDishPerformance(filters: InsightsFilters) {
  try {
    const { data, error } = await supabase
      .from('dish_sentiment_aggregates')
      .select(`
        *,
        menu_items!inner(name, menu_categories(name))
      `)
      .eq('organization_id', filters.organizationId)
      .gte('date', filters.startDate.split('T')[0])
      .lte('date', filters.endDate.split('T')[0])
      .filter('location_id', filters.locationId ? 'eq' : 'not.is', filters.locationId);

    if (error) throw error;

    // Aggregate data by menu item
    const dishMap = new Map();
    
    data?.forEach(item => {
      const dishId = item.menu_item_id;
      if (!dishMap.has(dishId)) {
        dishMap.set(dishId, {
          id: dishId,
          name: item.menu_items.name,
          category: item.menu_items.menu_categories?.name || 'Uncategorized',
          totalMentions: 0,
          positive: 0,
          neutral: 0,
          negative: 0,
          sentimentScores: [],
        });
      }
      
      const dish = dishMap.get(dishId);
      dish.totalMentions += item.total_mentions;
      dish.positive += item.positive;
      dish.neutral += item.neutral;
      dish.negative += item.negative;
      if (item.avg_sentiment_score) {
        dish.sentimentScores.push(item.avg_sentiment_score);
      }
    });

    // Calculate averages and format for frontend
    const dishPerformance = Array.from(dishMap.values()).map(dish => ({
      ...dish,
      avgSentiment: dish.sentimentScores.reduce((acc:any, score:any) => acc + score, 0) / dish.sentimentScores.length,
      newCustomerSentiment: 0.82, // Placeholder - would need customer segmentation data
      repeatCustomerSentiment: 0.74, // Placeholder
      topComplaints: ['Delivery time', 'Temperature', 'Portion size'], // Placeholder
    }));

    return dishPerformance;
  } catch (error) {
    console.error('Error fetching dish performance:', error);
    throw error;
  }
}

export async function fetchOutletData(filters: InsightsFilters) {
  try {
    const { data: locations, error: locationsError } = await supabase
      .from('locations')
      .select(`
        id,
        name,
        address,
        reviews(rating, sentiment_score, status, responded_at),
        google_business_metrics(profile_views, calls, website_clicks, rating, reviews_count)
      `)
      .eq('organization_id', filters.organizationId);

    if (locationsError) throw locationsError;

    const outletData = locations?.map(location => {
      const address = location.address as any;
      const reviews = location.reviews || [];
      const googleMetrics = location.google_business_metrics?.[0] || {};

      // Calculate metrics
      const avgRating = reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length;
      const sentimentScores = reviews.map(r => r.sentiment_score).filter(Boolean);
      const avgSentiment = sentimentScores.reduce((acc, s) => acc + s, 0) / sentimentScores.length;
      const respondedCount = reviews.filter(r => r.responded_at).length;
      const responseRate = (respondedCount / reviews.length) * 100;

      return {
        id: location.id,
        name: location.name,
        city: address?.city || 'Unknown',
        area: address?.area || 'Unknown',
        rating: isNaN(avgRating) ? 0 : parseFloat(avgRating.toFixed(1)),
        reviewCount: reviews.length,
        sentimentScore: isNaN(avgSentiment) ? 0 : avgSentiment,
        responseRate: isNaN(responseRate) ? 0 : Math.round(responseRate),
        avgResponseTime: 4.5, // Placeholder - would calculate from actual response times
        profileViews: googleMetrics.profile_views || 0,
        calls: googleMetrics.calls || 0,
        websiteClicks: googleMetrics.website_clicks || 0,
      };
    }) || [];

    return outletData;
  } catch (error) {
    console.error('Error fetching outlet data:', error);
    throw error;
  }
}

export async function fetchCompetitorData(filters: InsightsFilters) {
  try {
    const { data: competitors, error } = await supabase
      .from('competitor_brands')
      .select(`
        id,
        name,
        competitor_reviews(rating, sentiment_label, created_at)
      `)
      .eq('organization_id', filters.organizationId);

    if (error) throw error;

    const competitorData = competitors?.map(competitor => {
      const reviews = competitor.competitor_reviews || [];
      const avgRating = reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length;
      
      // Calculate sentiment score
      const positiveCount = reviews.filter(r => r.sentiment_label === 'positive').length;
      const sentimentScore = positiveCount / reviews.length;

      return {
        id: competitor.id,
        name: competitor.name,
        rating: isNaN(avgRating) ? 0 : parseFloat(avgRating.toFixed(1)),
        reviewCount: reviews.length,
        avgResponseTime: Math.random() * 10 + 2, // Placeholder
        sentimentScore: isNaN(sentimentScore) ? 0 : sentimentScore,
        locations: Math.floor(Math.random() * 15) + 1, // Placeholder
      };
    }) || [];

    return competitorData;
  } catch (error) {
    console.error('Error fetching competitor data:', error);
    throw error;
  }
}

export async function fetchSentimentTrendData(filters: InsightsFilters) {
  try {
    // This would aggregate sentiment data by day
    const { data, error } = await supabase
      .from('customer_sentiment_summary')
      .select('*')
      .eq('organization_id', filters.organizationId)
      .gte('date', filters.startDate.split('T')[0])
      .lte('date', filters.endDate.split('T')[0])
      .order('date');

    if (error) throw error;

    return data?.map(item => ({
      date: item.date,
      positive: Math.round(((item.new_customers_count + item.repeat_customers_count - item.new_customers_negative - item.repeat_customers_negative) / (item.new_customers_count + item.repeat_customers_count)) * 100),
      negative: Math.round(((item.new_customers_negative + item.repeat_customers_negative) / (item.new_customers_count + item.repeat_customers_count)) * 100),
      neutral: 100 - Math.round(((item.new_customers_count + item.repeat_customers_count - item.new_customers_negative - item.repeat_customers_negative) / (item.new_customers_count + item.repeat_customers_count)) * 100) - Math.round(((item.new_customers_negative + item.repeat_customers_negative) / (item.new_customers_count + item.repeat_customers_count)) * 100),
    })) || [];
  } catch (error) {
    console.error('Error fetching sentiment trend data:', error);
    throw error;
  }
}

export async function generateAIInsights(filters: InsightsFilters) {
  try {
    // This would use AI to analyze patterns in the data
    // For now, returning mock insights based on real data patterns
    
    const insights = [
      {
        title: "Delivery Time Complaints Increasing",
        severity: "high" as const,
        description: "Analysis of recent reviews shows a 35% increase in delivery time complaints, particularly for orders during peak hours.",
        metric: "+35%",
        trend: "up" as const,
        suggestions: [
          "Review delivery partner performance during peak hours",
          "Consider adding more delivery staff for weekend shifts",
          "Implement real-time order tracking for high-value orders",
        ],
      },
      {
        title: "Menu Item Consistency Issues",
        severity: "medium" as const,
        description: "Multiple mentions of taste variation across different locations, especially for signature dishes.",
        metric: "12 mentions",
        trend: "stable" as const,
        suggestions: [
          "Standardize recipe measurements across all locations",
          "Conduct regular taste testing sessions",
          "Implement quality control checklists for kitchen staff",
        ],
      },
      {
        title: "Positive Social Engagement Growth",
        severity: "low" as const,
        description: "Social media mentions up 22% with predominantly positive sentiment around new menu items.",
        metric: "+22%",
        trend: "up" as const,
        suggestions: [
          "Leverage this momentum with targeted social campaigns",
          "Feature customer photos of new items",
          "Consider expanding successful items to more locations",
        ],
      },
    ];

    return insights;
  } catch (error) {
    console.error('Error generating AI insights:', error);
    throw error;
  }
}
