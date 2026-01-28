
export interface AnalysisResult {
  isFake: boolean;
  confidence: number;
  reasoning: string[];
  forensicDetails: {
    artifactDetection: string;
    lightingInconsistency: string;
    aiSignature: string;
  };
  searchFound: boolean;
  searchSources: Array<{ title: string; uri: string }>;
  verdict: 'AUTÉNTICO' | 'SOSPECHOSO' | 'MANIPULADO' | 'IA_GENERADO';
  highPrecision?: boolean;
}

export interface MediaFile {
  file: File | null;
  previewUrl: string | null;
  type: 'image' | 'video' | 'link' | null;
  link?: string;
}
