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
    Parctial = 'partialpaid' 
}  

export enum StockStatus{
  Enough = 'Enough',
  NotEnough = 'NotEnough'

}
export interface DeviationInput< T = any>{
  percentageDisc?:number
  sales:number
  id:number
}