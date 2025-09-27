/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: File upload and deletion
 */

/**
 * @swagger
 * /api/uploads:
 *   post:
 *     summary: Upload a file
 *     description: Upload a file to the server. Files are stored under `Public/Uploads/`.
 *     tags: [Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully
 *                 data:
 *                   type: object
 *                   description: Multer file object
 *                   properties:
 *                     fieldname:
 *                       type: string
 *                       example: file
 *                     originalname:
 *                       type: string
 *                       example: image.png
 *                     encoding:
 *                       type: string
 *                       example: "7bit"
 *                     mimetype:
 *                       type: string
 *                       example: "image/png"
 *                     destination:
 *                       type: string
 *                       example: "/app/Public/Uploads"
 *                     filename:
 *                       type: string
 *                       example: "1692975812345-image.png"
 *                     path:
 *                       type: string
 *                       example: "/app/Public/Uploads/1692975812345-image.png"
 *                     size:
 *                       type: integer
 *                       example: 204800
 *       400:
 *         description: No file uploaded
 *
 *   delete:
 *     summary: Delete an uploaded file
 *     description: Delete a previously uploaded file by its filename.
 *     tags: [Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - filename
 *             properties:
 *               filename:
 *                 type: string
 *                 description: Path or filename of the file to delete
 *                 example: "http://localhost:5000/uploads/1692975812345-image.png"
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: File deleted successfully
 *       400:
 *         description: No filename provided / Invalid filename
 *       500:
 *         description: Error deleting file
 */
import express from "express";
import upload from "./../Utils/Upload.js";
import { removeFile, uploadData } from "../Controllers/UploadCn.js";
const uploadRouter = express.Router();

uploadRouter
  .route("/")
  .post(upload.single("file"), uploadData)
  .delete(removeFile);

export default uploadRouter;
