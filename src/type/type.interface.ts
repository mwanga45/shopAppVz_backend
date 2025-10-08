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