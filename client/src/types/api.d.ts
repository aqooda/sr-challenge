export interface ValidationResponse {
  email: EmailValidationResult | null;
  phone: PhoneValidationResult | null;
}

export interface PhoneValidationResult {
  valid: boolean;
  number: string;
  local_format: string;
  international_format: string;
  country_prefix: string;
  country_code: string;
  country_name: string;
  location: string;
  carrier: string;
  line_type: string;
}

export interface EmailValidationResult {
  email: string;
  did_you_mean: string;
  user: string;
  domain: string;
  format_valid: boolean;
  mx_found: boolean;
  smtp_check: boolean;
  catch_all: boolean;
  role: boolean;
  disposable: boolean;
  free: boolean;
  score: number;
}
