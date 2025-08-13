import { toast } from "react-toastify";

// Toast configuration
export const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Success toast
export const showSuccess = (message) => {
  toast.success(message, toastConfig);
};

// Error toast
export const showError = (message) => {
  toast.error(message, toastConfig);
};

// Info toast
export const showInfo = (message) => {
  toast.info(message, toastConfig);
};

// Warning toast
export const showWarning = (message) => {
  toast.warning(message, toastConfig);
};

// Loading toast
export const showLoading = (message) => {
  return toast.loading(message, toastConfig);
};

// Update loading toast to success/error
export const updateToast = (toastId, type, message) => {
  toast.update(toastId, {
    render: message,
    type: type,
    isLoading: false,
    autoClose: 5000,
  });
};
