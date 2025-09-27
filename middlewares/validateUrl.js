import { body, validationResult } from "express-validator";
import Url from "../Models/UrlMd.js";

export const validateCreateUrl = [
  body("url")
    .exists({ checkFalsy: true })
    .withMessage("url is required")
    .isString()
    .withMessage("url must be a string")
    .bail()
    .isURL()
    .withMessage("url must be a valid URL"),

  body("shortCode")
    .exists({ checkFalsy: true })
    .withMessage("shortCode is required")
    .isString()
    .withMessage("shortCode must be a string")
    .isLength({ min: 3 })
    .withMessage("shortCode must be at least 3 characters")
    .custom(async (value) => {
      const exists = await Url.findOne({ shortCode: value });
      if (exists) {
        throw new Error("shortCode already exists");
      }
      return true;
    }),

  body("image")
    .optional()
    .isString()
    .withMessage("image must be a string"),
  body("accessCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("accessCount must be a positive number"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

export const validateUpdateUrl = [
  body("url")
    .optional()
    .isString()
    .withMessage("url must be a string")
    .bail()
    .isURL()
    .withMessage("url must be a valid URL"),

  body("shortCode")
    .optional()
    .isString()
    .withMessage("shortCode must be a string")
    .isLength({ min: 3 })
    .withMessage("shortCode must be at least 3 characters")
    .custom(async (value, { req }) => {
      const exists = await Url.findOne({ shortCode: value, _id: { $ne: req.params.id } });
      if (exists) {
        throw new Error("shortCode already exists");
      }
      return true;
    }),

  body("image")
    .optional()
    .isString()
    .withMessage("image must be a string"),

  body("accessCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("accessCount must be a positive number"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];
