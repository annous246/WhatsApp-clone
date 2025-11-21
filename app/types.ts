export interface foodType {
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  portion: number;
  id: number;
  servings: number;
}
export interface response {
  ok: number;
  status: number;
  message: string;
  data?: any;
}

export interface PieSlice {
  value: number;
  color: string;
}
