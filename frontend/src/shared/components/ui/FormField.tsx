import type { ReactNode } from "react";
import "./ui.css";

interface FormFieldProps {
    label: string;
    htmlFor: string;
    children: ReactNode;
    hint?: string;
    required?: boolean;
}

export function FormField({
    label,
    htmlFor,
    children,
    hint,
    required = false,
}: FormFieldProps) {
    return (
        <div className="form-field">
            <label htmlFor={htmlFor}>
                {label}

                {required && (
                    <span
                        className="form-field-required"
                        aria-hidden="true"
                    >
                        *
                    </span>
                )}
            </label>

            {children}

            {hint && (
                <small>{hint}</small>
            )}
        </div>
    );
}
