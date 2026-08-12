const success = (
  res,
  { message = "Thành công", data = null, status = 200 } = {},
) => {
  return res.status(status).json({
    message,
    data,
  });
};

const successPage = (
  res,
  {
    message = "Thành công",
    content = [],
    page = 0,
    size = 10,
    totalElements = 0,
    status = 200,
  } = {},
) => {
  return res.status(status).json({
    message,
    data: {
      content,
      page,
      size,
      totalElements,
      totalPages: Math.ceil(totalElements / size),
    },
  });
};

// Response lỗi
const error = (res, { status = 500, message = "Lỗi server", path } = {}) => {
  return res.status(status).json({
    status,
    message,
    path,
    timestamp: new Date().toISOString(),
  });
};

// Đọc params
const getPagination = (query, { defaultSize = 20, maxSize = 100 } = {}) => {
  const page = Math.max(0, Number(query.page) || 0);
  const size = Math.min(
    maxSize,
    Math.max(1, Number(query.size) || defaultSize),
  );
  const q = query.q?.trim() || "";

  return { page, size, q };
};

module.exports = { success, successPage, error, getPagination };
