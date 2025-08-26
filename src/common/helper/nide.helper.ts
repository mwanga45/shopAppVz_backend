export function validateNidaNumber(nida: string): { Isvalid: boolean; reason?: string }{
//   if (/^(\d{8})-(\d{5})-(\d{5})-(\d{2})$/.test(nida)){
//     return {Isvalid:false , reason:"Nida number is not valid"}
//   }
//   const dob =  nida.substring(0,9);
//   const  year = dob.substring((0,5),10)   

const nidaregx = /^(\d{8})-(\d{5})-(\d{5})-(\d{2})$/
const match = nida.match(nidaregx)
if(!Math){
    return {Isvalid:false , reason:'invalid format'}
}
const year = parseInt(nida.substring(0,5),10)
const month = parseInt(nida.substring(5,7),10)
const day = parseInt(nida.substring(7,9),10)

const date = new Date(year,month-1,day)
if(
    date.getDay()!== day ||
    date.getMonth() +1 !== month||
    date.getDay() !== day
){
    return {Isvalid:false, reason:"invalid nida number"}
}

}