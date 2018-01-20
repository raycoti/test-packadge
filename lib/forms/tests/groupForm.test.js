import React from 'react';
import GroupForm from '../groupForm';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Group form', () => {
  const groupFormState = {
    taxID: '',
    vestingName: '',
    custodianAccount: '',
    formationState: '',
    NationalityGroup: 'US',
    groupName: '',
    customerType: 'company',
  }

  const mutableState = {
    ...groupFormState,
  }

  const onSubmit = jest.fn();
  const onBack = jest.fn();

  const onUpdate = jest.fn((field, newVal, func) => {
    mutableState[field] = newVal;
    typeof func === 'function' && func(newVal);
  })

  describe('Uses props', () => {
    const wrapper = shallow(
      <GroupForm
        updateField={onUpdate}
        onSubmit={onSubmit}
        onBack={onBack}
        formState={groupFormState}
      />
    )
    test('invokes onBack prop', () => {
      wrapper.find('[label="Back"]').simulate('click');
      expect(onBack).toBeCalled()
    })

    test('invokes on submit', () => {
      wrapper.find('form').simulate('submit', {
        preventDefault: jest.fn(),
      });
      expect(onSubmit).toBeCalled()
    })

  })

  describe('Validation flow', () => {
    // let testInput;
    // beforeAll(() => {
    const  testInput = {
        taxID: '12345678',
        // vestingName: '',
        // custodianAccount: '',
        formationState: 'IL',
        NationalityGroup: 'US',
        groupName: 'test group',
      }
    // })

    const wrapper = shallow(
      <GroupForm
        updateField={onUpdate}
        onSubmit={onSubmit}
        onBack={onBack}
        formState={groupFormState}
      />
    )
    wrapper.find('[id="groupName"]').simulate('change', {
      target: {
        value: testInput.groupName,
      }
    })
    test('group name', () => {
      expect(wrapper.state('validations').groupName).toEqual(true);
    })

    wrapper.find('[id="nationalityGroup"]').simulate('change', {}, 1, testInput.NationalityGroup)
    wrapper.find('[id="taxID"]').simulate('change', {
      target: {
        value: testInput.taxID
      }
    })

    test('tax id', () => {
      expect(wrapper.state('validations').taxId).toEqual(true)
    })

    wrapper.find('[id="formationState"]').simulate('change', {}, 1, 'IL')
    test('formationState', () => {
      expect(wrapper.state('validations').formation.state).toEqual(true);
    })

    test('can continue after all validated', () => {
      expect(wrapper.state('continue')).toEqual(true);
      expect(mutableState).toEqual({...groupFormState, ...testInput})
    })

  })

  describe('checks validations on mount', () => {
    const valid = {
      taxID: '12345678',
      vestingName: '',
      custodianAccount: '',
      customerType: 'company',
      formationState: 'IL',
      NationalityGroup: 'US',
      groupName: 'test group',
    }

    const wrapper = shallow(
      <GroupForm
        updateField={onUpdate}
        onSubmit={onSubmit}
        onBack={onBack}
        formState={valid}
       />
    )
    test('can continue on mount', () => {
      expect(wrapper.state('continue')).toEqual(true);
    })
  })

})
