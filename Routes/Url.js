import express from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from "../Controllers/UrlCn.js";
import { validateCreateUrl, validateUpdateUrl } from "../middlewares/validateUrl.js";

const urlrouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: URL
 *   description: URL Shortener endpoints
 */

/**
 * @swagger
 * /api/url:
 *   post:
 *     summary: Create a new short URL
 *     tags: [URL]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *               - shortCode
 *             properties:
 *               url:
 *                 type: string
 *                 example: "https://www.example.com/some/long/url"
 *               shortCode:
 *                 type: string
 *                 example: "abc123"
 *               image:
 *                 type: string
 *                 example: "myimage.png"
 *               accessCount:
 *                 type: number
 *                 example: 0
 *     responses:
 *       201:
 *         description: URL created successfully
 *       400:
 *         description: Validation error
 */
urlrouter.route("/").post(validateCreateUrl, create).get(
  /**
   * @swagger
   * /api/url:
   *   get:
   *     summary: Get all URLs
   *     tags: [URL]
   *     responses:
   *       200:
   *         description: List of URLs
   */
  getAll
);

/**
 * @swagger
 * /api/url/{id}:
 *   get:
 *     summary: Get a URL by ID
 *     tags: [URL]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: URL ID
 *     responses:
 *       200:
 *         description: URL found
 *       404:
 *         description: URL not found
 *   patch:
 *     summary: Update a URL by ID
 *     tags: [URL]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: URL ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *               shortCode:
 *                 type: string
 *               image:
 *                 type: string
 *               accessCount:
 *                 type: number
 *     responses:
 *       200:
 *         description: URL updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: URL not found
 *   delete:
 *     summary: Delete a URL by ID
 *     tags: [URL]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: URL ID
 *     responses:
 *       200:
 *         description: URL deleted successfully
 *       404:
 *         description: URL not found
 */
urlrouter
  .route("/:id")
  .patch(validateUpdateUrl, update)
  .get(getOne)
  .delete(remove);

export default urlrouter;
