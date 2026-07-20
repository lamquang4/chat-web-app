// Api response
const success = (
  res,
  { message = "Thành công", data, totalPages, total, status = 200 } = {},
) => {
  const body = { message };

  if (data !== undefined) body.data = data;
  if (totalPages !== undefined) body.totalPages = totalPages;
  if (total !== undefined) body.total = total;

  return res.status(status).json(body);
};

// Error response
const error = (res, { status = 500, message = "Lỗi server", path } = {}) => {
  return res.status(status).json({
    status,
    message,
    path,
    timestamp: new Date().toISOString(),
  });
};

module.exports = { success, error };
