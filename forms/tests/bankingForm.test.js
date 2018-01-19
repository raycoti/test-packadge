import React from 'react';
import BankingForm from '../bankingForm';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Banking form', () => {
  const bankingState = {
    accountType: 'Bank Account',
    bankName: '',
    bankAddress: '',
    bankingType: 'Checking',
    checkType: 'Personal',
    accountHolderName: '',
    routing: '',
    bankAccount: '',
  }
  const mutableState = { ...bankingState }
  const onBack = jest.fn();
  const onSubmit = jest.fn();
  const updateField = (jest.fn((field, newValue, cb) => {
    mutableState[field] = newValue;
    typeof cb === 'function' && cb(newValue);
  }))

  describe('uses props', () => {
    const wrapper = shallow(<BankingForm
      onBack={onBack}
      onBankSubmit={onSubmit}
      updateField={updateField}
      formState={bankingState}
    />)
    test('uses onBack', () => {
      wrapper.find('[label="Back"]').simulate('click')
      expect(onBack).toBeCalled();
    })
    test('uses on submit', () => {
      wrapper.find('form').simulate('submit', {
        preventDefault: jest.fn(),
      })
      expect(onSubmit).toBeCalled()
    })
  })

  describe('validation flow', () => {
    const expected = {
      accountType: 'Bank Account',
      bankName: 'Test bank',
      bankAddress: '',
      bankingType: 'Checking',
      checkType: 'Personal',
      accountHolderName: 'Tester name',
      routing: '123456789',
      bankAccount: '987654321',
    }
    const wrapper = shallow(<BankingForm
      onBack={onBack}
      onBankSubmit={onSubmit}
      updateField={updateField}
      formState={mutableState}
    />)
    
    wrapper.find('[id="bankName"]').simulate('change', {
      target: {
        value: 'Test bank'
      }
    })
    test('bank name', () => {
      expect(wrapper.state('validations').bankName).toEqual(true)
    })

    wrapper.find('[id="holderName"]').simulate('change', {
      target: {
        value: 'Tester name'
      }
    })
    test('accountname', () => {
      expect(wrapper.state('validations').name).toEqual(true);
    })

    wrapper.find('[id="routing"]').simulate('change', {
      target: {
        value: '123456789'
      }
    })
    test('routing', () => {
      expect(wrapper.state('validations').routing).toEqual(true);
    })

    wrapper.find('[id="accountNumber"]').simulate('change', {
      target: {
        value: '987654321'
      }
    })
    test('account number', () => {
      expect(wrapper.state('validations').accountNumber).toEqual(true)
    })

    wrapper.find('[id="verifyAccount"]').simulate('change', {
      target: {
        value: '987654321'
      }
    })

    test('account number', () => {
      expect(wrapper.state('validations').confirmAccount).toEqual(true)
    })

    test('can continue', () => {
      expect(wrapper.state('continue')).toEqual(true)
      expect(mutableState).toEqual({...bankingState, ...expected})
    })
  })

  describe('validations on mount', () => {
    const valid = {
      accountType: 'Bank Account',
      bankName: 'Test bank',
      bankAddress: '',
      bankingType: 'Checking',
      checkType: 'Personal',
      accountHolderName: 'Tester name',
      routing: '123456789',
      bankAccount: '987654321',
    }
    const wrapper = shallow(<BankingForm
      onBack={onBack}
      onBankSubmit={onSubmit}
      updateField={updateField}
      formState={valid}
    />)

    test('can continue without updating fields', () => {
      expect(wrapper.state('continue')).toEqual(true);
    })
    
  })

})