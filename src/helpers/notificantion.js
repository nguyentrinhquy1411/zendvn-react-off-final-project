import { notification } from 'antd';

const openNotification = (type, message, description) => {
  notification[type]({
    message: message,
    description: description,
    duration: 3, // You can customize the duration (in seconds)
  });
};

export const successNotification = (message, description) => {
  openNotification('success', message, description);
};

export const errorNotification = (message, description) => {
  openNotification('error', message, description);
};

export const infoNotification = (message, description) => {
  openNotification('info', message, description);
};

export const warningNotification = (message, description) => {
  openNotification('warning', message, description);
};
