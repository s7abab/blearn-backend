import orderModel from "../frameworks/models/order.model";
import userModel from "../frameworks/models/user.model";

class OrderRepository {
  constructor() {}

  public async FindCourseRevenueByTimePeriod(
    courseId: string
  ): Promise<number[]> {
    try {
      const currentDate = new Date();
      let revenueForMonths: number[] = [];

      for (let i = 0; i < 12; i++) {
        const startDate = new Date(currentDate.getFullYear(), i, 1, 0, 0, 0);
        const endDate = new Date(
          currentDate.getFullYear(),
          i + 1,
          0,
          23,
          59,
          59
        );

        const result = await orderModel.aggregate([
          {
            $match: {
              courseId: courseId,
              createdAt: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$price" },
            },
          },
        ]);

        const monthRevenue = result.length > 0 ? result[0].totalRevenue : 0;
        revenueForMonths.push(monthRevenue);
      }

      // Decreasing revenue by 20%
      const decreasedRevenue = revenueForMonths.map((revenue) => revenue * 0.8);

      return decreasedRevenue;
    } catch (error) {
      throw error;
    }
  }

  public async findTotalRevenueOfInstructor(instructorId: string) {
    try {
      const currentDate = new Date();
      let revenueForMonths: number[] = [];

      for (let i = 0; i < 12; i++) {
        const startDate = new Date(currentDate.getFullYear(), i, 1, 0, 0, 0);
        const endDate = new Date(
          currentDate.getFullYear(),
          i + 1,
          0,
          23,
          59,
          59
        );

        const result = await orderModel.aggregate([
          {
            $match: {
              instructorId,
              createdAt: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$price" },
            },
          },
        ]);

        const monthRevenue = result.length > 0 ? result[0].totalRevenue : 0;
        revenueForMonths.push(monthRevenue);
      }

      // Decreasing revenue by 20%
      const decreasedRevenue = revenueForMonths.map((revenue) => revenue * 0.8);

      return decreasedRevenue;
    } catch (error) {
      throw error;
    }
  }

  public async findTotalRevenueOfAdmin() {
    try {
      const currentDate = new Date();
      let revenueForMonths: number[] = [];

      for (let i = 0; i < 12; i++) {
        const startDate = new Date(currentDate.getFullYear(), i, 1, 0, 0, 0);
        const endDate = new Date(
          currentDate.getFullYear(),
          i + 1,
          0,
          23,
          59,
          59
        );

        const result = await orderModel.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$price" },
            },
          },
        ]);

        const monthRevenue = result.length > 0 ? result[0].totalRevenue : 0;
        revenueForMonths.push(monthRevenue);
      }

      // Decreasing revenue by 20%
      const decreasedRevenue = revenueForMonths.map((revenue) => revenue * 0.2);

      return decreasedRevenue;
    } catch (error) {
      throw error;
    }
  }
}

export default OrderRepository;
