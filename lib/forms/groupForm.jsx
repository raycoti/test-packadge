import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import stateIndex from './usStates.json';
import RaisedButton from 'material-ui/RaisedButton';
import { countries } from './countries';
import ActionGrade from 'material-ui/svg-icons/action/help-outline';

import validate, { validateObject } from './validations'

class GroupForm extends React.Component {
  constructor(props) {
    super()
    this.state = {
      continue: false,
      validations: {
        taxId: false,
        groupName: false,
        formation: {
          state: false
        },
        ira: {
          vestName: false
        }
      },
      blur: {
        taxId: false,
        groupName: false,
        formation: false,
        ira: false,
      },
      errorText: {
        name: 'Required',
      },
      style: {
        form: {
          textAlign: 'center',
        },
      },
      hints: {
        custodian: 'Name of the company at which your IRA is being held',
        company: 'Name of Company',
        trust: 'Name of Trust'
      }
    }
    this.isGroupNameValid = this.isGroupNameValid.bind(this);
    this.isTaxIdValid = this.isTaxIdValid.bind(this);
    this.isVestValid = this.isVestValid.bind(this);
    this.areAllValid = this.areAllValid.bind(this);
    this.isStateValid = this.isStateValid.bind(this);
    this.checkAllValidations = this.checkAllValidations.bind(this);
    this.setBlur = this.setBlur.bind(this);
    this.getHint = this.getHint.bind(this);
  }

  setBlur(field) {
    this.setState({
      blur: {
        ...this.state.blur,
        [field]: true,
      }
    })
  }

  getHint(type) {
    let hint;
    switch (type) {
      case 'IRA/Custodian':
        hint = 'custodian';
        break;
      case 'Trust':
        hint = 'trust'
        break;
      default:
        hint = 'company';
    }
    return this.state.hints[hint];
  }

  componentWillMount() {
    this.checkAllValidations()
  }

  isGroupNameValid(name) {
    const valid = validate('length', name);
    this.setState({
      validations: Object.assign({}, this.state.validations, { groupName: valid })
    }, this.areAllValid)
  }

  isTaxIdValid(id) {
    const valid = validate('length', id);
    this.setState({
      validations: Object.assign({}, this.state.validations, { taxId: valid })
    }, this.areAllValid)
  }

  isVestValid(name) {
    const valid = validate('length', name);
    this.setState({
      validations: Object.assign({}, this.state.validations, {
        ira: Object.assign({}, this.state.validations.ira, {
          vestName: valid,
        })
      }
      )
    }, this.areAllValid)
  }

  isStateValid(state) {
    const valid = state !== null && state !== '';
    this.setState({
      validations: Object.assign({}, this.state.validations, {
        formation: Object.assign({}, this.state.validations.formation, { state: valid })
      })
    }, this.areAllValid)

  }

  areAllValid() {
    const type = this.props.formState.customerType;
    const groupValid = validateObject(this.state.validations);
    let iraValid = true;
    let sofValid = true;
    if (type === 'IRA/Custodian') {
      iraValid = validateObject(this.state.validations.ira)
    }
    else if (this.props.formState.NationalityGroup === 'US') {
      sofValid = validateObject(this.state.validations.formation)
    }
    this.setState({
      continue: groupValid && iraValid && sofValid,
    })
  }

  checkAllValidations() {
    const { groupName, taxID, vestingName, formationState } = this.props.formState;
    const vestValid = validate('length', vestingName)
    const groupNameValid = validate('length', groupName);
    const taxIdValid = validate('length', taxID);
    const formationValid = formationState !== null && formationState !== '';
    this.setState({
      validations: {
        taxId: taxIdValid,
        groupName: groupNameValid,
        ira: {
          vestName: vestValid
        },
        formation: {
          state: formationValid,
        }
      }
    }, this.areAllValid)

  }

