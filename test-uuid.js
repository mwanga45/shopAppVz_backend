const { v4: uuidv4 } = require('uuid');

console.log('Testing UUID generation:');
console.log('Generated UUID:', uuidv4());
console.log('Your UUID:', '3354e859-f884-47d1-9bdc-2d3149431618');

// Test if your UUID is valid
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isValid = uuidRegex.test('3354e859-f884-47d1-9bdc-2d3149431618');
console.log('Your UUID is valid:', isValid);
