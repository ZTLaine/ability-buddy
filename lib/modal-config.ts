import { cn } from "@/lib/utils";

export interface ModalConfig {
  content: {
    className: string;
    style?: React.CSSProperties;
  };
  header: {
    className: string;
  };
  body: {
    className: string;
  };
}

export const createModalConfig = (
  modalHeight: string,
  variant: 'default' | 'reset-password' = 'default'
): ModalConfig => {
  const baseContentClass = "sm:max-w-[425px] max-h-[85vh] shadow-lg rounded-lg overflow-hidden flex flex-col z-[100]";
  const baseHeaderClass = "px-6 py-4 border-b flex-shrink-0";
  const baseBodyClass = "overflow-y-auto flex-1 px-6 py-4 scrollbar-thin scrollbar-thumb-[#B39DDB]/30 scrollbar-track-transparent";

  if (variant === 'reset-password') {
    return {
      content: {
        className: cn(
          baseContentClass,
          "bg-[#FFFDE7] border-[#B39DDB] border-2"
        ),
        style: { height: modalHeight }
      },
      header: {
        className: cn(baseHeaderClass, "bg-[#FFFDE7] border-[#B39DDB]/30")
      },
      body: {
        className: baseBodyClass
      }
    };
  }

  return {
    content: {
      className: cn(
        baseContentClass,
        "bg-white border border-[#B39DDB]/30"
      ),
      style: { height: modalHeight }
    },
    header: {
      className: cn(baseHeaderClass, "border-[#B39DDB]/30")
    },
    body: {
      className: baseBodyClass
    }
  };
};

// Common modal title styles
export const modalTitleStyles = {
  default: "text-2xl font-bold text-[#00796B]",
  reset: "text-[#00796B] text-lg font-medium"
};

// Common modal description styles
export const modalDescriptionStyles = "text-gray-600"; 