import React, { useState, CSSProperties, useEffect } from "react";
import { useAuth } from "../AuthContext";
import moment from "moment";
import "moment/locale/pt-br";

// --- Style Constants ---
const styles = {
  // Colors
  bgColorPrimary: "#000000", // Black for sidebar
  bgColorSecondary: "#FFFFFF", // White for content
  textColorPrimary: "#FFFFFF", // White for sidebar text
  textColorSecondary: "#333333", // Dark grey for content text
  textColorMuted: "#6B7280", // Lighter grey for some text
  borderColor: "#E5E7EB", // Light grey for borders
  accentColorBlue: "#2563EB", // Blue for active elements/links
  accentColorGreen: "#16A34A", // Green for success indicators
  buttonPrimaryBg: "#212121", // Dark, almost black for primary buttons
  buttonSecondaryBorder: "#D1D5DB", // Grey border for secondary buttons
  buttonDisabledBg: "#D1D5DB", // Greyed out bg
  buttonDisabledColor: "#6B7280", // Greyed out text
  inputBorderColor: "#D1D5DB",
  inputBgColor: "#FFFFFF", // White background for inputs
  inputFocusBorderColor: "#2563EB", // Blue border on focus

  // Typography
  fontFamily:
    'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontSizeXs: "12px",
  fontSizeSm: "13px",
  fontSizeBase: "14px",
  fontSizeLg: "16px",
  fontSizeXl: "18px",
  fontSize2Xl: "24px",
  fontSizePageTitle: "28px",
  fontWeightNormal: 400,
  fontWeightMedium: 500,
  fontWeightSemibold: 600,
  fontWeightBold: 700,

  // Spacing
  paddingXs: "4px",
  paddingSm: "8px",
  paddingMd: "16px",
  paddingLg: "24px",
  paddingXl: "32px",

  // Responsive breakpoints
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },

  // Buttons (base styles, specific variants will extend these)
  buttonBase: {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "1px solid transparent",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "14px",
    transition: "all 0.2s ease-in-out",
    lineHeight: "1.5",
    textAlign: "center" as "center",
    outline: "none",
  } as CSSProperties,
  buttonPrimary: {
    backgroundColor: "#2563EB",
    color: "#FFFFFF",
    border: "1px solid #2563EB",
  } as CSSProperties,
  buttonSecondary: {
    backgroundColor: "#FFFFFF",
    color: "#374151",
    border: "1px solid #D1D5DB",
  } as CSSProperties,
  buttonDisabled: {
    backgroundColor: "#F3F4F6",
    color: "#9CA3AF",
    cursor: "not-allowed",
    border: "1px solid #E5E7EB",
  } as CSSProperties,
  buttonLink: {
    background: "none",
    border: "none",
    color: "#2563EB",
    padding: "8px 0",
    textDecoration: "none",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "14px",
  } as CSSProperties,

  // Inputs - improved for light theme with guaranteed borders
  inputBase: {
    padding: "12px 16px",
    border: "1px solid #D1D5DB",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#D1D5DB",
    borderRadius: "8px",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box" as "border-box",
    lineHeight: "1.5",
    backgroundColor: "#FFFFFF",
    color: "#374151",
    transition: "border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    outline: "none",
    // Additional border enforcement
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none",
  } as CSSProperties,

  // Sections
  sectionTitle: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#6B7280",
    textTransform: "uppercase" as "uppercase",
    marginBottom: "16px",
    letterSpacing: "0.5px",
  } as CSSProperties,
  hr: {
    border: "none",
    borderTop: `1px solid #E5E7EB`,
    margin: "32px 0",
  } as CSSProperties,
  flexBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  } as CSSProperties,
};

// --- Icon Components ---
const CursorLogo: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "#FFFFFF",
}) => (
  <div
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
    }}
  />
);

