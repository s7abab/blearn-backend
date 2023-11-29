import { ICreateCourseEvent } from "../../@types/eventsTypes/publishers";
import { Queues } from "../queues";
import { CourseSubjects } from "../subjects/course.subjects";
import { sendMessage } from "./publisher";

function courseCreated(course: ICreateCourseEvent) {
  const message = {
    subject: CourseSubjects.COURSE_CREATED,
    _id: course._id,
    title: course.title,
    price: course.title,
    isBlock: course.isBlock,
  };
  // rabbit mq
  sendMessage(message, Queues.course_queue);
}
