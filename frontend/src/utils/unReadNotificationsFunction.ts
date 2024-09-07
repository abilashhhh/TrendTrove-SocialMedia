const unReadNotificationsFunction = (notifications: any[]) => {
  return notifications.filter(n => n.isRead === false);
};

export default unReadNotificationsFunction;
