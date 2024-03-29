import express, { Request, Response } from "express";
import multer from "multer";
import crypto from "crypto";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { getObjectSignedUrl, uploadFile } from "./services/s3";

const app = express();
// payload size
app.use(express.json({ limit: "50" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use(
  cors({
    origin: "https://blearn-azure.vercel.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(morgan("dev"));
dotenv.config();

app.use(express.static("public"));

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

app.post("/api/v1/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const fileName = generateFileName();
    await uploadFile(file.buffer, fileName, file.mimetype);

    res.status(200).json({
      sucess: true,
      fileName,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/api/v1/upload", async (req, res) => {
  try {
    const fileUrl = await getObjectSignedUrl(req.query.fileName as string);
    const url = fileUrl.replace(
      process.env.S3_DOMAIN as string,
      process.env.CLOUDFRONT_DOMAIN as string
    );
    res.status(200).json(url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
