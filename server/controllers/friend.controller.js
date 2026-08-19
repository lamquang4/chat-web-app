const friendService = require("../services/friend.service");
const response = require("../utils/response.util");

const sendFriendRequest = async (req, res, next) => {
  try {
    await friendService.sendFriendRequest(req.user.id, req.params.id);
    return response.success(res, {
      message: "Đã gửi lời mời kết bạn",
      status: 201,
    });
  } catch (error) {
    next(error);
  }
};

const acceptFriendRequest = async (req, res, next) => {
  try {
    await friendService.acceptFriendRequest(req.user.id, req.params.id);
    return response.success(res, {
      message: "Đã chấp nhận lời mời kết bạn",
    });
  } catch (error) {
    next(error);
  }
};

const rejectFriendRequest = async (req, res, next) => {
  try {
    await friendService.rejectFriendRequest(req.user.id, req.params.id);
    return response.success(res, {
      message: "Đã từ chối lời mời kết bạn",
    });
  } catch (error) {
    next(error);
  }
};

const removeFriend = async (req, res, next) => {
  try {
    await friendService.removeFriend(req.user.id, req.params.id);
    return response.success(res, {
      message: "Đã hủy kết bạn",
    });
  } catch (error) {
    next(error);
  }
};

const getFriendsNotInConversation = async (req, res, next) => {
  try {
    const { page, size, q } = response.getPagination(req.query);

    const result = await friendService.getFriendsNotInConversation(
      req.user.id,
      req.params.conversationId,
      {
        page,
        size,
        q,
      },
    );

    return response.successPage(res, {
      message: "Lấy danh sách bạn bè thành công",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getFriendList = async (req, res, next) => {
  try {
    const { page, size, q } = response.getPagination(req.query);
    const result = await friendService.getFriendList(req.user.id, {
      page,
      size,
      q,
    });
    return response.successPage(res, {
      message: "Lấy danh sách bạn bè thành công",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getFriendRequestList = async (req, res, next) => {
  try {
    const { page, size, q } = response.getPagination(req.query);
    const result = await friendService.getFriendRequestList(req.user.id, {
      page,
      size,
      q,
    });
    return response.successPage(res, {
      message: "Lấy danh sách lời mời kết bạn thành công",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getSuggestedFriends = async (req, res, next) => {
  try {
    const { page, size, q } = response.getPagination(req.query);
    const result = await friendService.getSuggestedFriends(req.user.id, {
      page,
      size,
      q,
    });
    return response.successPage(res, {
      message: "Lấy danh sách gợi ý kết bạn thành công",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriendList,
  getFriendRequestList,
  getSuggestedFriends,
  getFriendsNotInConversation,
};
