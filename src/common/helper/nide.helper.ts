
export class NidaValidate{
static  validateNidaNumber(nida: string): { Isvalid: boolean; reason?: string } {
    const nidaregx = /^(\d{8})-(\d{5})-(\d{5})-(\d{2})$/;
    const match = nida.match(nidaregx);
    if (!match) {
        return { Isvalid: false, reason: 'invalid format Nida number' };
    }
    const year = parseInt(match[1].substring(0, 4), 10);
    const month = parseInt(match[1].substring(4, 6), 10);
    const day = parseInt(match[1].substring(6, 8), 10);
    const date = new Date(year, month - 1, day);
    if (
        date.getFullYear() !== year ||
        date.getMonth() + 1 !== month ||
        date.getDate() !== day
    ) {
        return { Isvalid: false, reason: 'invalid nida number' };
    }
    return { Isvalid: true };
}
}