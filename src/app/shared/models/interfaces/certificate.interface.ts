export interface CertificateType {
  id: number;
  name: string;
  paid: boolean;
  price: number;

  purpose?: string;
}

export type FieldType =
  | 'TEXT'
  | 'EMAIL'
  | 'SELECT_SINGLE'
  | 'SELECT_MULTIPLE'
  | 'DATE'
  | 'DATE_RANGE'
  | 'NUMBER';

export interface FieldOption {
  value: string;
  label: string;
}

export interface CertificateField {
  id: number;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: FieldOption[];
  minLength?: string;
  maxLength?: string;
  minValue?: string;
  maxValue?: string;
  certificateType?: CertificateType;
  certificateTypeId: CertificateType | number;
}

export interface CertificateTypeEvent {
  id?: number;
  label: string;
  value: CertificateType;
}

export type CompareWithCertificateType = (
  item: CertificateTypeEvent,
  selected: CertificateType,
) => boolean;

