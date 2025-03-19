
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      size: {
        default: "h-4",
        sm: "h-2",
        lg: "h-6"
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all",
  {
    variants: {
      variant: {
        default: "bg-primary",
        success: "bg-green-500",
        warning: "bg-yellow-500",
        danger: "bg-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ProgressCustomProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value: number;
  max?: number;
  indicatorClassName?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

const ProgressCustom = React.forwardRef<HTMLDivElement, ProgressCustomProps>(
  ({ className, value, max = 100, indicatorClassName, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className={cn(progressVariants({ size }), className)}
        {...props}
      >
        <div
          className={cn(progressIndicatorVariants({ variant }), indicatorClassName)}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    );
  }
);

ProgressCustom.displayName = "ProgressCustom";

export { ProgressCustom };
