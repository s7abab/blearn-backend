import AnalyticsRepository from "../repositories/analytics.repository";

class AnalyticsUsecase {
  private analyticsRepository: AnalyticsRepository;
  constructor(analyticsRepository: AnalyticsRepository) {
    this.analyticsRepository = analyticsRepository;
  }

  public async getCourseRevenue(courseId: string) {
    try {
      const revenue =
        await this.analyticsRepository.FindCourseRevenueByTimePeriod(courseId);

      return revenue;
    } catch (error) {
      throw error;
    }
  }
}

export default AnalyticsUsecase;
