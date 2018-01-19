import React from 'react';
import PropTypes from 'prop-types';
import validate, { validateObject } from './validations'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ActionGrade from 'material-ui/svg-icons/action/help-outline';

class BankingForm extends React.Component {
  constructor() {
    super();
    this.state = {
      continue: false,
      match: '',
      validations: {
        bankName: false,
        routing: false,
        name: false,
        accountNumber: false,
        confirmAccount: false,
        address: false,
      },
      blur: {
        bankName: false,
        routing: false,
        name: false,
        accountNumber: false,
        confirmAccount: false,
        address: false,
      },
      errorText: {
        required: 'Required',
        match: 'Does not match',
      },
      hintText: {
        required: 'XXXXXXXX',
      },
      style: {
        form: {
          textAlign: 'center',
        },
        radioGroup: {
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        },
        radioButton: {
          display: 'inline-block',
          width: 'auto',
        }
      },
    }
    this.isBankNameValid = this.isBankNameValid.bind(this);
    this.isBankAddressValid = this.isBankAddressValid.bind(this);
    this.isRoutingValid = this.isRoutingValid.bind(this);
    this.isAccountNumberValid = this.isAccountNumberValid.bind(this);
    this.updateMatch = this.updateMatch.bind(this);
    this.doesConfirmMatch = this.doesConfirmMatch.bind(this);
    this.areAllValid = this.areAllValid.bind(this);
    this.checkAllValidations = this.checkAllValidations.bind(this);
    this.setBlur = this.setBlur.bind(this);
    this.isAccountNameValid = this.isAccountNameValid.bind(this);

  }

  componentDidMount() {
    if (this.props.accountHolderName) {
      this.props.updateField('accountHolderName', this.props.accountHolderName, this.checkAllValidations);
    }
    else {
      this.checkAllValidations()
    }
  }
  setBlur(field) {
    this.setState({
      blur: {
        ...this.state.blur,
        [field]: true,
      }
    })
  }

  isBankNameValid(bankName) {
    const valid = validate('length', bankName);
    this.setState({
      validations: { ...this.state.validations, bankName: valid }
    }, this.areAllValid)
  }

  isAccountNameValid(name) {
    const valid = name.length > 3 && validate('noNum', name);
    this.setState({
      validations: { ...this.state.validations, name: valid }
    }, this.areAllValid)
  }

  isRoutingValid(routing) {
    const valid = validate('routing', routing);
    this.setState({
      validations: { ...this.state.validations, routing: valid }
    }, this.areAllValid)
  }

  isAccountNumberValid(accNum) {
    const valid = validate('account', accNum);
    this.setState({
      validations: { ...this.state.validations, accountNumber: valid }
    }, this.doesConfirmMatch)
  }

  updateMatch(match) {
    this.setState({
      match: match
    }, this.doesConfirmMatch)
  }

  doesConfirmMatch() {
    const valid = this.props.formState.bankAccount === this.state.match;
    this.setState({
      validations: { ...this.state.validations, confirmAccount: valid }
    }, this.areAllValid)
  }

  isBankAddressValid(bankAddress) {
    const valid = validate('length', bankAddress)
    this.setState({
      validations: { ...this.state.validations, address: valid }
    }, this.areAllValid)
  }

  areAllValid() {
    let canContinue = false;
    if (this.props.formState.accountType === 'Bank Account') {
      canContinue = validateObject({ ...this.state.validations, address: true })
    }
    else {
      canContinue = validateObject(this.state.validations);
    }
    this.setState({
      continue: canContinue,
    })
  }

  checkAllValidations() {
    const { bankName, routing, bankAccount, accountHolderName } = this.props.formState;
    const bankNameValid = validate('length', bankName);
    const bankAccountValid = validate('account', bankAccount);
    const isNameValid = validate('noNum', accountHolderName) && validate('length', accountHolderName)
    const routingValid = validate('routing', routing);
    const addressValid = validate('length', bankName);

    this.setState({
      validations: {
        bankName: bankNameValid,
        routing: routingValid,
        accountNumber: bankAccountValid,
        address: addressValid,
        name: isNameValid,
      }
    }, this.areAllValid)

  }

