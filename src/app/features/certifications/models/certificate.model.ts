export type CertificateCategory = 'Académico' | 'Administrativo' | 'Estudiantil' | 'Financiero';
export type OutputFormat = 'PDF' | 'Digital' | 'Imprimible';
export type CertificateStatus = 'Pendiente' | 'En Proceso' | 'Completado' | 'Rechazado';

export interface Certificate {
  id: string;
  name: string;
  category: CertificateCategory;
  purpose: string;
  outputFormat: OutputFormat;
  status: CertificateStatus;
  createdAt: string;
  updatedAt: string;
} 