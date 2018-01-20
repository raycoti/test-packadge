/* validate: returns bool whether an input is valid or not
 *  @params {string} field - type of validation you want to do
 * @params {string} input - the user input you are validating
 
 */
/* eslint-disable */
/* should break this up into other files with switches based on type
case user:
  validateUser() */
  const validate = (field, input) => {
    switch (field){
      case 'ssn':
        let tooLong = false;
        const noBreaks = !input.includes(' ') && !input.includes('-');
        if(noBreaks){ tooLong = input.length > 9}
        return /^((?!219-09-9999|078-05-1120)(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4})|((?!219 09 9999|078 05 1120)(?!666|000|9\d{2})\d{3} (?!00)\d{2} (?!0{4})\d{4})|((?!219099999|078051120)(?!666|000|9\d{2})\d{3}(?!00)\d{2}(?!0{4})\d{4})$/.test(input) && !tooLong;
      case 'returning-ssn':
        return input.length > 4 && input.includes('xxxx');
      case 'length':
        return input.replace(/\s/g,'').length > 4;
      case 'dob':
        return /^\d{4}-\d{2}-\d{2}$/.test(input);
      case 'zip':
          return  /^\d{5}(?:[-\s]\d{4})?$/.test(input);
      case 'routing':
        return /^((0[0-9])|(1[0-2])|(2[1-9])|(3[0-2])|(6[1-9])|(7[0-2])|80)([0-9]{7})$/.test(input);
      case 'email':
        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(input);
      case 'shares':
        return /^(\d+|\d{1,3}(,\d{3})*)(\.\d+)?$/.test(input);
      // case 'account':
      //   return /^[1-9]\d*?$/.test(input)
      case 'price':
        return /^\$?[0-9]+(\.[0-9][0-9])?$/.test(input);      
      case 'numbers':
        return /^\d+$/.test(input) && input.length > 9;
      case 'isNum':
        return /^\d+$/.test(input);
      case 'noNum':
        return /^([^0-9]*)$/.test(input);
      case 'account':
        return (/^[0-9]+(-[0-9]+)+$/.test(input) && input.length > 5) || (/^[1-9]\d*?$/.test(input)  && input.length > 5);
      default:
        return false;
    }
  }
  
  /* validate: returns bool whether an validation object has all of its properties set to true. Object.values is not supported by all browsers
   *  @params {object} obj - object with {key, value} pair where key is type of validation and value is a bool
   * @params {string} input - the user input you are validating
   
   */
  export const validateObject = (obj) => {
    return !Object.keys(obj).map(key => obj[key]).includes(false);
  }
  
  export default validate;
  