export type Operator = '+' | '-' | '*' | '/';

export interface CalculateRequest {
  num1: number;
  operator: Operator;
  num2: number;
}

export interface CalculateResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    result: number;
    cached: boolean;
  };
}

export interface HistoryItem {
  id: number;
  num1: number;
  num2: number;
  operator: Operator;
  result: number;
  created_at: string;
  updated_at: string;
}

export interface HistoryResponse {
  success: boolean;
  message: string | null;
  data: {
    count: number;
    operations: HistoryItem[];
  };
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface HealthResponse {
  status: string;
  message: string;
}