const ArrowLeftIcon: React.FC<{ style?: CSSProperties }> = ({ style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    style={style}
  >
    <path
      fillRule="evenodd"
      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
    />
  </svg>
);

const VisaIcon: React.FC<{ style?: CSSProperties }> = ({ style }) => (
  <svg
    width="38"
    height="24"
    viewBox="0 0 38 24"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    style={style}
  >
    <path
      opacity=".07"
      d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
    />
    <path
      fill="#fff"
      d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
    />
    <path
      d="M28.8 10.1c-.1-.3-.3-.6-.6-.7-.5-.3-1.3-.5-2.4-.5s-1.7.2-2.4.5c-.3.1-.5.4-.6.7l-1.7 7.1H25c.1-.2.3-.5.4-.6.2-.2.5-.3.8-.3.5 0 .8.3 1 .8l.9 3.8H31l-2.2-8.8zm-10.4 4.4c.4-.4.7-.7.8-1.1.1-.4.2-.9.2-1.4v-.1c0-.7-.1-1.3-.3-1.9-.2-.5-.5-.9-1-1.2-.5-.2-1-.4-1.6-.4-.7 0-1.3.1-1.9.4-.5.2-.9.6-1.2 1s-.4.8-.5 1.4c-.1.5-.1 1-.1 1.5v.1c0 .7.1 1.3.3 1.8.2.5.5.9 1 1.2.5.2 1 .4 1.6.4.7 0 1.3-.1 1.9-.4.5-.2.9-.6 1.1-1zm8.5-4.4c.5-.3 1.3-.5 2.4-.5s1.7.2 2.4.5c.3.1.5.4.6.7l1.7 7.1h-3.7c-.1-.2-.3-.5-.4-.6-.2-.2-.5-.3-.8-.3-.5 0-.8.3-1 .8l-.9 3.8h-3.6l2.2-8.8z"
      fill="#1A1F71"
    />
  </svg>
);

const EditIcon: React.FC<{ style?: CSSProperties }> = ({ style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    style={style}
  >
    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zM3 9.5a.5.5 0 0 1 .5-.5h.5v.5h-.5a.5.5 0 0 1-.5-.5zm0-1a.5.5 0 0 1 .5-.5h.5v.5h-.5a.5.5 0 0 1-.5-.5zm0-1a.5.5 0 0 1 .5-.5h.5v.5h-.5a.5.5 0 0 1-.5-.5zm-1.131-1.132L3.75 5.25V7.5h2.25L14 -.25l-2.25-2.25L3.869 6.369zM11.869.146L2.75 9.277V12h2.723L14.531 2.935 11.87.146z" />
  </svg>
);

const MoreHorizontalIcon: React.FC<{ style?: CSSProperties }> = ({ style }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
);

const AddIcon: React.FC<{ style?: CSSProperties }> = ({ style }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.5 2.5C8.5 2.22386 8.27614 2 8 2C7.72386 2 7.5 2.22386 7.5 2.5V7.5H2.5C2.22386 7.5 2 7.72386 2 8C2 8.27614 2.22386 8.5 2.5 8.5H7.5V13.5C7.5 13.7761 7.72386 14 8 14C8.27614 14 8.5 13.7761 8.5 13.5V8.5H13.5C13.7761 8.5 14 8.27614 14 8C14 7.72386 13.7761 7.5 13.5 7.5H8.5V2.5Z"
    />
  </svg>
);

const CheckIcon: React.FC<{ style?: CSSProperties }> = ({ style }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginRight: styles.paddingXs, verticalAlign: "middle", ...style }}
  >
    <path
      d="M9.99984 3L4.49984 8.5L1.99984 6"
      stroke={styles.accentColorGreen}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CreditCardIcon: React.FC<{ style?: CSSProperties }> = ({ style }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const PixIcon: React.FC<{
  size?: number;
  color?: string;
  style?: CSSProperties;
}> = ({ size = 20, color = "currentColor", style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <path d="M12.0049 2.01367C6.48206 2.01367 2.00488 6.49085 2.00488 12.0137C2.00488 17.5365 6.48206 22.0137 12.0049 22.0137C17.5277 22.0137 22.0049 17.5365 22.0049 12.0137C22.0049 6.49085 17.5277 2.01367 12.0049 2.01367ZM10.4088 6.45293H13.6088L10.4088 12.4091H13.6088L8.80078 17.5815V11.6254H5.60078V6.45293H10.4088ZM18.4168 11.6254H15.2168V6.45293H18.4168V11.6254Z" />
  </svg>
);

const PencilScribbleIcon: React.FC<{ style?: CSSProperties }> = ({ style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    style={{ marginRight: styles.paddingXs, ...style }}
  >
    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V12h2.293l6.5-6.5-2.707-2.707z" />
  </svg>
);

// --- Data Interfaces ---
interface PaymentMethod {
  id: string;
  type: "Visa" | "Mastercard" | "Pix";
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

interface BillingInformation {
  name: string;
  email: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phone?: string;
  fiscalId?: {
    type: string;
    number: string;
  };
}

interface SubscriptionData {
  planName: string;
  price: string;
  currency: string;
  interval: string;
  renewalDate: string;
  paymentMethods: PaymentMethod[];
  billingInfo: BillingInformation;
}

// --- Reusable Styled Components ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "link";
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  fullWidth,
  style: customStyle,
  ...props
}) => {
  let buttonStyle: CSSProperties = {
    ...styles.buttonBase,
    width: fullWidth ? "100%" : "auto",
  };
  if (variant === "primary")
    buttonStyle = { ...buttonStyle, ...styles.buttonPrimary };
  else if (variant === "secondary")
    buttonStyle = { ...buttonStyle, ...styles.buttonSecondary };
  else if (variant === "link")
    buttonStyle = { ...buttonStyle, ...styles.buttonLink };
  if (props.disabled)
    buttonStyle = { ...buttonStyle, ...styles.buttonDisabled };

  // Add hover and focus styles
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  let interactiveStyle: CSSProperties = {};
  if (!props.disabled) {
    if (variant === "primary" && (isHovered || isFocused)) {
      interactiveStyle.backgroundColor = "#1D4ED8";
      interactiveStyle.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
    } else if (variant === "secondary" && (isHovered || isFocused)) {
      interactiveStyle.backgroundColor = "#F9FAFB";
      interactiveStyle.borderColor = "#9CA3AF";
      interactiveStyle.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
    }
  }

  return (
    <button
      style={{ ...buttonStyle, ...interactiveStyle, ...customStyle }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    >
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  style: customStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const focusStyle: CSSProperties = isFocused
    ? {
        borderColor: styles.inputFocusBorderColor,
        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
      }
    : {};

  // Ensure border is always present
  const ensuredBorderStyle: CSSProperties = {
    border: "1px solid #D1D5DB", // Ensure border is always present
    borderWidth: "1px",
    borderStyle: "solid",
  };

  return (
    <div style={{ marginBottom: styles.paddingMd }}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: styles.paddingSm,
            fontSize: styles.fontSizeBase,
            color: styles.textColorSecondary,
            fontWeight: styles.fontWeightMedium,
          }}
        >
          {label}
        </label>
      )}
      <input
        style={{
          ...styles.inputBase,
          ...ensuredBorderStyle,
          ...focusStyle,
          ...(error
            ? {
                borderColor: "#EF4444",
                borderWidth: "1px",
                borderStyle: "solid",
                boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.1)",
              }
            : {}),
          ...customStyle,
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && (
        <p
          style={{
            color: "#EF4444",
            fontSize: styles.fontSizeXs,
            marginTop: styles.paddingSm,
            display: "flex",
            alignItems: "center",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  style: customStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const focusStyle: CSSProperties = isFocused
    ? {
        borderColor: styles.inputFocusBorderColor,
        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
      }
    : {};

  // Ensure border is always present
  const ensuredBorderStyle: CSSProperties = {
    border: "1px solid #D1D5DB", // Ensure border is always present
    borderWidth: "1px",
    borderStyle: "solid",
  };

  return (
    <div style={{ marginBottom: styles.paddingMd }}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: styles.paddingSm,
            fontSize: styles.fontSizeBase,
            color: styles.textColorSecondary,
            fontWeight: styles.fontWeightMedium,
          }}
        >
          {label}
        </label>
      )}
      <select
        style={{
          ...styles.inputBase,
          ...ensuredBorderStyle,
          ...focusStyle,
          ...(error
            ? {
                borderColor: "#EF4444",
                borderWidth: "1px",
                borderStyle: "solid",
                boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.1)",
              }
            : {}),
          ...customStyle,
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p
          style={{
            color: "#EF4444",
            fontSize: styles.fontSizeXs,
            marginTop: styles.paddingSm,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

const Breadcrumbs: React.FC<{
  items: { label: string; onClick?: () => void }[];
  style?: CSSProperties;
}> = ({ items, style: customStyle }) => (
  <div
    style={{
      marginBottom: styles.paddingLg,
      display: "flex",
      alignItems: "center",
      color: styles.textColorMuted,
      fontSize: styles.fontSizeBase,
      ...customStyle,
    }}
  >
    {items.map((item, index) => (
      <React.Fragment key={index}>
        <span
          onClick={item.onClick}
          style={{
            cursor: item.onClick ? "pointer" : "default",
            color: item.onClick
              ? styles.accentColorBlue
              : styles.textColorMuted,
            textDecoration: item.onClick ? "none" : "none",
            transition: "color 0.2s ease-in-out",
          }}
        >
          {item.label}
        </span>
        {index < items.length - 1 && (
          <span style={{ margin: `0 ${styles.paddingSm}` }}>›</span>
        )}
      </React.Fragment>
    ))}
  </div>
);

// --- Page Section Components ---
const Section: React.FC<{
  title?: string;
  children: React.ReactNode;
  style?: CSSProperties;
}> = ({ title, children, style: additionalStyle }) => (
  <div style={{ marginBottom: styles.paddingXl, ...additionalStyle }}>
    {title && <h3 style={{ ...styles.sectionTitle }}>{title}</h3>}
    {children}
  </div>
);

const InfoRow: React.FC<{
  label: string;
  value: string | React.ReactNode;
  action?: React.ReactNode;
  style?: CSSProperties;
}> = ({ label, value, action, style: additionalStyle }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "12px",
      fontSize: styles.fontSizeBase,
      gap: styles.paddingMd,
      ...additionalStyle,
    }}
  >
    <span
      style={{
        color: styles.textColorMuted,
        minWidth: "150px",
        flexShrink: 0,
      }}
    >
      {label}
    </span>
    <span
      style={{
        color: styles.textColorSecondary,
        flexGrow: 1,
        fontWeight: styles.fontWeightMedium,
        textAlign: "left",
        lineHeight: 1.5,
      }}
    >
      {value}
    </span>
    {action && (
      <div style={{ marginLeft: styles.paddingMd, flexShrink: 0 }}>
        {action}
      </div>
    )}
  </div>
);

// --- BIN Lookup Types and Utilities ---
interface BinLookupResponse {
  brand: string;
  brandName: string;
  gaps?: number[];
  lengths?: number[];
  lenghts?: number[]; // Note: API has typo in property name
  mask?: string;
  cvv?: number;
  brandImage?: string;
  possibleBrands?: string[];
}

// Utility function to format card number based on gaps
const formatCardNumber = (
  value: string,
  gaps: number[] = [4, 8, 12]
): string => {
  // Remove all non-digits
  const digitsOnly = value.replace(/\D/g, "");

  let formatted = "";
  let position = 0;

  for (let i = 0; i < digitsOnly.length; i++) {
    // Add space at gap positions
    if (gaps.includes(i) && i > 0) {
      formatted += " ";
      position++;
    }
    formatted += digitsOnly[i];
    position++;
  }

  return formatted;
};

// Utility function to get unformatted card number
const getUnformattedCardNumber = (value: string): string => {
  return value.replace(/\D/g, "");
};

// Utility function to validate card number length
const isValidCardLength = (
  value: string,
  validLengths: number[] = [16]
): boolean => {
  const unformatted = getUnformattedCardNumber(value);
  return validLengths.includes(unformatted.length);
};

// Helper function to get valid lengths from BIN data (handles API typo)
const getValidLengths = (binData: BinLookupResponse | null): number[] => {
  if (!binData) return [16];
  return binData.lengths || binData.lenghts || [16];
};

// Helper function to get CVV length from BIN data
const getCvvLength = (binData: BinLookupResponse | null): number => {
  if (!binData || typeof binData.cvv !== "number") return 3;
  return binData.cvv;
};

// Helper function to get maxLength for input (to avoid undefined)
const getMaxLength = (binData: BinLookupResponse | null): number => {
  const cvvLength = getCvvLength(binData);
  return cvvLength > 0 ? cvvLength : 4; // Fallback to 4 if somehow 0
};

// Helper function to get gaps from BIN data
const getGaps = (binData: BinLookupResponse | null): number[] => {
  if (!binData || !Array.isArray(binData.gaps)) return [4, 8, 12];
  return binData.gaps;
};

// BIN Lookup API call
const fetchBinData = async (bin: string): Promise<BinLookupResponse | null> => {
  try {
    const response = await fetch(`https://api.pagar.me/bin/v1/${bin}`);
    if (response.ok) {
      const data = await response.json();
      console.log("BIN lookup response:", data); // Debug log
      return data;
    }
  } catch (error) {
    console.warn("BIN lookup failed:", error);
  }
  return null;
};

// --- Subscription Views ---
const SubscriptionOverview: React.FC<{
  data: SubscriptionData;
  onNavigateToAddPayment: () => void;
  onNavigateToUpdateBilling: () => void;
  onCancelSubscription: () => void;
  activeDropdown: string | null;
  setActiveDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  onPaymentMethodAction: (action: string, paymentMethodId: string) => void;
}> = ({
  data,
  onNavigateToAddPayment,
  onNavigateToUpdateBilling,
  onCancelSubscription,
  activeDropdown,
  setActiveDropdown,
  onPaymentMethodAction,
}) => {
  const currentPaymentMethod =
    data.paymentMethods.find((pm) => pm.isDefault) || data.paymentMethods[0];

  const PaymentMethodDropdown: React.FC<{
    paymentMethod: PaymentMethod;
    isOpen: boolean;
  }> = ({ paymentMethod, isOpen }) => {
    if (!isOpen) return null;

    return (
      <div
        style={{
          position: "absolute",
          top: "100%",
          right: 0,
          backgroundColor: styles.bgColorSecondary,
          border: `1px solid ${styles.borderColor}`,
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          zIndex: 1000,
          minWidth: "160px",
          overflow: "hidden",
        }}
      >
        {!paymentMethod.isDefault && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPaymentMethodAction("setDefault", paymentMethod.id);
            }}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "none",
              backgroundColor: "transparent",
              textAlign: "left",
              cursor: "pointer",
              fontSize: styles.fontSizeBase,
              color: styles.textColorSecondary,
              transition: "background-color 0.2s ease-in-out",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#F3F4F6")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            Definir como padrão
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPaymentMethodAction("edit", paymentMethod.id);
          }}
          style={{
            width: "100%",
            padding: "12px 16px",
            border: "none",
            backgroundColor: "transparent",
            textAlign: "left",
            cursor: "pointer",
            fontSize: styles.fontSizeBase,
            color: styles.textColorSecondary,
            transition: "background-color 0.2s ease-in-out",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#F3F4F6")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          Editar
        </button>
        {data.paymentMethods.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPaymentMethodAction("delete", paymentMethod.id);
            }}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "none",
              backgroundColor: "transparent",
              textAlign: "left",
              cursor: "pointer",
              fontSize: styles.fontSizeBase,
              color: "#EF4444",
              transition: "background-color 0.2s ease-in-out",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#FEF2F2")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            Remover
          </button>
        )}
      </div>
    );
  };

  return (
    <div style={{ margin: "0 auto", width: "100%" }}>
      <Section title="ASSINATURA ATUAL">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexDirection: window.innerWidth < 768 ? "column" : "row",
            gap: styles.paddingLg,
          }}
        >
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: styles.fontSize2Xl,
                fontWeight: styles.fontWeightSemibold,
                color: styles.textColorSecondary,
                marginBottom: "8px",
              }}
            >
              {data.planName}
            </h1>
            <p
              style={{
                fontSize: styles.fontSizeLg,
                color: styles.textColorSecondary,
                marginBottom: "8px",
              }}
            >
              <span style={{ fontWeight: styles.fontWeightBold }}>
                {Number(Number(data.price) / 100).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>{" "}
              por {data.interval === "month" ? "mês" : "ano"}
            </p>
            <p
              style={{
                fontSize: styles.fontSizeBase,
                color: styles.textColorMuted,
                marginBottom: styles.paddingLg,
                lineHeight: 1.5,
              }}
            >
              Sua assinatura será renovada em {moment(data.renewalDate).format('DD [de] MMMM [de] YYYY [às] HH:mm')}.
            </p>
            {currentPaymentMethod && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: styles.fontSizeBase,
                  color: styles.textColorSecondary,
                  flexWrap: "wrap",
                  gap: styles.paddingSm,
                }}
              >
                <VisaIcon />
                <span style={{ marginRight: styles.paddingMd }}>
                  {currentPaymentMethod.type} •••• {currentPaymentMethod.last4}
                </span>
                <button
                  onClick={onNavigateToAddPayment}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: styles.textColorMuted,
                    padding: "4px",
                    borderRadius: "4px",
                    transition: "background-color 0.2s ease-in-out",
                  }}
                >
                  <EditIcon />
                </button>
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              minWidth: "200px",
              width: window.innerWidth < 768 ? "100%" : "auto",
              gap: styles.paddingSm,
            }}
          >
            <Button variant="secondary" onClick={onCancelSubscription}>
              Cancelar assinatura
            </Button>
          </div>
        </div>
      </Section>

      <hr style={styles.hr} />

      <Section title="FORMA DE PAGAMENTO">
        {data.paymentMethods.map((pm) => (
          <div
            key={pm.id}
            style={{
              ...styles.flexBetween,
              padding: `${styles.paddingMd} 0`,
              borderBottom:
                data.paymentMethods.length > 1
                  ? `1px solid ${styles.borderColor}`
                  : "none",
              marginBottom: "12px",
              flexWrap: "wrap",
              gap: styles.paddingSm,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                minWidth: "200px",
              }}
            >
              <VisaIcon />
              <span
                style={{
                  marginLeft: styles.paddingSm,
                  color: styles.textColorSecondary,
                  fontSize: styles.fontSizeBase,
                }}
              >
                {pm.type} •••• {pm.last4}
                {pm.isDefault && (
                  <span
                    style={{
                      marginLeft: styles.paddingSm,
                      backgroundColor: "#EBF4FF",
                      color: "#1E40AF",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: styles.fontSizeXs,
                      fontWeight: styles.fontWeightMedium,
                    }}
                  >
                    Padrão
                  </span>
                )}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: styles.fontSizeBase,
                gap: styles.paddingSm,
                position: "relative",
              }}
            >
              {pm.expiryMonth && pm.expiryYear && (
                <span style={{ color: styles.textColorMuted }}>
                  Vence em {String(pm.expiryMonth).padStart(2, "0")}/
                  {pm.expiryYear}
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDropdown(activeDropdown === pm.id ? null : pm.id);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: styles.textColorMuted,
                  padding: "8px",
                  borderRadius: "4px",
                  transition: "background-color 0.2s ease-in-out",
                  position: "relative",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#F3F4F6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <MoreHorizontalIcon />
              </button>
              <PaymentMethodDropdown
                paymentMethod={pm}
                isOpen={activeDropdown === pm.id}
              />
            </div>
          </div>
        ))}
        <Button
          variant="link"
          onClick={onNavigateToAddPayment}
          style={{ marginTop: styles.paddingSm }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <AddIcon style={{ marginRight: "8px" }} />
            Adicionar forma de pagamento
          </div>
        </Button>
      </Section>

      <hr style={styles.hr} />

      <Section title="DADOS DE FATURAMENTO">
        <InfoRow label="Nome" value={data.billingInfo.name} />
        <InfoRow label="E-mail" value={data.billingInfo.email} />
        <InfoRow
          label="Endereço de cobrança"
          value={
            <div>
              {data.billingInfo.address.line1}
              <br />
              {data.billingInfo.address.line2 && (
                <>
                  {data.billingInfo.address.line2}
                  <br />
                </>
              )}
              {data.billingInfo.address.city}-{data.billingInfo.address.state}
              <br />
              {data.billingInfo.address.postalCode}
              <br />
              {data.billingInfo.address.country}
            </div>
          }
        />
        <Button
          variant="link"
          onClick={onNavigateToUpdateBilling}
          style={{ marginTop: styles.paddingMd }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <PencilScribbleIcon />
            Atualizar informações
          </div>
        </Button>
      </Section>
    </div>
  );
};

