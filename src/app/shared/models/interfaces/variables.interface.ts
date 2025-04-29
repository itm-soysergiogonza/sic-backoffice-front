import { CertificateType } from "./certificate.interface";

export interface Variable {
  id: number;
  context?: string;
  sql?: string;
  certificateTypeId?: number;
  variables?: [
    nombre: string,
    documento: string
  ],
  parameters?: [
    documento: string
  ],
  list?: boolean;
  certificateType?: CertificateType
}
