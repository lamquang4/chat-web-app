const conversationService = require("../services/conversation.service");
const response = require("../utils/response.util");

const normalizeMemberIds = (req, res, next) => {
  let memberIds = req.body.member_ids;

  if (memberIds === undefined || memberIds === null) {
    req.body.member_ids = [];
    return next();
  }

  if (typeof memberIds === "string") {
    try {
      const parsed = JSON.parse(memberIds);
      req.body.member_ids = Array.isArray(parsed) ? parsed : [memberIds];
    } catch {
      req.body.member_ids = [memberIds];
    }
    return next();
  }

  if (Array.isArray(memberIds)) {
    req.body.member_ids = memberIds;
    return next();
  }

  req.body.member_ids = [];
  next();
};

const getConversationImages = async (req, res, next) => {
  try {
    const result = await conversationService.getConversationImages(
      req.user.id,
      req.params.conversationId,
    );

    return response.success(res, {
      message: "Tạo nhóm thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const createGroup = async (req, res, next) => {
  try {
    await conversationService.createGroup(req.user.id, req.body, req.file);

    return response.success(res, {
      message: "Tạo nhóm thành công",
      data: null,
      status: 201,
    });
  } catch (error) {
    next(error);
  }
};

const updateGroup = async (req, res, next) => {
  try {
    await conversationService.updateGroup(
      req.user.id,
      req.params.conversationId,
      req.body,
      req.file,
    );

    return response.success(res, {
      message: "Cập nhật nhóm thành công",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const deleteGroup = async (req, res, next) => {
  try {
    await conversationService.deleteGroup(
      req.user.id,
      req.params.conversationId,
    );

    return response.success(res, {
      message: "Xóa nhóm thành công",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const getGroupMembers = async (req, res, next) => {
  try {
    const result = await conversationService.getGroupMembers(
      req.user.id,
      req.params.conversationId,
    );

    return response.success(res, {
      message: "Lấy danh sách thành viên trong nhóm thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getConversationList = async (req, res, next) => {
  try {
    const { page, size, q } = response.getPagination(req.query);
    const type = req.query.type;

    const result = await conversationService.getConversationList(req.user.id, {
      page,
      size,
      type,
      q,
    });

    return response.successPage(res, {
      message: "Lấy danh sách hội thoại thành công",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getConversationDetail = async (req, res, next) => {
  try {
    const { page, size } = response.getPagination(req.query);

    const result = await conversationService.getConversationDetail(
      req.user.id,
      req.params.conversationId,
      { page, size },
    );

    return response.success(res, {
      message: "Lấy chi tiết hội thoại thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const addGroupMembers = async (req, res, next) => {
  try {
    await conversationService.addGroupMembers(
      req.user.id,
      req.params.conversationId,
      req.body.member_ids,
    );

    return response.success(res, {
      message: "Thêm thành viên vào nhóm thành công",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const removeGroupMember = async (req, res, next) => {
  try {
    await conversationService.removeGroupMember(
      req.user.id,
      req.params.conversationId,
      req.params.userId,
    );

    return response.success(res, {
      message: "Xóa thành viên khỏi nhóm thành công",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const promoteToAdmin = async (req, res, next) => {
  try {
    await conversationService.promoteToAdmin(
      req.user.id,
      req.params.conversationId,
      req.params.userId,
    );

    return response.success(res, {
      message: "Đặt thành viên làm quản trị viên thành công",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const demoteAdmin = async (req, res, next) => {
  try {
    await conversationService.demoteAdmin(
      req.user.id,
      req.params.conversationId,
      req.params.userId,
    );

    return response.success(res, {
      message: "Gỡ quyền quản trị viên thành công",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const transferOwnership = async (req, res, next) => {
  try {
    await conversationService.transferOwnership(
      req.user.id,
      req.params.conversationId,
      req.params.targetUserId,
    );

    return response.success(res, {
      message: "Chuyển quyền sở hữu nhóm thành công",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const getOrCreatePrivateConversation = async (req, res, next) => {
  try {
    const result = await conversationService.getOrCreatePrivateConversation(
      req.user.id,
      req.params.targetUserId,
    );

    return response.success(res, {
      success: true,
      message: "Lấy hoặc tạo conversation thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGroup,
  updateGroup,
  deleteGroup,
  getConversationImages,
  getConversationList,
  getConversationDetail,
  getOrCreatePrivateConversation,
  getGroupMembers,
  addGroupMembers,
  removeGroupMember,
  promoteToAdmin,
  demoteAdmin,
  transferOwnership,
  normalizeMemberIds,
};
