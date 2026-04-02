import recordService from "../services/record.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "express-async-handler";

const create = asyncHandler(async (req, res) => {
  const record = await recordService.createRecord(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, record, "Record created"));
});

const getAll = asyncHandler(async (req, res) => {
  const data = await recordService.getRecords(req.query);
  res.json(new ApiResponse(200, data, "Records fetched"));
});

const getOne = asyncHandler(async (req, res) => {
  const record = await recordService.getRecordById(req.params.id);
  res.json(new ApiResponse(200, record));
});

const update = asyncHandler(async (req, res) => {
  const record = await recordService.updateRecord(req.params.id, req.body);
  res.json(new ApiResponse(200, record, "Record updated"));
});

const remove = asyncHandler(async (req, res) => {
  await recordService.deleteRecord(req.params.id);
  res.json(new ApiResponse(200, null, "Record deleted"));
});

export { create, getAll, getOne, update, remove };
