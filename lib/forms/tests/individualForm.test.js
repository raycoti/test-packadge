import React from 'react';
import IndividualForm from '../individualForm';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Individual form', () => {
  const individualFormState = {
    legalName: '',
    Nationality: '',
    SSN: '',
    DOB: '',
  }
  const mutableFormState = {
    ...individualFormState
  }

  const onSubmit = jest.fn();

  const onUpdate = jest.fn((field, newVal, func) => {
    mutableFormState[field] = newVal;
    return func(newVal)
  });
  describe('Uses function props', () => {
    const wrapper = shallow(
      <IndividualForm
        onSubmit={onSubmit}
        updateField={onUpdate}
        formState={individualFormState}
      />
    )
    test('invokes onsubmit when clicking submit button', () => {
      wrapper.find('form').simulate('submit', {
        preventDefault: jest.fn()
      });
      expect(onSubmit).toBeCalled()
    })
  })

  describe('Validation tests', () => {
    let testInput;
    beforeAll(() => {
      testInput = {
        legalName: 'Tester name',
        DOB: '1994-11-24',
        SSN: '111111111',
        Nationality: 'US',
      }
    })
    const wrapper = shallow(
      <IndividualForm
        onSubmit={onSubmit}
        updateField={onUpdate}
        formState={individualFormState}
      />
    )
    const initialValidations = { ...wrapper.state('validations') };
    wrapper.find('[id="legalName"]').simulate('change', {
      target: {
        value: 'Tester name'
      }
    })

    test('name is valid', () => {
      expect(initialValidations.name).toEqual(false)
      expect(wrapper.state('validations').name).toEqual(true)
    })

    wrapper.find('[id="nationality"]').simulate('change', {
      //empty event object
    }, 1, 'US')
    wrapper.find('[id="identification"]').simulate('change', {
      target: {
        value: '111111111'
      }
    })

    test('identification is valid', () => {
      expect(initialValidations.ssn).toEqual(false)
      expect(wrapper.state('validations').ssn).toEqual(true);
    })

    const testDateObject = new Date('1994', '10', '24');

    wrapper.find('[id="dob"]').simulate('change', {}, testDateObject)
    test('dob is valid', () => {
      expect(initialValidations.dob).toEqual(false)
      expect(wrapper.state('validations').dob).toEqual(true);
    })

    test('can continue', () => {
      expect(wrapper.state('continue')).toEqual(true);
      expect(mutableFormState).toEqual(testInput)
    })
  })
  //onback updatefieldb
})
