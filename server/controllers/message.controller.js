const messageService = require("../services/message.service");
const response = require("../utils/response.util");

const sendMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const result = await messageService.sendMessage(
      req.user.id,
      conversationId,
      req.body,
      req.files,
    );

    return response.success(res, {
      message: "Gửi tin nhắn thành công",
      data: result,
      status: 201,
    });
  } catch (error) {
    next(error);
  }
};

const recallMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    await messageService.recallMessage(req.user.id, messageId);

    return response.success(res, {
      message: "Đã thu hồi tin nhắn",
      data: null,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, recallMessage };
