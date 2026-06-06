const mongoose = require('mongoose')

const conversationMemberSchema = new mongoose.Schema({
  conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'member'],
    default: 'member',
  },
  last_read_at: { type: Date, default: null },
  joined_at:    { type: Date, default: Date.now },
})

conversationMemberSchema.index({ conversation_id: 1, user_id: 1 }, { unique: true })

module.exports = mongoose.model('ConversationMember', conversationMemberSchema)