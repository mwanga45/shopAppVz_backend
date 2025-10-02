export interface ResponseType<T = any>{
    success:boolean
    message?:String
    data?:T
}