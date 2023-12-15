import { getVideoDurationInSeconds } from "get-video-duration";

interface IGetDuration {
  getVideoDuration(url: string): Promise<number>;
}

class GetVideoDuration implements IGetDuration {
  constructor() {}
  async getVideoDuration(url: string) {
    try {
      const duration = await getVideoDurationInSeconds(url);
      return duration;
    } catch (error) {
      throw error;
    }
  }
}

export default GetVideoDuration;
