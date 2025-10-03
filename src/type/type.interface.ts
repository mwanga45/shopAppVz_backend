export interface ResponseType<T = any>{
    success:boolean
    message?:String
    confirm?:boolean
    data?:T
    
}