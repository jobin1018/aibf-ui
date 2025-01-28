import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  title?: string;
  description?: string;
  type?: "success" | "error";
  duration?: number;
  variant?: "destructive" | "default";
}

interface ToastItem extends ToastProps {
  id: number;
}

interface ToastContextType {
  toast: (props: ToastProps) => void;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((toast: ToastProps) => {
    const id = Date.now();
    const newToast: ToastItem = { ...toast, id };
    setToasts((currentToasts) => [...currentToasts, newToast]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  // Global toast event listener
  useEffect(() => {
    const handleToastEvent = (event: CustomEvent<ToastProps>) => {
      addToast(event.detail);
    };

    const eventListener = ((event: Event) => {
      handleToastEvent(event as CustomEvent<ToastProps>);
    }) as EventListener;

    window.addEventListener("show-toast", eventListener);

    return () => {
      window.removeEventListener("show-toast", eventListener);
    };
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] space-y-2">
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastComponent: React.FC<ToastItem & { onClose: () => void }> = ({
  message,
  title,
  description,
  type = "success",
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
  };

  return (
    <div
      className={cn(
        "p-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out animate-slide-in-right",
        typeStyles[type]
      )}
    >
      {title && <h4 className="font-bold">{title}</h4>}
      {message}
      {description && <p className="text-sm">{description}</p>}
    </div>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Utility function for direct toast calling
export const toast = (props: ToastProps) => {
  const event = new CustomEvent("show-toast", {
    detail: props,
  });
  window.dispatchEvent(event);
};