  render() {
    /*eslint complexity: 0 */
    const { onBack, onBankSubmit, updateField, formState, styles, authIds } = this.props;
    const { floatingLabelFocusStyle, underlineFocusStyle, errorStyle, underlineStyle } = styles;
    const { validations, blur, errorText } = this.state;
    const bank = formState.accountType === 'Bank Account';
    const hideCheckType = formState.bankingType === 'Savings' ? 'hidden' : 'visible';
    return (
      <form
        style={{ textAlign: 'center' }}
        onSubmit={(event) => {
          event.preventDefault();
          onBankSubmit(formState, authIds);
        }}
      >
        <RadioButtonGroup
          name="bankInfo"
          valueSelected={formState.accountType}
          onChange={(e) => { updateField('accountType', e.target.value, this.areAllValid) }}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
          <RadioButton value="Bank Account" label="Bank" style={{ display: 'inline-block', width: 'auto' }} />{/* initialize value of radio button? */}
          <RadioButton value="Wire" label="Wire" style={{ display: 'inline-block', width: 'auto' }} />
        </RadioButtonGroup>
        <Divider />
        <br />
        <span style={{ display: 'inline-flex', marginBottom: `.7em` }}>
          <TextField
            id="bankName"
            floatingLabelText="Name of Bank"
            onBlur={() => this.setBlur('bankName')}
            onChange={(e) => { updateField('bankName', e.target.value, this.isBankNameValid) }}
            errorText={!validations.bankName ? errorText.required : ''}
            value={formState.bankName}
            floatingLabelFocusStyle={floatingLabelFocusStyle}
            underlineFocusStyle={underlineFocusStyle}
            errorStyle={blur.bankName ? {} : errorStyle}
          />
          <div
            style={{ display: 'inline-flex', visibility: 'hidden', marginLeft: '10px', alignItems: 'center' }}
            data-tip=''>
            <ActionGrade />
          </div>
        </span>
        <br />
        {!bank && <span style={{ display: 'inline-flex', marginBottom: `.7em` }}>
          <TextField
            floatingLabelText="Bank Address"
            onBlur={() => this.setBlur('address')}
            onChange={(e) => { updateField('bankAddress', e.target.value, this.isBankAddressValid) }}
            value={formState.bankAddress}
            underlineStyle={underlineStyle}
            errorText={!validations.address ? errorText.required : ''}
            errorStyle={blur.address ? {} : errorStyle}
            floatingLabelFocusStyle={floatingLabelFocusStyle}
            underlineFocusStyle={underlineFocusStyle}
          />
          <div
            style={{ display: 'inline-flex', visibility: 'hidden', marginLeft: '10px', alignItems: 'center' }}
            data-tip=''>
            <ActionGrade />
          </div>
        </span>
        }
        {!bank && <br />}
        {bank &&
          <span style={{ display: 'inline-flex', marginBottom: `.7em` }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>

              <SelectField
                onChange={(e, index, value) => { updateField('bankingType', value) }}
                floatingLabelText="Account Type"
                style={{ 'textAlign': 'left', width: 125 }}
                floatingLabelFixed={true}
                value={formState.bankingType}>

                <MenuItem value={'Checking'} key={'Checking'} primaryText={'Checking'} />
                <MenuItem value={'Savings'} key={'Savings'} primaryText={'Savings'} />

              </SelectField>

              <SelectField
                onChange={(e, index, value) => { updateField('checkType', value) }}
                floatingLabelText="Check Type"
                style={{ 'textAlign': 'left', width: 125, visibility: hideCheckType }}
                floatingLabelFixed={true}
                value={formState.checkType}>

                <MenuItem value={'Personal'} key={'Personal'} primaryText={'Personal'} />
                <MenuItem value={'Business'} key={'Business'} primaryText={'Business'} />
              </SelectField>
            </div>
            <div
              style={{ display: 'inline-flex', visibility: 'hidden', marginLeft: '10px', alignItems: 'center' }}
              data-tip=''>
              <ActionGrade />
            </div>
          </span>
        }
        {bank && <br />}
        <span style={{ display: 'inline-flex', marginBottom: `.7em` }}>
          <TextField
            id="holderName"
            floatingLabelText="Account Holder Name"
            value={formState.accountHolderName}
            floatingLabelFixed={true}
            onBlur={() => this.setBlur('name')}
            errorText={!validations.name ? errorText.required : ''}
            floatingLabelFocusStyle={floatingLabelFocusStyle}
            underlineFocusStyle={underlineFocusStyle}
            onChange={(e) => updateField('accountHolderName', e.target.value, this.isAccountNameValid)}
            errorStyle={blur.name ? {} : errorStyle}
          />
          <div
            style={{ display: 'inline-flex', marginLeft: '10px', alignItems: 'center' }}
            data-tip='Name as it appears on statement'>
            <ActionGrade />
          </div>
        </span>
        <br />
        <span style={{ display: 'inline-flex', marginBottom: `.7em` }}>
          <TextField
            id="routing"
            floatingLabelText="Routing Number"
            onChange={(e) => { updateField('routing', e.target.value, this.isRoutingValid) }}
            maxLength={9}
            errorText={!validations.routing ? errorText.required : ''}
            onBlur={() => this.setBlur('routing')}
            value={formState.routing}
            underlineFocusStyle={underlineFocusStyle}
            errorStyle={blur.routing ? {} : errorStyle}
            floatingLabelFocusStyle={floatingLabelFocusStyle}
          />
          <div
            style={{ display: 'inline-flex', visibility: 'hidden', marginLeft: '10px', alignItems: 'center' }}
            data-tip=''>
            <ActionGrade />
          </div>
        </span>

        <br />
        <span style={{ display: 'inline-flex', marginBottom: `.7em` }}>
          <TextField
            id="accountNumber"
            floatingLabelText="Account Number"
            onBlur={() => this.setBlur('accountNumber')}
            onChange={(e) => { updateField('bankAccount', e.target.value, this.isAccountNumberValid) }}
            errorStyle={blur.accountNumber ? {} : errorStyle}
            errorText={!validations.accountNumber ? errorText.required : ''}
            value={formState.bankAccount}
            underlineFocusStyle={underlineFocusStyle}
            floatingLabelFocusStyle={floatingLabelFocusStyle}
          // errorText={}
          />
          <div
            style={{ display: 'inline-flex', visibility: 'hidden', marginLeft: '10px', alignItems: 'center' }}
            data-tip=''>
            <ActionGrade />
          </div>
        </span>
        <br />
        <span style={{ display: 'inline-flex', marginBottom: `2.4em` }}>
          <TextField
            id="verifyAccount"
            floatingLabelText="Verify Account Number"
            onBlur={() => this.setBlur('confirmAccount')}
            errorText={!validations.confirmAccount ? errorText.match : ''}
            errorStyle={blur.confirmAccount ? {} : errorStyle}
            value={this.state.match}
            floatingLabelFocusStyle={floatingLabelFocusStyle}
            underlineFocusStyle={underlineFocusStyle}
            onChange={(e) => {
              this.updateMatch(e.target.value);
            }}
          // errorText={}
          />
          <div
            style={{ display: 'inline-flex', visibility: 'hidden', marginLeft: '10px', alignItems: 'center' }}
            data-tip=''>
            <ActionGrade />
          </div>
        </span>
        <br />
        <div>
          <FlatButton
            onClick={(e) => {
              onBack();
            }}
            label="Back" />
          <RaisedButton disabled={!this.state.continue} type="submit" label="Submit" /></div>
      </form>
    )
  }
}

export default BankingForm;

BankingForm.defaultProps = {
  styles: {
    floatingLabelFocusStyle: {},
    underlineFocusStyle: {},
    errorStyle: {},
    underlineStyle: {},
  }
}

BankingForm.propTypes = {
  onBack: PropTypes.func.isRequired,
  onBankSubmit: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  formState: PropTypes.shape({
    accountType: PropTypes.string,
    bankName: PropTypes.string,
    bankAddress: PropTypes.string,
    bankingType: PropTypes.string,
    checkType: PropTypes.string,
    accountHolderName: PropTypes.string,
    routing: PropTypes.string,
    bankAccount: PropTypes.string,
  }),
  authIds: PropTypes.object,
  styles: PropTypes.shape({
    floatingLabelFocusStyle: PropTypes.object,
    underlineFocusStyle: PropTypes.object,
    errorStyle: PropTypes.object,
    underlineStyle: PropTypes.object,
  })
}
