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

  // total revenue of instructor
  public async getTotalRevenueOfInstructor(instructorId: string) {
    try {
      const totalRevenue =
        await this.analyticsRepository.findTotalRevenueOfInstructor(
          instructorId
        );
      return totalRevenue;
    } catch (error) {
      throw error;
    }
  }

  // total revenue of admin
  public async getTotalRevenueOfAdmin() {
    try {
      const totalRevenue =
        await this.analyticsRepository.findTotalRevenueOfAdmin();
      return totalRevenue;
    } catch (error) {
      throw error;
    }
  }
}

export default AnalyticsUsecase;
