import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Url from "../Models/UrlMd.js";
import fs from "fs/promises";
import { __dirname } from "../app.js";
import path from "path";

export const create = catchAsync(async (req, res, next) => {
  const { url, shortCode, image, accessCount } = req.body;

  if (!url || typeof url !== "string") {
    return next(new HandleERROR("url is required and must be a string", 400));
  }

  try {
    new URL(url);
  } catch {
    return next(new HandleERROR("url is not a valid URL", 400));
  }

  if (!shortCode || typeof shortCode !== "string") {
    return next(
      new HandleERROR("shortCode is required and must be a string", 400)
    );
  }

  if (shortCode.length < 3) {
    return next(
      new HandleERROR("shortCode must be at least 3 characters", 400)
    );
  }

  const exists = await Url.findOne({ shortCode });
  if (exists) {
    return next(new HandleERROR("shortCode already exists", 400));
  }

  if (image && typeof image !== "string") {
    return next(
      new HandleERROR("image must be a string (url or filename)", 400)
    );
  }

  if (accessCount && (typeof accessCount !== "number" || accessCount < 0)) {
    return next(new HandleERROR("accessCount must be a positive number", 400));
  }

  const newUrl = await Url.create({
    url,
    shortCode,
    image: image || null,
    accessCount: accessCount || 0,
  });

  res.status(201).json({
    success: true,
    data: newUrl,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Url, req?.query, req?.role)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
  const result = await features.execute();

  return res.status(200).json(result);
});

export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Url, req?.query, req?.role)

    .addManualFilters({
      _id: req.params.id,
    })
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
  const result = await features.execute();

  return res.status(200).json(result);
});

export const update = catchAsync(async (req, res, next) => {
  const { url, shortCode, image, accessCount } = req.body;
  if (url !== undefined) {
    if (typeof url !== "string") {
      return next(new HandleERROR("url must be a string", 400));
    }
    try {
      new URL(url);
    } catch {
      return next(new HandleERROR("url is not a valid URL", 400));
    }
  }

  if (shortCode !== undefined) {
    if (typeof shortCode !== "string") {
      return next(new HandleERROR("shortCode must be a string", 400));
    }
    if (shortCode.length < 3) {
      return next(
        new HandleERROR("shortCode must be at least 3 characters", 400)
      );
    }
    const exists = await Url.findOne({
      shortCode,
      _id: { $ne: req.params.id },
    });
    if (exists) {
      return next(new HandleERROR("shortCode already exists", 400));
    }
  }

  if (image !== undefined && typeof image !== "string") {
    return next(
      new HandleERROR("image must be a string (url or filename)", 400)
    );
  }

  if (accessCount !== undefined) {
    if (typeof accessCount !== "number" || accessCount < 0) {
      return next(
        new HandleERROR("accessCount must be a positive number", 400)
      );
    }
  }

  const urlDoc = await Url.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!urlDoc) {
    return next(new HandleERROR("Url not found", 404));
  }

  res.status(200).json({
    success: true,
    data: urlDoc,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const url = await Url.findByIdAndDelete(id);

  if (!url) {
    return next(new HandleERROR("Url not found", 404));
  }

  if (url?.image && !url.image.startsWith("http")) {
    const filePath = path.join(__dirname, "Public", "Uploads", url.image);
    await fs.unlink(filePath);
  }

  return res.status(200).json({
    success: true,
    data: null,
    message: "Url deleted successfully",
  });
});
