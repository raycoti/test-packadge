import validate, {validateObject} from '../validations'

describe('test SSN validation', () => {
  test('Invalid when wrong length', () => {
    const inputShort = '12345'
    const inputLong = '1234567891234567';
    expect(validate('ssn', inputShort)).toBe(false);
    expect(validate('ssn', inputLong)).toBe(false)
  })

  test('Invalid when right length & non-num char', () => {
    const input = '1112233B3';
    expect(validate('ssn', input)).toBe(false)
  })
  
})

describe('email validation test', () => {
  test('Invalid', () => {
    const inputString = 'email.com';
    const input2 = 'myemail@myemail@email.com';
    expect(validate('email', inputString)).toEqual(false);
    expect(validate('email', input2)).toEqual(false);

  })
  test('valid inputs', ()=>{
    const input = 'email@email.com';
    expect(validate('email', input)).toEqual(true)
  })
})

describe('test share validation', () => {
  test('Invalid',() => {
    const input = 'abcdedf';
    expect(validate('shares', input)).toEqual(false);
  })
  test('valid', ()=> {
    const input = '1000';
    const input2 = '123123';
    const input3 = '1';
    expect(validate('shares', input)).toEqual(true);
    expect(validate('shares', input2)).toEqual(true);
    expect(validate('shares', input3)).toEqual(true);
  })
})

describe('test price validation', () => {
  test('Invalid',() => {
    const input = '$20.1';
    const input2 = '$$20.00';
    expect(validate('price', input)).toEqual(false);
    expect(validate('price', input2)).toEqual(false);
  })
  test('valid', ()=> {
    const input = '$20.11';
    const input2 = '20.11';
    const input3 = '1000';
    expect(validate('price', input)).toEqual(true);
    expect(validate('price', input2)).toEqual(true);
    expect(validate('price', input3)).toEqual(true);
  })
})

describe('test validate Object function', () => {
  test('Fails with one field not validated', () => {
    const validations = {
      testing: true,
      coding: true,
      failing: false,
    }
    expect(validateObject(validations)).toBe(false);
  })

  test('Returns true when all fields are validated', () => {
    const validations = {
      testing: true,
      coding: true,
      passing: true,
    }
    expect(validateObject(validations)).toBe(true);
  })

  test('ignores optional validations', () => {
    const validations = {
      testing: true,
      coding: {
        noBugs: false,
      }
    }
    expect(validateObject(validations)).toBe(true)
    expect(validateObject(validations.coding)).toBe(false)
  })

})