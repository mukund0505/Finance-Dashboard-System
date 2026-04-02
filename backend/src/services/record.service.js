import FinancialRecord from "../models/FinancialRecord.model.js";
import ApiError from "../utils/ApiError.js";

const createRecord = async (data, userId) => {
  return FinancialRecord.create({ ...data, createdBy: userId });
};

const getRecords = async (filters) => {
  const { type, category, startDate, endDate, page = 1, limit = 20 } = filters;
  const query = {};

  if (type) query.type = type;
  if (category) query.category = new RegExp(category, "i");
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;
  const [records, total] = await Promise.all([
    FinancialRecord.find(query)
      .populate("createdBy", "name email")
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit)),
    FinancialRecord.countDocuments(query),
  ]);

  return {
    records,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

const getRecordById = async (id) => {
  const record = await FinancialRecord.findById(id).populate(
    "createdBy",
    "name email",
  );
  if (!record) throw new ApiError(404, "Record not found");
  return record;
};

const updateRecord = async (id, data) => {
  const record = await FinancialRecord.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!record) throw new ApiError(404, "Record not found");
  return record;
};

const deleteRecord = async (id) => {
  const record = await FinancialRecord.findByIdAndDelete(id);
  if (!record) throw new ApiError(404, "Record not found");
};

export default {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
