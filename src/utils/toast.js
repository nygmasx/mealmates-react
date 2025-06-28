import toast from 'react-hot-toast';

export const showToast = {
  success: (message) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10B981',
        color: 'white',
        fontWeight: '500',
      },
      iconTheme: {
        primary: 'white',
        secondary: '#10B981',
      },
    });
  },

  error: (message) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#EF4444',
        color: 'white',
        fontWeight: '500',
      },
      iconTheme: {
        primary: 'white',
        secondary: '#EF4444',
      },
    });
  },

  loading: (message) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#6B7280',
        color: 'white',
        fontWeight: '500',
      },
    });
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  promise: (promise, messages) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Chargement...',
        success: messages.success || 'Succès!',
        error: messages.error || 'Erreur!',
      },
      {
        position: 'top-right',
        style: {
          fontWeight: '500',
        },
        success: {
          style: {
            background: '#10B981',
            color: 'white',
          },
        },
        error: {
          style: {
            background: '#EF4444',
            color: 'white',
          },
        },
      }
    );
  },
};