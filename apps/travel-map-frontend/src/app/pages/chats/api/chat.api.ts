export const chatApi = {
  chatUsers: '/chats/available-users',
  chatsList: '/chats/list',
  sendMessage: '/chats/send-message',
  messages: (id: string) => `/chats/messages/${id}`,
  unreadMessages: '/chats/unread-messages',
  readMessages: (id: string) => `/chats/${id}/read`,
};