const AddPaymentMethod: React.FC<{
  onAddCard: (cardDetails: PaymentMethod) => void;
  onAddPix: () => void;
  onBack: () => void;
}> = ({ onAddCard, onAddPix, onBack }) => {
  const [paymentType, setPaymentType] = useState<"card" | "pix">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [country, setCountry] = useState("BR");

  // BIN lookup state
  const [binData, setBinData] = useState<BinLookupResponse | null>(null);
  const [isLoadingBin, setIsLoadingBin] = useState(false);
  const [cardNumberError, setCardNumberError] = useState("");
  const [cvcError, setCvcError] = useState("");

  // Handle card number input with BIN lookup and formatting
  const handleCardNumberChange = async (value: string) => {
    const unformatted = getUnformattedCardNumber(value);

    // Clear previous errors
    setCardNumberError("");

    // Format the card number based on current bin data or default
    const formatted = formatCardNumber(value, getGaps(binData));
    setCardNumber(formatted);

    // Perform BIN lookup when we have at least 6 digits
    if (unformatted.length >= 6 && !isLoadingBin) {
      const bin = unformatted.substring(0, 6);
      setIsLoadingBin(true);

      try {
        const newBinData = await fetchBinData(bin);
        if (newBinData) {
          setBinData(newBinData);
          // Reformat with new gaps
          const reformatted = formatCardNumber(value, getGaps(newBinData));
          setCardNumber(reformatted);
        }
      } catch (error) {
        console.warn("BIN lookup error:", error);
      } finally {
        setIsLoadingBin(false);
      }
    }

    // Clear bin data if card number is too short
    if (unformatted.length < 6) {
      setBinData(null);
    }

    // Validate card length if we have bin data
    if (binData && unformatted.length > 0) {
      const validLengths = getValidLengths(binData);
      if (!isValidCardLength(formatted, validLengths)) {
        setCardNumberError(
          `Número deve ter ${validLengths.join(" ou ")} dígitos`
        );
      }
    }
  };

  // Handle CVC input with length validation
  const handleCvcChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    const maxLength = getMaxLength(binData);

    // Limit to max length
    const limited = digitsOnly.substring(0, maxLength);
    setCvc(limited);

    // Clear error when typing
    setCvcError("");

    // Validate length
    if (limited.length > 0 && limited.length < maxLength) {
      setCvcError(`CVV deve ter ${maxLength} dígitos`);
    }
  };

  // Handle expiry date formatting
  const handleExpiryDateChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    let formatted = digitsOnly;

    if (digitsOnly.length >= 2) {
      formatted = digitsOnly.substring(0, 2) + "/" + digitsOnly.substring(2, 4);
    }

    setExpiryDate(formatted);
  };

  // Get card brand icon
  const getCardBrandIcon = () => {
    if (!binData) return <CreditCardIcon style={{ marginRight: "8px" }} />;

    // You could return different icons based on binData.brand
    switch (binData.brand?.toLowerCase()) {
      case "visa":
        return (
          <VisaIcon
            style={{ width: "32px", height: "20px", marginRight: "8px" }}
          />
        );
      case "mastercard":
        return (
          <CreditCardIcon style={{ marginRight: "8px", color: "#EB001B" }} />
        );
      case "discover":
        return (
          <CreditCardIcon style={{ marginRight: "8px", color: "#FF6000" }} />
        );
      default:
        return <CreditCardIcon style={{ marginRight: "8px" }} />;
    }
  };

  const handleAddCard = () => {
    const unformattedCardNumber = getUnformattedCardNumber(cardNumber);

    // Validate required fields
    if (!unformattedCardNumber || !expiryDate || !cvc) {
      alert("Preencha todos os campos do cartão.");
      return;
    }

    // Validate card number length
    const validLengths = getValidLengths(binData);
    if (binData && !isValidCardLength(cardNumber, validLengths)) {
      setCardNumberError(
        `Número deve ter ${validLengths.join(" ou ")} dígitos`
      );
      return;
    }

    // Validate CVC length
    const expectedCvcLength = getMaxLength(binData);
    if (cvc.length !== expectedCvcLength) {
      setCvcError(`CVV deve ter ${expectedCvcLength} dígitos`);
      return;
    }

    // Validate expiry date
    const [monthStr, yearStr] = expiryDate.split("/");
    const expiryMonth = parseInt(monthStr, 10);
    const expiryYear = parseInt(`20${yearStr}`, 10);

    if (
      isNaN(expiryMonth) ||
      isNaN(expiryYear) ||
      expiryMonth < 1 ||
      expiryMonth > 12 ||
      yearStr.length !== 2
    ) {
      alert("Data de validade inválida. Use MM/AA.");
      return;
    }

    // Determine card type from bin data or fallback to generic
    const cardType = binData?.brandName || "Visa";

    onAddCard({
      id: `pm_${Date.now()}`,
      type: cardType as "Visa" | "Mastercard" | "Pix",
      last4: unformattedCardNumber.slice(-4),
      expiryMonth,
      expiryYear,
      isDefault: true,
    });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Breadcrumbs
        items={[
          { label: "Faturamento", onClick: onBack },
          { label: "Forma de pagamento" },
        ]}
      />

      <h1
        style={{
          fontSize: styles.fontSizePageTitle,
          fontWeight: styles.fontWeightBold,
          color: styles.textColorSecondary,
          marginBottom: styles.paddingLg,
        }}
      >
        Adicionar forma de pagamento
      </h1>

      <div
        style={{
          display: "flex",
          marginBottom: styles.paddingLg,
          borderBottom: `1px solid ${styles.borderColor}`,
          gap: "2px",
        }}
      >
        {[
          { label: "Cartão", type: "card" as "card", icon: getCardBrandIcon() },
          {
            label: "PIX",
            type: "pix" as "pix",
            icon: <PixIcon style={{ marginRight: "8px" }} />,
          },
        ].map((item) => (
          <button
            key={item.type}
            onClick={() => setPaymentType(item.type)}
            style={{
              padding: `14px ${styles.paddingLg}`,
              border: "none",
              borderBottom:
                paymentType === item.type
                  ? `3px solid ${styles.accentColorBlue}`
                  : "3px solid transparent",
              backgroundColor: "transparent",
              color:
                paymentType === item.type
                  ? styles.accentColorBlue
                  : styles.textColorSecondary,
              cursor: "pointer",
              fontWeight: styles.fontWeightMedium,
              display: "flex",
              alignItems: "center",
              transition: "all 0.2s ease-in-out",
              outline: "none",
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {paymentType === "card" && (
        <div>
          <div style={{ position: "relative" }}>
            <Input
              label="Número do cartão"
              value={cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              placeholder="1234 1234 1234 1234"
              error={cardNumberError}
              style={{
                paddingRight: "50px", // Space for brand icon
              }}
            />
            {/* Card brand indicator */}
            {binData && (
              <div
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  alignItems: "center",
                  fontSize: styles.fontSizeXs,
                  color: styles.textColorMuted,
                  marginTop: "12px", // Account for label
                }}
              >
                {binData.brandImage ? (
                  <img
                    src={binData.brandImage}
                    alt={binData.brandName}
                    style={{
                      width: "32px",
                      height: "20px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <span>{binData.brandName}</span>
                )}
              </div>
            )}
            {isLoadingBin && (
              <div
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: styles.fontSizeXs,
                  color: styles.textColorMuted,
                  marginTop: "12px",
                }}
              >
                Verificando...
              </div>
            )}
          </div>

          <div
            style={{ display: "flex", gap: styles.paddingMd, flexWrap: "wrap" }}
          >
            <Input
              label="Data de validade"
              value={expiryDate}
              onChange={(e) => handleExpiryDateChange(e.target.value)}
              placeholder="MM/AA"
              style={{ flex: 1, minWidth: "150px" }}
              maxLength={5}
            />
            <div style={{ flex: 1, minWidth: "150px", position: "relative" }}>
              <Input
                label={`Código de segurança${
                  binData ? ` (${getMaxLength(binData)} dígitos)` : ""
                }`}
                value={cvc}
                onChange={(e) => handleCvcChange(e.target.value)}
                placeholder={
                  binData ? "•".repeat(getMaxLength(binData)) : "CVV"
                }
                error={cvcError}
                maxLength={getMaxLength(binData)}
              />
            </div>
          </div>

          <Select
            label="País"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            options={[
              { value: "BR", label: "Brasil" },
              { value: "US", label: "Estados Unidos" },
            ]}
          />

          {/* Show card info if available */}
          {binData && (
            <div
              style={{
                padding: styles.paddingMd,
                backgroundColor: "#F0F9FF",
                borderRadius: "8px",
                border: `1px solid #BAE6FD`,
                marginBottom: styles.paddingLg,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: styles.fontSizeBase,
                  color: styles.textColorSecondary,
                  marginBottom: styles.paddingSm,
                }}
              >
                {binData.brandImage && (
                  <img
                    src={binData.brandImage}
                    alt={binData.brandName}
                    style={{
                      width: "32px",
                      height: "20px",
                      objectFit: "contain",
                      marginRight: styles.paddingSm,
                    }}
                  />
                )}
                <span style={{ fontWeight: styles.fontWeightMedium }}>
                  {binData.brandName} detectado
                </span>
              </div>
              <div
                style={{
                  fontSize: styles.fontSizeXs,
                  color: styles.textColorMuted,
                }}
              >
                CVV: {getMaxLength(binData)} dígitos • Comprimento:{" "}
                {getValidLengths(binData).join(" ou ")} dígitos
              </div>
            </div>
          )}

          <p
            style={{
              fontSize: styles.fontSizeXs,
              color: styles.textColorMuted,
              marginBottom: styles.paddingLg,
              lineHeight: 1.6,
              padding: styles.paddingMd,
              backgroundColor: "#F9FAFB",
              borderRadius: "8px",
              border: `1px solid ${styles.borderColor}`,
            }}
          >
            Ao fornecer seus dados de cartão, você permite que Cursor faça a
            cobrança para pagamentos futuros em conformidade com os respectivos
            termos.
            <br />
            <br />
            Você pode examinar informações importantes da Cursor nas páginas de{" "}
            <a href="#" style={{ color: styles.accentColorBlue }}>
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a href="#" style={{ color: styles.accentColorBlue }}>
              Política de Privacidade
            </a>{" "}
            da empresa.
          </p>
          <Button variant="primary" fullWidth onClick={handleAddCard}>
            Adicionar Cartão
          </Button>
        </div>
      )}

      {paymentType === "pix" && (
        <div
          style={{
            textAlign: "center",
            padding: styles.paddingXl,
            border: `2px dashed ${styles.borderColor}`,
            borderRadius: "12px",
            backgroundColor: "#F8FAFF",
          }}
        >
          <PixIcon
            size={64}
            color="#32BCAD"
            style={{ marginBottom: styles.paddingLg }}
          />
          <h3
            style={{
              fontSize: styles.fontSizeLg,
              color: styles.textColorSecondary,
              marginBottom: styles.paddingSm,
            }}
          >
            Pagar com PIX
          </h3>
          <p
            style={{
              color: styles.textColorMuted,
              marginBottom: styles.paddingLg,
              fontSize: styles.fontSizeBase,
              lineHeight: 1.6,
              maxWidth: "400px",
              margin: `0 auto ${styles.paddingLg} auto`,
            }}
          >
            Instruções para pagamento com PIX aparecerão aqui. Após a
            confirmação do pagamento, sua forma de pagamento será atualizada.
          </p>
          <Button
            variant="primary"
            onClick={onAddPix}
            style={{ backgroundColor: "#32BCAD", borderColor: "#32BCAD" }}
          >
            Gerar PIX Copia e Cola
          </Button>
        </div>
      )}

      <Button
        variant="secondary"
        fullWidth
        onClick={onBack}
        style={{ marginTop: styles.paddingLg }}
      >
        Voltar
      </Button>
    </div>
  );
};

const UpdateBillingInfo: React.FC<{
  billingInfo: BillingInformation;
  onSave: (updatedInfo: BillingInformation) => void;
  onCancel: () => void;
}> = ({ billingInfo, onSave, onCancel }) => {
  const [name, setName] = useState(billingInfo.name);
  const [email, setEmail] = useState(billingInfo.email);
  const [country, setCountry] = useState(billingInfo.address.country);
  const [line1, setLine1] = useState(billingInfo.address.line1);
  const [line2, setLine2] = useState(billingInfo.address.line2 || "");
  const [city, setCity] = useState(billingInfo.address.city);
  const [state, setStateVal] = useState(billingInfo.address.state);
  const [postalCode, setPostalCode] = useState(billingInfo.address.postalCode);
  const [phone, setPhone] = useState(billingInfo.phone || "");
  const [fiscalIdType, setFiscalIdType] = useState(
    billingInfo.fiscalId?.type || "CPF"
  );
  const [fiscalIdNumber, setFiscalIdNumber] = useState(
    billingInfo.fiscalId?.number || ""
  );

  const handleSave = () =>
    onSave({
      name,
      email,
      address: { country, line1, line2, city, state, postalCode },
      phone,
      fiscalId: fiscalIdNumber
        ? { type: fiscalIdType, number: fiscalIdNumber }
        : undefined,
    });

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <Breadcrumbs
        items={[
          { label: "Faturamento", onClick: onCancel },
          { label: "Dados de faturamento" },
        ]}
      />

      <h1
        style={{
          fontSize: styles.fontSizePageTitle,
          fontWeight: styles.fontWeightBold,
          color: styles.textColorSecondary,
          marginBottom: styles.paddingLg,
        }}
      >
        Dados de faturamento
      </h1>

      <Input
        label="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        label="E-mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Select
        label="País"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        options={[
          { value: "BR", label: "Brasil" },
          { value: "US", label: "Estados Unidos" },
        ]}
      />

      <Input
        label="Endereço (linha 1)"
        value={line1}
        onChange={(e) => setLine1(e.target.value)}
        placeholder="Rua, avenida, número"
      />
      <Input
        label="Complemento / Bairro (linha 2)"
        value={line2}
        onChange={(e) => setLine2(e.target.value)}
        placeholder="Apartamento, sala, bairro (opcional)"
      />
      <Input
        label="Cidade"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Nome da cidade"
      />

      <div style={{ display: "flex", gap: styles.paddingMd, flexWrap: "wrap" }}>
        <Input
          label="Estado / Província"
          value={state}
          onChange={(e) => setStateVal(e.target.value)}
          style={{ flex: 1, minWidth: "200px" }}
          placeholder="Ex: SP, RJ, GO"
        />
        <Input
          label="CEP / Código Postal"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          style={{ flex: 1, minWidth: "200px" }}
          placeholder="00000-000"
        />
      </div>

      <Input
        label="Telefone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Ex: BR +55 11 99999-9999"
      />

      <label
        style={{
          display: "block",
          marginBottom: styles.paddingSm,
          marginTop: styles.paddingLg,
          fontSize: styles.fontSizeBase,
          color: styles.textColorSecondary,
          fontWeight: styles.fontWeightMedium,
        }}
      >
        Código fiscal
      </label>

      <div
        style={{
          display: "flex",
          gap: styles.paddingMd,
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <Select
          value={fiscalIdType}
          onChange={(e) => setFiscalIdType(e.target.value)}
          options={[
            { value: "CPF", label: "CPF" },
            { value: "CNPJ", label: "CNPJ" },
            { value: "Tax ID", label: "Tax ID (EUA)" },
          ]}
          style={{ flex: 1, marginBottom: 0, minWidth: "150px" }}
        />
        <div style={{ flex: 2, position: "relative", minWidth: "200px" }}>
          <Input
            value={fiscalIdNumber}
            onChange={(e) => setFiscalIdNumber(e.target.value)}
            placeholder="Número"
            style={{ marginBottom: 0 }}
          />
          {(fiscalIdType || fiscalIdNumber) && (
            <button
              onClick={() => {
                setFiscalIdNumber("");
                setFiscalIdType("");
              }}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: styles.textColorMuted,
                fontSize: "18px",
                padding: "4px",
                lineHeight: 1,
                borderRadius: "4px",
                transition: "background-color 0.2s ease-in-out",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#F3F4F6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              ×
            </button>
          )}
        </div>
      </div>

      <Button
        variant="link"
        onClick={() =>
          alert("Funcionalidade 'Adicionar outro ID' não implementada.")
        }
        style={{ marginTop: styles.paddingSm }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <AddIcon style={{ marginRight: "6px" }} />
          Adicionar outro ID
        </div>
      </Button>

      <div
        style={{
          marginTop: styles.paddingXl,
          display: "flex",
          justifyContent: "flex-end",
          gap: styles.paddingMd,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="secondary"
          onClick={onCancel}
          style={{ minWidth: "120px" }}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          style={{ minWidth: "120px" }}
        >
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
};

// --- Available Plans Component ---
const AvailablePlans: React.FC<{
  onBack: () => void;
  onSelectPlan: (planId: string) => void;
}> = ({ onBack, onSelectPlan }) => {
  const { project } = useAuth();

  if (!project?.plan || project.plan.length === 0) {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <h1
          style={{
            fontSize: styles.fontSizePageTitle,
            fontWeight: styles.fontWeightBold,
            color: styles.textColorSecondary,
            marginBottom: styles.paddingLg,
          }}
        >
          Nenhum plano disponível
        </h1>
        <p style={{ color: styles.textColorMuted, marginBottom: styles.paddingXl }}>
          Não há planos disponíveis no momento.
        </p>
        <Button variant="secondary" onClick={onBack}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1
        style={{
          fontSize: styles.fontSizePageTitle,
          fontWeight: styles.fontWeightBold,
          color: styles.textColorSecondary,
          marginBottom: styles.paddingLg,
        }}
      >
        Escolha seu plano
      </h1>

      <p
        style={{
          fontSize: styles.fontSizeBase,
          color: styles.textColorMuted,
          marginBottom: styles.paddingXl,
          lineHeight: 1.6,
        }}
      >
        Selecione o plano que melhor se adequa às suas necessidades.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: styles.paddingLg,
          marginBottom: styles.paddingXl,
        }}
      >
        {project.plan.map((plan) => (
          <div
            key={plan.id}
            style={{
              border: `2px solid ${styles.borderColor}`,
              borderRadius: "12px",
              padding: styles.paddingLg,
              backgroundColor: styles.bgColorSecondary,
              transition: "all 0.2s ease-in-out",
              cursor: "pointer",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = styles.accentColorBlue;
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = styles.borderColor;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {plan.logo_url && (
              <img
                src={plan.logo_url}
                alt={plan.name}
                style={{
                  width: "48px",
                  height: "48px",
                  objectFit: "contain",
                  marginBottom: styles.paddingMd,
                }}
              />
            )}

            <h3
              style={{
                fontSize: styles.fontSizeXl,
                fontWeight: styles.fontWeightSemibold,
                color: styles.textColorSecondary,
                marginBottom: styles.paddingSm,
              }}
            >
              {plan.name}
            </h3>

            {plan.description && (
              <p
                style={{
                  fontSize: styles.fontSizeBase,
                  color: styles.textColorMuted,
                  marginBottom: styles.paddingMd,
                  lineHeight: 1.5,
                }}
              >
                {plan.description}
              </p>
            )}

            {plan.minimum_price && (
              <div style={{ marginBottom: styles.paddingMd }}>
                <div
                  style={{
                    fontSize: styles.fontSize2Xl,
                    fontWeight: styles.fontWeightBold,
                    color: styles.accentColorBlue,
                  }}
                >
                  {Number(plan.minimum_price / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: plan.currency || "BRL",
                  })}
                </div>
                {plan.interval && (
                  <div
                    style={{
                      fontSize: styles.fontSizeBase,
                      color: styles.textColorMuted,
                    }}
                  >
                    por {plan.interval === "month" ? "mês" : 
                         plan.interval === "year" ? "ano" : plan.interval}
                  </div>
                )}
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: styles.paddingSm,
                marginBottom: styles.paddingMd,
              }}
            >
              {plan.interval && (
                <span
                  style={{
                    backgroundColor: "#EBF4FF",
                    color: "#1E40AF",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: styles.fontSizeXs,
                    fontWeight: styles.fontWeightMedium,
                  }}
                >
                  {plan.interval === "month" ? "Mensal" : 
                   plan.interval === "year" ? "Anual" : plan.interval}
                </span>
              )}
              {plan.trial_period_days && plan.trial_period_days > 0 && (
                <span
                  style={{
                    backgroundColor: "#F0FDF4",
                    color: "#15803D",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: styles.fontSizeXs,
                    fontWeight: styles.fontWeightMedium,
                  }}
                >
                  {plan.trial_period_days} dias grátis
                </span>
              )}
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={() => onSelectPlan(plan.id)}
              style={{ marginTop: "auto" }}
            >
              Escolher este plano
            </Button>
          </div>
        ))}
      </div>

      <Button
        variant="secondary"
        onClick={onBack}
        style={{ minWidth: "120px" }}
      >
        ← Voltar
      </Button>
    </div>
  );
};

// --- Subscription Creation Component ---
const CreateSubscription: React.FC<{
  planId: string;
  onBack: () => void;
  onSuccess: () => void;
}> = ({ planId, onBack, onSuccess }) => {
  const { project, user, token } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix">("card");
  const [isCreating, setIsCreating] = useState(false);

  const selectedPlan = project?.plan?.find(p => p.id === planId);

  if (!selectedPlan) {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <h1
          style={{
            fontSize: styles.fontSizePageTitle,
            fontWeight: styles.fontWeightBold,
            color: styles.textColorSecondary,
            marginBottom: styles.paddingLg,
          }}
        >
          Plano não encontrado
        </h1>
        <Button variant="secondary" onClick={onBack}>
          Voltar
        </Button>
      </div>
    );
  }

  const handleCreateSubscription = async () => {
    if (!user || !token) {
      alert("Usuário não autenticado");
      return;
    }

    setIsCreating(true);
    try {
      // This would be the actual API call to create subscription
      // For now, we'll simulate the process
      console.log("Creating subscription for plan:", planId, "with payment method:", paymentMethod);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Assinatura criada com sucesso para o plano ${selectedPlan.name}!`);
      onSuccess();
    } catch (error) {
      console.error("Error creating subscription:", error);
      alert("Erro ao criar assinatura. Tente novamente.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Breadcrumbs
        items={[
          { label: "Planos", onClick: onBack },
          { label: "Finalizar assinatura" },
        ]}
      />

      <h1
        style={{
          fontSize: styles.fontSizePageTitle,
          fontWeight: styles.fontWeightBold,
          color: styles.textColorSecondary,
          marginBottom: styles.paddingLg,
        }}
      >
        Finalizar assinatura
      </h1>

      {/* Plan Summary */}
      <div
        style={{
          border: `1px solid ${styles.borderColor}`,
          borderRadius: "8px",
          padding: styles.paddingLg,
          marginBottom: styles.paddingXl,
          backgroundColor: "#F8FAFF",
        }}
      >
        <h3
          style={{
            fontSize: styles.fontSizeLg,
            fontWeight: styles.fontWeightSemibold,
            color: styles.textColorSecondary,
            marginBottom: styles.paddingSm,
          }}
        >
          {selectedPlan.name}
        </h3>
        {selectedPlan.description && (
          <p
            style={{
              fontSize: styles.fontSizeBase,
              color: styles.textColorMuted,
              marginBottom: styles.paddingMd,
            }}
          >
            {selectedPlan.description}
          </p>
        )}
        {selectedPlan.minimum_price && (
          <div
            style={{
              fontSize: styles.fontSizeXl,
              fontWeight: styles.fontWeightBold,
              color: styles.accentColorBlue,
            }}
          >
            {Number(selectedPlan.minimum_price / 100).toLocaleString("pt-BR", {
              style: "currency",
              currency: selectedPlan.currency || "BRL",
            })}
            {selectedPlan.interval && (
              <span
                style={{
                  fontSize: styles.fontSizeBase,
                  fontWeight: styles.fontWeightNormal,
                  color: styles.textColorMuted,
                }}
              >
                {" "}por {selectedPlan.interval === "month" ? "mês" : 
                         selectedPlan.interval === "year" ? "ano" : selectedPlan.interval}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Payment Method Selection */}
      <Section title="FORMA DE PAGAMENTO">
        <div
          style={{
            display: "flex",
            gap: "2px",
            marginBottom: styles.paddingLg,
            borderBottom: `1px solid ${styles.borderColor}`,
          }}
        >
          {[
            { label: "Cartão de Crédito", type: "card" as "card", icon: <CreditCardIcon style={{ marginRight: "8px" }} /> },
            { label: "PIX", type: "pix" as "pix", icon: <PixIcon style={{ marginRight: "8px" }} /> },
          ].map((item) => (
            <button
              key={item.type}
              onClick={() => setPaymentMethod(item.type)}
              style={{
                padding: `14px ${styles.paddingLg}`,
                border: "none",
                borderBottom:
                  paymentMethod === item.type
                    ? `3px solid ${styles.accentColorBlue}`
                    : "3px solid transparent",
                backgroundColor: "transparent",
                color:
                  paymentMethod === item.type
                    ? styles.accentColorBlue
                    : styles.textColorSecondary,
                cursor: "pointer",
                fontWeight: styles.fontWeightMedium,
                display: "flex",
                alignItems: "center",
                transition: "all 0.2s ease-in-out",
                outline: "none",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {paymentMethod === "card" && (
          <div
            style={{
              padding: styles.paddingLg,
              backgroundColor: "#F9FAFB",
              borderRadius: "8px",
              border: `1px solid ${styles.borderColor}`,
              textAlign: "center",
            }}
          >
            <CreditCardIcon
              style={{
                width: "48px",
                height: "48px",
                color: styles.textColorMuted,
                marginBottom: styles.paddingMd,
              }}
            />
            <p style={{ color: styles.textColorMuted, marginBottom: styles.paddingMd }}>
              Você será redirecionado para uma página segura para inserir os dados do cartão.
            </p>
          </div>
        )}

        {paymentMethod === "pix" && (
          <div
            style={{
              padding: styles.paddingLg,
              backgroundColor: "#F0FDF4",
              borderRadius: "8px",
              border: `1px solid #BBF7D0`,
              textAlign: "center",
            }}
          >
            <PixIcon
              size={48}
              color="#16A34A"
              style={{ marginBottom: styles.paddingMd }}
            />
            <p style={{ color: "#15803D", marginBottom: styles.paddingMd }}>
              Após confirmar, você receberá um código PIX para realizar o pagamento.
            </p>
          </div>
        )}
      </Section>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: styles.paddingMd,
          marginTop: styles.paddingXl,
        }}
      >
        <Button
          variant="secondary"
          onClick={onBack}
          disabled={isCreating}
          style={{ minWidth: "120px" }}
        >
          Voltar
        </Button>
        <Button
          variant="primary"
          onClick={handleCreateSubscription}
          disabled={isCreating}
          style={{ minWidth: "180px" }}
        >
          {isCreating ? "Criando..." : "Confirmar Assinatura"}
        </Button>
      </div>
    </div>
  );
};

// --- InadimplentScreen Component (Subscription Management UI) ---
interface InadimplentScreenProps {
  className?: string;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

type SubscriptionView = "overview" | "addPayment" | "updateBilling" | "availablePlans" | "createSubscription";

export const InadimplentScreen: React.FC<InadimplentScreenProps> = ({
  className = "",
  title = "Gerenciamento de Assinatura",
  description,
  actionText,
  onAction,
}) => {
  const { currentSubscription, project, user, logout } = useAuth();

  const [currentView, setCurrentView] = useState<SubscriptionView>("overview");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Set initial view based on subscription status
  useEffect(() => {
    if (!currentSubscription && project?.plan && project.plan.length > 0) {
      setCurrentView("availablePlans");
    } else {
      setCurrentView("overview");
    }
  }, [currentSubscription, project?.plan]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  // Close mobile sidebar when view changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [currentView]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleAddPaymentMethod = (newMethod: PaymentMethod) => {
    alert(`Método de pagamento adicionado: ${newMethod.type} •••• ${newMethod.last4}`);
    setCurrentView("overview");
  };

  const handleCancelSubscription = () => {
    if (confirm("Tem certeza que deseja cancelar sua assinatura?")) {
      alert("Assinatura cancelada (simulação).");
    }
  };

  const handlePaymentMethodAction = (action: string, paymentMethodId: string) => {
    alert(`Ação "${action}" executada no método de pagamento ${paymentMethodId} (simulação).`);
    setActiveDropdown(null);
  };

  const renderView = () => {
    switch (currentView) {
      case "overview":
        // If no current subscription, show available plans
        if (!currentSubscription) {
          return (
            <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
              <h1
                style={{
                  fontSize: styles.fontSizePageTitle,
                  fontWeight: styles.fontWeightBold,
                  color: styles.textColorSecondary,
                  marginBottom: styles.paddingLg,
                }}
              >
                Bem-vindo!
              </h1>
              <p
                style={{
                  fontSize: styles.fontSizeBase,
                  color: styles.textColorMuted,
                  marginBottom: styles.paddingXl,
                  lineHeight: 1.6,
                }}
              >
                Você ainda não possui uma assinatura ativa. Escolha um plano para começar.
              </p>
              
              {project?.plan && project.plan.length > 0 ? (
                <Button
                  variant="primary"
                  onClick={() => setCurrentView("availablePlans")}
                  style={{ minWidth: "200px" }}
                >
                  Ver Planos Disponíveis
                </Button>
              ) : (
                <p style={{ color: styles.textColorMuted }}>
                  Nenhum plano disponível no momento.
                </p>
              )}
            </div>
          );
        }
        
        return (
          <SubscriptionOverview
            data={{
              billingInfo: {
                address: {
                  line1: "implementar db",
                  line2: "implementar db",
                  city: "implementar db",
                  state: "implementar db",
                  postalCode: "implementar db",
                  country: "implementar db",
                },
                email: user?.email || "",
                name: user?.name || "",
                phone: `${user?.phone_country_code || ""}${
                  user?.phone_area_code || ""
                }${user?.phone_number || ""}`,
                fiscalId: {
                  type: user?.document_type || "",
                  number: user?.document || "",
                },
              },
              currency: currentSubscription?.currency || "",
              interval: currentSubscription?.interval || "",
              planName: currentSubscription?.plan?.name || "",
              price:
                currentSubscription?.items?.[0]?.pricing_scheme.price.toString() ||
                "",
              renewalDate: currentSubscription?.next_billing_at || "",
              paymentMethods: [
                {
                  id: "implementar db",
                  isDefault: false,
                  last4: "implementar db",
                  type: "Visa",
                  expiryMonth: 1,
                  expiryYear: 2025,
                },
              ],
            }}
            onNavigateToAddPayment={() => setCurrentView("addPayment")}
            onNavigateToUpdateBilling={() => setCurrentView("updateBilling")}
            onCancelSubscription={handleCancelSubscription}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            onPaymentMethodAction={handlePaymentMethodAction}
          />
        );
      case "addPayment":
        return (
          <AddPaymentMethod
            onAddCard={handleAddPaymentMethod}
            onAddPix={() => {
              alert(
                "PIX selecionado (simulação). Pagamento pendente de confirmação."
              );
              setCurrentView("overview");
            }}
            onBack={() => setCurrentView("overview")}
          />
        );
      case "updateBilling":
        return (
          <UpdateBillingInfo
            billingInfo={{
              email: "implementar db",
              name: "implementar db",
              address: {
                line1: "implementar db",
                line2: "implementar db",
                city: "implementar db",
                state: "implementar db",
                postalCode: "implementar db",
                country: "implementar db",
              },
              phone: "implementar db",
              fiscalId: {
                type: "implementar db",
                number: "implementar db",
              },
            }}
            onSave={() => {
              alert("Dados de faturamento atualizados (simulação).");
            }}
            onCancel={() => setCurrentView("overview")}
          />
        );
      case "availablePlans":
        return (
          <AvailablePlans
            onBack={() => setCurrentView("overview")}
            onSelectPlan={(planId) => {
              setSelectedPlanId(planId);
              setCurrentView("createSubscription");
            }}
          />
        );
      case "createSubscription":
        return selectedPlanId ? (
          <CreateSubscription
            planId={selectedPlanId}
            onBack={() => setCurrentView("availablePlans")}
            onSuccess={() => {
              setCurrentView("overview");
              // Optionally reload user data here
            }}
          />
        ) : (
          <div>Erro: Nenhum plano selecionado</div>
        );
      default:
        return <div>Visualização desconhecida</div>;
    }
  };

  const effectiveClassName = `inadimplent-screen-container ${className}`.trim();

  const containerStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    fontFamily: styles.fontFamily,
    backgroundColor: styles.bgColorSecondary,
    overflow: "hidden",
  };

  const sidebarStyle: CSSProperties = {
    width: "300px",
    backgroundColor: styles.bgColorPrimary,
    color: styles.textColorPrimary,
    padding: styles.paddingLg,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    boxSizing: "border-box",
    overflowY: "auto",
  };

  const mobileHeaderStyle: CSSProperties = {
    width: "100%",
    backgroundColor: styles.bgColorPrimary,
    color: styles.textColorPrimary,
    padding: styles.paddingLg,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
    height: "70px",
  };

  const contentStyle: CSSProperties = {
    flex: 1,
    width: "100%",
    backgroundColor: styles.bgColorSecondary,
    boxSizing: "border-box",
    overflowY: "auto",
    height: "100%",
    padding: isMobile
      ? `${styles.paddingLg} ${styles.paddingMd}`
      : styles.paddingXl,
    paddingTop: isMobile ? "90px" : styles.paddingXl, // Add space for mobile header
  };

  return (
    <div className={effectiveClassName} style={containerStyle}>
      {/* Mobile Header */}
      {isMobile && (
        <div style={mobileHeaderStyle}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {project?.logo_url && (
              <img
                src={project?.logo_url || ""}
                alt={project?.name}
                style={{
                  width: "40px",
                  borderRadius: "50%",
                }}
              />
            )}
            <span
              style={{
                marginLeft: styles.paddingMd,
                fontSize: styles.fontSizeLg,
                fontWeight: styles.fontWeightMedium,
              }}
            >
              {project?.name}
            </span>
          </div>
          <button
            onClick={() => {
              logout();
            }}
            style={{
              background: "none",
              border: "none",
              color: styles.textColorPrimary,
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              fontSize: styles.fontSizeBase,
              borderRadius: "6px",
              transition: "background-color 0.2s ease-in-out",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <ArrowLeftIcon style={{ marginRight: "6px" }} />
            Sair da sua conta
          </button>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div style={sidebarStyle}>
          <div style={{ marginBottom: styles.paddingXl }}>
            {project?.logo_url && (
              <img
                src={project?.logo_url || ""}
                alt={project?.name}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            )}
          </div>
          <div style={{ flexGrow: 1 }}>
            <h2
              style={{
                fontSize: styles.fontSizeLg,
                fontWeight: styles.fontWeightMedium,
                marginBottom: styles.paddingSm,
              }}
            >
              Precisa de ajuda?
            </h2>
            <p
              style={{
                fontSize: styles.fontSizeBase,
                color: "#A0A0A0",
                marginBottom: styles.paddingSm,
                lineHeight: 1.5,
              }}
            >
              Envie um email para <br />
              <a
                href="mailto:hi@cursor.com"
                style={{ color: "#FFFFFF", textDecoration: "underline" }}
              >
                {project?.creator.email || "hi@cursor.com"}
              </a>
            </p>
            <button
              onClick={() => {
                logout();
              }}
              style={{
                background: "none",
                border: "none",
                color: styles.textColorPrimary,
                cursor: "pointer",
                padding: `${styles.paddingSm} 0`,
                display: "flex",
                alignItems: "center",
                fontSize: styles.fontSizeBase,
                marginTop: styles.paddingXl,
              }}
            >
              <ArrowLeftIcon style={{ marginRight: styles.paddingSm }} />
              Sair da sua conta
            </button>
          </div>
          <div style={{ fontSize: styles.fontSizeXs, color: "#A0A0A0" }}>
            <p style={{ marginBottom: styles.paddingSm }}>
              Powered by{" "}
              <a
                href="#"
                style={{
                  color: "#FFFFFF",
                  fontWeight: styles.fontWeightSemibold,
                  textDecoration: "none",
                }}
              >
                membros
              </a>
            </p>

            <br />
            <a
              href="#"
              style={{
                color: "#A0A0A0",
                marginRight: styles.paddingSm,
                textDecoration: "none",
              }}
            >
              Termos
            </a>
            <span style={{ marginRight: styles.paddingSm }}>·</span>
            <a
              href="#"
              style={{
                color: "#A0A0A0",
                textDecoration: "none",
              }}
            >
              Privacidade
            </a>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div style={contentStyle}>
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          {renderView()}
        </div>
      </div>
    </div>
  );
};
