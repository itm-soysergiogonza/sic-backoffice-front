import { CertificateType } from "./certificate.interface";

export interface Template {
  id: number;
  name: string;
  content: string;
  certificateType: CertificateType;
}
