import React from 'react';
import AddressForm from '../addressForm';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('address form', () => {
  const addressFormState = {
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  }
  const mutableFormState = {
    ...addressFormState,
  }
  const onBack = jest.fn();

  const onUpdate = jest.fn((field, newVal, func) => {
    mutableFormState[field] = newVal;
    return func(newVal)
  });

  describe('Uses function props', () => {
    const wrapper = shallow(
      <AddressForm
        formState={addressFormState}
        onBack={onBack}
        smartyOff={true}
        updateField={onUpdate}
      />)
    test('calls onback passed in', () => {
      wrapper.find('[label="Back"]').simulate('click')
      expect(onBack).toBeCalled();
    })

    test('calls onUpdate passed in', () => {
      wrapper.find('[id="StreetAddress1"]').simulate('change', {
        target: {
          value: '123 street address'
        }
      })
      wrapper.update();
      expect(onUpdate).toHaveBeenCalled();
      expect(wrapper.state('validations').address).toEqual(true);
    })
  })

  describe('Validation tests', () => {
    const wrapper = shallow(
      <AddressForm
        formState={addressFormState}
        onBack={onBack}
        smartyOff={true}
        updateField={onUpdate}
      />)
    wrapper.find('[id="City"]').simulate('change', {
      target: {
        value: 'Test City'
      }
    })
    test('city is valid', () => {
      expect(wrapper.state('validations').city).toEqual(true)
    })

    wrapper.find('[id="State"]').simulate('change', {
      target: {
        // value: 'IL'
      }
    }, 1, 'IL')
    test('geo state is valid', () => {
      expect(wrapper.state('validations').state).toEqual(true)
    })

    wrapper.find('[id="PostalCode"]').simulate('change', {
      target: {
        value: '12345'
      }
    })
    test('zipcode is valid', () => {
      expect(wrapper.state('validations').zip).toEqual(true)
    })

    test('can continue', () => {
      wrapper.find('[id="StreetAddress1"]').simulate('change', {
        target: {
          value: '123 test street'
        }
      })
      wrapper.update();
      expect(wrapper.state('continue')).toEqual(true)
      expect(mutableFormState).toEqual({
        address1: '123 test street',
        address2: '',
        city: 'Test City',
        state: 'IL',
        zip: '12345',
        country: 'US'
      })
    })

    test('cannot continue when invalid field is inputted', () => {
      wrapper.find('[id="StreetAddress1"]').simulate('change', {
        target: {
          value: 'srt'
        }
      })
      wrapper.update();
      expect(wrapper.state('continue')).toEqual(false)
    })
  })

  describe('Validates on mount', () => {
    
    test('valid form state is validated on load', () => {
      const validatedForm = {
        address1: '123 main street',
        address2: '',
        city: 'Test City',
        state: 'IL',
        zip: '12121',
        country: 'US',
      }
      const wrapper = shallow(
        <AddressForm
          formState={validatedForm}
          onBack={onBack}
          smartyOff={true}
          updateField={onUpdate}
        />)
      expect(wrapper.state('continue')).toEqual(true)
    })
    
    test('valid form state is validated on load', () => {
      const validatedForm = {
        address1: '123 main street',
        address2: '',
        city: 'Test City',
        state: 'IL',
        zip: '',
        country: 'US',
      }
      const wrapper = shallow(
        <AddressForm
          formState={validatedForm}
          onBack={onBack}
          smartyOff={true}
          updateField={onUpdate}
        />)
      expect(wrapper.state('continue')).toEqual(false)
      expect(wrapper.state('validations').zip).toEqual(false)
    })
  })
})
