import React from 'react';
import UserForm from '../userForm';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('User form', () => {
  const userState = {
    name: '',
    email: '',
    phone: '',
  }
  const mutableState = { ...userState };
  const onBack = jest.fn();
  const onSubmit = jest.fn();
  const updateField = (jest.fn((field, newValue, cb) => {
    mutableState[field] = newValue;
    typeof cb === 'function' && cb(newValue);

  }))

  describe('uses props', () => {
    const wrapper = shallow(<UserForm
      onBack={onBack}
      onSubmit={onSubmit}
      updateForm={updateField}
      formState={userState}
    />)
    test('user name', () => {
      wrapper.find('[id="userName"]').simulate('change', {
        target: {
          value: 'Display name'
        }
      } )
      expect(wrapper.state('validations').name).toEqual(true);
    })
    test('email', () => {
      wrapper.find('[id="userEmail"]').simulate('change', {
        target: {
          value: 'email@email.com'
        }
      })
      expect(wrapper.state('validations').email).toEqual(true);
    })
    test('phone', () => {
      wrapper.find('[id="userPhone"]').simulate('change', {
        target: {
          value: '1234567891'
        }
      })
      expect(wrapper.state('validations').phone).toEqual(true);
      console.log(mutableState);
      expect(wrapper.state('continue')).toEqual(true);
    })
    test('uses on submit', () => {
      wrapper.find('form').simulate('submit', {
        preventDefault: jest.fn(),
      })
      expect(onSubmit).toBeCalled()
    })
  })
})
