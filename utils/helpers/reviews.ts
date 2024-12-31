import { ProductReview, ServiceReview } from '@prisma/client'

type ProductRatingMetrics = {
  meetUp: number;
  location: number;
  experience: number;
  communication: number;
  packaging: number;
  value: number;
  overall: number;
  ratingCount: Record<number, number>;
}

type ServiceRatingMetrics = {
  cleanliness: number;
  accuracy: number;
  checkIn: number;
  communication: number;
  location: number;
  value: number;
  overall: number;
  ratingCount: Record<number, number>;
}

export function calculateProductReviewMetrics(reviews: ProductReview[]): ProductRatingMetrics | null {
  if (!reviews.length) return null;

  // Initialize counters for each metric
  const metrics = {
    meetUp: { sum: 0, count: 0 },
    location: { sum: 0, count: 0 },
    experience: { sum: 0, count: 0 },
    communication: { sum: 0, count: 0 },
    packaging: { sum: 0, count: 0 },
    value: { sum: 0, count: 0 }
  };

  // Initialize rating count distribution
  const ratingCount: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  };

  // Sum up all valid ratings
  reviews.forEach(review => {
    Object.keys(metrics).forEach(key => {
      const value = review[key as keyof typeof metrics];
      if (typeof value === 'number') {
        metrics[key as keyof typeof metrics].sum += value;
        metrics[key as keyof typeof metrics].count++;
      }
    });
  });

  // Calculate averages for each metric
  const result = Object.entries(metrics).reduce((acc, [key, { sum, count }]) => ({
    ...acc,
    [key]: count > 0 ? Number((sum / count).toFixed(1)) : 0
  }), {} as Record<string, number>);

  // Calculate overall average and update rating distribution
  const totalSum = Object.values(result).reduce((sum, val) => sum + val, 0);
  const validMetricsCount = Object.values(result).filter(val => val > 0).length;
  const overall = Number((totalSum / (validMetricsCount || 1)).toFixed(1));

  // Count the ratings distribution based on all numeric fields
  reviews.forEach(review => {
    const reviewValues = Object.entries(metrics).map(([key]) => review[key as keyof typeof metrics]);
    const validValues = reviewValues.filter((val): val is number => typeof val === 'number');
    if (validValues.length > 0) {
      const averageRating = Math.round(
        validValues.reduce((sum, val) => sum + val, 0) / validValues.length
      );
      ratingCount[averageRating] = (ratingCount[averageRating] || 0) + 1;
    }
  });

  return {
    ...result,
    overall,
    ratingCount
  } as ProductRatingMetrics;
}

export function calculateServiceReviewMetrics(reviews: ServiceReview[]): ServiceRatingMetrics | null {
  if (!reviews.length) return null;

  // Initialize counters for each metric
  const metrics = {
    cleanliness: { sum: 0, count: 0 },
    accuracy: { sum: 0, count: 0 },
    checkIn: { sum: 0, count: 0 },
    communication: { sum: 0, count: 0 },
    location: { sum: 0, count: 0 },
    value: { sum: 0, count: 0 }
  };

  // Initialize rating count distribution
  const ratingCount: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  };

  // Sum up all valid ratings
  reviews.forEach(review => {
    Object.keys(metrics).forEach(key => {
      const value = review[key as keyof typeof metrics];
      if (typeof value === 'number') {
        metrics[key as keyof typeof metrics].sum += value;
        metrics[key as keyof typeof metrics].count++;
      }
    });
  });

  // Calculate averages for each metric
  const result = Object.entries(metrics).reduce((acc, [key, { sum, count }]) => ({
    ...acc,
    [key]: count > 0 ? Number((sum / count).toFixed(1)) : 0
  }), {} as Record<string, number>);

  // Calculate overall average and update rating distribution
  const totalSum = Object.values(result).reduce((sum, val) => sum + val, 0);
  const validMetricsCount = Object.values(result).filter(val => val > 0).length;
  const overall = Number((totalSum / (validMetricsCount || 1)).toFixed(1));

  // Count the ratings distribution based on all numeric fields
  reviews.forEach(review => {
    const reviewValues = Object.entries(metrics).map(([key]) => review[key as keyof typeof metrics]);
    const validValues = reviewValues.filter((val): val is number => typeof val === 'number');
    if (validValues.length > 0) {
      const averageRating = Math.round(
        validValues.reduce((sum, val) => sum + val, 0) / validValues.length
      );
      ratingCount[averageRating] = (ratingCount[averageRating] || 0) + 1;
    }
  });

  return {
    ...result,
    overall,
    ratingCount
  } as ServiceRatingMetrics;
}