  render() {

    const { updateField, formState, styles, onSubmit, onBack } = this.props;
    const { errorStyle, underlineFocusStyle, floatingLabelFocusStyle } = styles;
    const { validations, errorText, style, blur } = this.state;
    const custodian = formState.customerType === 'IRA/Custodian';
    const foriegn = formState.NationalityGroup !== 'US'
    return (
      <form
        style={style.form}
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(formState.customerType);
        }}
      >
        <h3> {formState.customerType} Info </h3>
        <span style={{ display: 'inline-flex', marginBottom: `.7em` }}>
          <TextField
            id="groupName"
            floatingLabelText={`${formState.customerType} name`}
            value={formState.groupName}
            onBlur={() => this.setBlur('groupName')}
            onChange={(e) => { updateField('groupName', e.target.value, this.isGroupNameValid) }}
            errorText={!validations.groupName ? errorText.name : ''}
            errorStyle={blur.groupName ? {} : errorStyle}
            underlineFocusStyle={underlineFocusStyle}
            floatingLabelFocusStyle={floatingLabelFocusStyle}
          />
          <div
            style={{ display: 'inline-flex', marginLeft: '10px', alignItems: 'center' }}
            data-tip={this.getHint(formState.customerType)}
          >
            <ActionGrade />
          </div>
        </span>
        <br />
        {!custodian &&
          <span style={{ display: 'inline-flex', marginBottom: `.7em` }}>
            <SelectField
              id="nationalityGroup"
              onChange={(e, index, value) => { updateField(`NationalityGroup`, value/*, this.isIdentificationValid */) }}
              floatingLabelText="Country"
              style={{ textAlign: 'left' }}
              floatingLabelFixed={true}
              value={formState.NationalityGroup}>
              {countries.map((country) => {
                return (
                  <MenuItem value={country.code} key={country.name} primaryText={country.name} />
                )
              })}
            </SelectField>
            <div
              style={{ display: 'inline-flex', marginLeft: '10px', alignItems: 'center' }}
              data-tip="Country">
              <ActionGrade />
            </div>
          </span>}
        <br />
        {!custodian && !foriegn &&
          <span style={{ display: 'inline-flex', marginBottom: `.7em` }}>
            <SelectField
              id="formationState"
              onChange={(e, index, value) => { updateField(`formationState`, value, this.isStateValid) }}
              floatingLabelText="Formation State"
              style={{ textAlign: 'left' }}
              floatingLabelFixed={true}
              value={formState.formationState}>
              {Object.keys(stateIndex).map((item) => {
                return (
                  <MenuItem value={item} key={item + 'group'} primaryText={item} />
                )
              })}
            </SelectField>
            <ActionGrade style={{ visibility: 'hidden', marginLeft: '10px'}} />
          </span>
        }
        {!custodian && !foriegn && <br />}
        {custodian && <span style={{ display: 'inline-flex', marginBottom: `.7em` }}>
          <TextField
            floatingLabelText="Custodian Account # (optional)"
            value={formState.custodianAccount}
            onChange={(e) => { updateField('custodianAccount', e.target.value) }}
          />
          <ActionGrade style={{ visibility: 'hidden', marginLeft: '10px'}} />
        </span>}
        {custodian && <br />}
        {custodian && <span style={{ display: 'inline-flex', marginBottom: `.7em` }}>
          <TextField
            floatingLabelText="Shareholder Registration Name"
            value={formState.vestingName}
            onChange={(e) => { updateField('vestingName', e.target.value, this.isVestValid) }}
            onBlur={() => this.setBlur('ira')}
            errorText={!validations.ira.vestName ? errorText.name : ''}
            errorStyle={blur.ira ? {} : errorStyle}
            floatingLabelFocusStyle={floatingLabelFocusStyle}
            underlineFocusStyle={underlineFocusStyle}
          />
          <div
            style={{ display: 'inline-flex', marginLeft: '10px', alignItems: 'center' }}
            data-tip="Full vesting name as it appears on the custodian / IRA account (e.g. IRA Services FBO Mary Smith)."
          >
            <ActionGrade />
          </div>
        </span>}
        {custodian && <br />}

        <span style={{ display: 'inline-flex', marginBottom: `1.9em` }}>
          <TextField
            id="taxID"
            floatingLabelText="Tax ID"
            value={formState.taxID}
            onBlur={() => this.setBlur('taxId')}
            onChange={(e) => { updateField('taxID', e.target.value, this.isTaxIdValid) }}
            errorText={!validations.taxId ? errorText.name : ''}
            errorStyle={blur.taxId ? {} : errorStyle}
            floatingLabelFocusStyle={floatingLabelFocusStyle}
            underlineFocusStyle={underlineFocusStyle}
          />
          <ActionGrade style={{ visibility: 'hidden', marginLeft: '10px' }} />
        </span>
        <br />
        <div><RaisedButton label="Back" onClick={() => onBack()} style={{ marginLeft: '10px' }} /><RaisedButton disabled={!this.state.continue} type="submit" label="Next" /></div>
      </form>
    )
  }
}


export default GroupForm;

GroupForm.defaultProps = {
  styles: {
    errorStyle: {},
    underlineFocusStyle: {},
    floatingLabelFocusStyle: {},
  }
}

GroupForm.propTypes = {
  updateField: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  formState: PropTypes.shape({
    taxID: PropTypes.string.isRequired,
    vestingName: PropTypes.string,
    custodianAccount: PropTypes.string,
    formationState: PropTypes.string,
    NationalityGroup: PropTypes.string,
    groupName: PropTypes.string.isRequired,
    customerType: PropTypes.string,
  })
}

//     const { updateField, formState, styles, onSubmit, onBack } = this.props;
