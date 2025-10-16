export interface ResponseType<T = any>{
    success:boolean
    message?:String
    confirm?:boolean
    data?:T
    datasec?:T
    
}
export enum paymentstatus{
    Paid = 'paid',
    Pending = 'pending',
    Parctial = 'partialpaid' ,
    Dept = 'dept'
}  

export enum StockStatus{
  Enough = 'Enough',
  NotEnough = 'NotEnough'

}
export interface DeviationInput< T = any>{
  percentageDisc:number |null
  sales:number
  id:number
  pnum:number,
  CashDiscount:number | null
}
export enum product_type{
    Liquid= "Liquid",
    Solid = "Solid"
}
export enum  category {
  wholesales ="wholesales",
  retailsales= "retailsales"

}
export enum override{
  override = 'Override'
  
}
export enum StockType {
    IN = "IN",
    OUT = "OUT"
}
export enum ChangeType {
    ADD = "add",
    REMOVE = "Removed",
    DELETE = "Delete"
}
export interface SaleSummary {
  p_id: number;
  w_Revenue: number;
  w_Net_profit: number;
  w_Total_pc_pkg_litre: number;
  p_product_name: string;
  product_category: string;
}
export interface MostProfit {
  product_name:string,
  Profit:number
}
interface NormalsaleSummary {
  product_id: number;
  product_name: string;
  product_category: string;
  seller: string;
  total_quantity: string; 
  total_revenue: string;  
  total_profit: string;   
}

export interface DebtRecord {
  debt_id: number;
  total_quantity: string;
  total_revenue: string;
  payment_status: string;
  latest_paid_amount: number;
  debtor_name: string;
  phone_number: string;
  product_name: string;
  updated_at: string;          
  createdat: string;  
  deadlineDate:string         
}