import express, { NextFunction, Request, Response } from "express";
import { Roles, authorizeRoles, isAuthenticated } from "@s7abab/common";
import CourseController from "../../controllers/course.controller";
import CourseRepository from "../../repositories/course.repository";
import CourseUsecase from "../../usecases/course.usecase";
import GetVideoDuration from "../utils/get-video-duration";

const getVideoDuration = new GetVideoDuration();
const courseRepository = new CourseRepository();
const courseUsecase = new CourseUsecase(courseRepository, getVideoDuration);
const courseController = new CourseController(courseUsecase);

const router = express.Router();

router.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  (req: Request, res: Response, next: NextFunction) =>
    courseController.createCourse(req, res, next)
);

router.put(
  "/edit-course",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  (req: Request, res: Response, next: NextFunction) =>
    courseController.editCourse(req, res, next)
);

router.delete(
  "/delete-course",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  (req: Request, res: Response, next: NextFunction) =>
    courseController.deleteCourse(req, res, next)
);

// public courses - everyone can access
router.get(
  "/get-all-courses",
  (req: Request, res: Response, next: NextFunction) =>
    courseController.getCourses(req, res, next)
);
router.get(
  "/search-courses",
  (req: Request, res: Response, next: NextFunction) =>
    courseController.searchCourses(req, res, next)
);

router.get(
  "/get-single-course/:courseId",
  (req: Request, res: Response, next: NextFunction) =>
    courseController.getSingleCourse(req, res, next)
);

// only for instructors
router.get(
  "/get-courses-for-instructor",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  (req: Request, res: Response, next: NextFunction) =>
    courseController.getCoursesForInstructors(req, res, next)
);

router.get(
  "/get-course-for-instructor/:courseId",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  (req: Request, res: Response, next: NextFunction) =>
    courseController.getSingleCourseForInstructors(req, res, next)
);

router.post(
  "/add-module",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  (req: Request, res: Response, next: NextFunction) =>
    courseController.addModule(req, res, next)
);

router.put(
  "/edit-module",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  (req: Request, res: Response, next: NextFunction) =>
    courseController.editModule(req, res, next)
);

router.delete(
  "/delete-module",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  (req: Request, res: Response, next: NextFunction) =>
    courseController.deleteModule(req, res, next)
);

router.get(
  "/get-modules/:courseId",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    courseController.getModules(req, res, next)
);

router.post(
  "/add-lesson",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  (req: Request, res: Response, next: NextFunction) =>
    courseController.addLesson(req, res, next)
);

router.put(
  "/update-lesson",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  (req: Request, res: Response, next: NextFunction) =>
    courseController.updateLesson(req, res, next)
);

router.get(
  "/enrolled-courses",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    courseController.getEnrolledCourses(req, res, next)
);

router.get(
  "/single-enrolled-course/:courseId",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    courseController.getOneEnrolledCourse(req, res, next)
);

router.post(
  "/track-lesson",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    courseController.trackLesson(req, res, next)
);

router.get(
  "/get-progression/:courseId",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    courseController.getProgression(req, res, next)
);

export default router;
