import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { countries } from './countries.json';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import validate, { validateObject } from './validations'
import ActionGrade from 'material-ui/svg-icons/action/help-outline';
import DatePicker from 'material-ui/DatePicker';

/**
 * Function that converts a date object to a string
 * @param {Date} date Date Object returned from material-ui DatePicker
 * @returns {string} String represntation of date in ISO format
 */
const formatDateToString = (date) => {
  // 01, 02, 03, ... 29, 30, 31
  var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
  // 01, 02, 03, ... 10, 11, 12
  var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
  // 1970, 1971, ... 2015, 2016, ...
  var yyyy = date.getFullYear();

  return (`${yyyy}-${MM}-${dd}`);
}

/**
 * Function that converts a string to a date object
 * @param {string} dateString ISO formatted date string
 * @returns {Date} //returns a new Date object 
 */
const formateStringTodate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return new Date(year, +month - 1, day)
}

class IndividualForm extends React.Component {
  constructor(props) {
    super()
    this.state = {
      type: props.type || '',
      continue: false,
      searchText: '',
      returning: false,
      isInternational: false,
      dateObject: undefined,
      validations: {
        ssn: false,
        name: false,
        dob: false,
        // nationality: false,
      },
      errorText: {
        ssn: 'Required: XXXXXXXXX',
        name: 'Required',
        dob: 'Required',
      },
      hintText: {
        ssn: 'XXXXXXXXX',
        dob: 'Date of Birth',
        name: 'Legal Name',
      },
      dirty: { //depends on desired user experience when to show error messages
        ssn: false,
        name: false,
        dob: false,
        // nationlity: false,
      },
      blur: {
        ssn: false,
        name: false,
        dob: false
      },
      style: {
        form: {
          textAlign: 'center',
        },
      }
    }
    this.isDOBValid = this.isDOBValid.bind(this);
    this.isNameValid = this.isNameValid.bind(this);
    this.isSSNValid = this.isSSNValid.bind(this);
    // this.isNationalityValid = this.isNationalityValid.bind(this);
    this.isIdentityNumValid = this.isIdentityNumValid.bind(this);
    this.isIdentificationValid = this.isIdentificationValid.bind(this);
    this.areAllValid = this.areAllValid.bind(this);
    this.checkAllValidations = this.checkAllValidations.bind(this);
    this.setBlur = this.setBlur.bind(this);
    this.onDatePickerChange = this.onDatePickerChange.bind(this);
  }

  /**
   * This function updates the state to reflect that a field has been interacted with
   * @param {string} field name of the field that is blurred 
   */
  setBlur(field) {
    this.setState({
      blur: {
        ...this.state.blur,
        [field]: true,
      }
    })
  }

  /**
   * 
   * @param {Object} event the event object 
   * @param {Date} date the date object material-ui Date picker returns
   */
  onDatePickerChange(event, date) {
    const dateOfBirth = formatDateToString(date);
    this.setState({
      dateObject: date
    },
      this.props.updateField(`DOB${this.state.type}`, dateOfBirth, this.isDOBValid));
  }
  /**
   * Function that updates the validation state of the updated date of birth
   * @param {string} dob 
   * @param {boolean} checkDirty 
   */
  isDOBValid(dob, checkDirty = true) {
    const valid = validate('dob', dob)
    // const valid = dob.length !== 0;
    const dirty = checkDirty ? !!dob.length : false;
    this.setState({
      validations: Object.assign({}, this.state.validations, { dob: valid }),
      dirty: Object.assign({}, this.state.dirty, { dob: dirty }),
    }, this.areAllValid)
  }

  /**
   * Function that updates the validation state of the updated name 
   * @param {string} name 
   * @param {boolean} checkDirty 
   */
  isNameValid(name, checkDirty = true) {
    const valid = validate('length', name) && validate('noNum', name);
    const dirty = checkDirty ? !!name.length : false;

    this.setState({
      validations: Object.assign({}, this.state.validations, { name: valid }),
      dirty: Object.assign({}, this.state.dirty, { name: dirty }),
    }, this.areAllValid)
  }

  /**
   * Function that updates the validation state of the updated social security number
   * @param {string} ssn 
   * @param {boolean} checkDirty 
   */
  isSSNValid(ssn, checkDirty = true) {
    const valid = validate('ssn', ssn)
    const dirty = checkDirty ? !!ssn.length : false;

    this.setState({
      validations: Object.assign({}, this.state.validations, { ssn: valid }),
      dirty: Object.assign({}, this.state.dirty, { ssn: dirty })
    }, this.areAllValid)
  }

  /**
   * function that updates the validation state of the updated identification number
   * @param {string} idNum 
   * @param {boolean} checkDirty 
   */
  isIdentityNumValid(idNum, checkDirty = true) {//ispassport valid
    const valid = validate('length', idNum)
    const dirty = checkDirty ? !!idNum.length : false;
    this.setState({
      validations: Object.assign({}, this.state.validations, { ssn: valid }),
      dirty: Object.assign({}, this.state.dirty, { ssn: dirty })
    }, this.areAllValid)
  }

  /**
   * function that utilizes the correct validation function based on nationality
   * @param {string} nationality 
   */
  isIdentificationValid(nationality) {
    const international = nationality !== 'US';
    const identity = this.props.formState.SSN;
    if (!international) {
      this.isSSNValid(identity)
    }
    else {
      this.isIdentityNumValid(identity)//passport
    }
  }

  //Function that updates the [continue] boolean value based on the validation state
  areAllValid() {
    const canContinue = validateObject(this.state.validations);
    this.setState({
      continue: canContinue,
    })
  }

  /**
   * Function that checks vallidations of all field inputs
   */
  checkAllValidations() {
    const {formState} = this.props;
    const { SSN, DOB, legalName, Nationality } = formState;
    const international = Nationality !== 'US';
    const returning = validate('returning-ssn', SSN);
    const nameValid = validate('length', legalName);
    const ssnValid = validate('ssn', SSN) || returning;
    const idNumValid = validate('length', SSN);
    const idValid = international ? idNumValid : ssnValid;
    const dobValid = validate('dob', DOB);
    this.setState({
      returning: returning,
      validations: {
        ssn: idValid,
        name: nameValid,
        dob: dobValid,
      }
    }, this.areAllValid)

  }

  componentWillMount() {
    const dob = this.props.formState[`DOB${this.state.type}`];
    if (dob.length) {
      this.setState({
        dateObject: formateStringTodate(dob)
      })
    }
    this.checkAllValidations();
  }

  /*eslint complexity: */
  render() {
    const { onSubmit, updateField, formState, styles} = this.props
    const { validations, returning, errorText, hintText, type, style, blur } = this.state;
    const { errorStyle, underlineStyle, underlineFocusStyle, floatingLabelFocusStyle } = styles;
    const international = formState.Nationality !== 'US';
    /* style={style.form} */
    return (
      <div>
        <form
          style={style.form}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(this.state.returning)
          }} >

          <h3> {type === '' ? 'Personal Info' : 'Authenticated Individual'} </h3>
          <span style={{ display: 'inline-flex', marginBottom: `.7em` }}>
            <TextField
              id="legalName"
              floatingLabelText="Registrant Name"
              onChange={(e) => { updateField(`legalName${type}`, e.target.value, this.isNameValid) }}
              value={formState[`legalName${type}`]}
              hintText={hintText.name}
              floatingLabelFocusStyle={floatingLabelFocusStyle}
              errorText={!validations.name ? errorText.name : ''}
              errorStyle={blur.name ? {} : errorStyle}
              onBlur={() => this.setBlur('name')}
              underlineFocusStyle={underlineFocusStyle}
            />
            <div
              style={{ display: 'inline-flex', marginLeft: '10px', alignItems: 'center' }}
              data-tip="Your legal name">
              <ActionGrade />
            </div>
          </span>
          <br />
          <span style={{ display: 'inline-flex', marginBottom: `.7em` }}>
            <SelectField
              id="nationality"
              onChange={(e, index, value) => { updateField(`Nationality${type}`, value, this.isIdentificationValid) }}
              floatingLabelText="Nationality"
              style={{ textAlign: 'left' }}
              floatingLabelFixed={true}
              value={formState[`Nationality${type}`]}>
              {countries.map((country) => {
                return (
                  <MenuItem value={country.code} key={country.name} primaryText={country.name} />
                )
              })}
            </SelectField>
            <div
              style={{ display: 'inline-flex', marginLeft: '10px', alignItems: 'center' }}
              data-tip="Your Nationality">
              <ActionGrade />
            </div>
          </span>
          <br />
          {
            !international ?
              <span style={{ display: 'inline-flex', marginBottom: `.7em` }}>
                <TextField
                  id="identification"
                  floatingLabelText={'Social Security Number'}
                  disabled={returning}
                  onChange={(e) => { updateField(`SSN${type}`, e.target.value, this.isSSNValid) }}
                  floatingLabelFocusStyle={floatingLabelFocusStyle}
                  value={formState[`SSN${type}`]}
                  hintText={hintText.ssn}
                  onBlur={() => this.setBlur('ssn')}
                  maxLength="11"
                  errorText={!validations.ssn ? errorText.ssn : ''}
                  errorStyle={blur.ssn ? {} : errorStyle}
                  underlineFocusStyle={underlineFocusStyle}
                />
                <div
                  style={{ display: 'inline-flex', marginLeft: '10px', alignItems: 'center' }}
                  data-tip="Your SSN">
                  <ActionGrade />
                </div>
              </span> :
              <span style={{ display: 'inline-flex', marginBottom: `.7em` }}>
                <TextField
                  id="identification"
                  floatingLabelText={'Identification Number'}
                  onChange={(e) => { updateField(`SSN${type}`, e.target.value, this.isIdentityNumValid) }}
                  onBlur={() => this.setBlur('ssn')}
                  floatingLabelFocusStyle={floatingLabelFocusStyle}
                  value={formState[`SSN${type}`]}
                  hintText={hintText.ssn}
                  errorText={!validations.ssn ? errorText.ssn : ''}
                  errorStyle={blur.ssn ? {} : errorStyle}
                  underlineFocusStyle={underlineFocusStyle}
                />
                <div
                  style={{ display: 'inline-flex', marginLeft: '10px', alignItems: 'center' }}
                  data-tip="Your Identification Number">
                  <ActionGrade />
                </div>
              </span>
          }
          <br />
          <span style={{ display: 'inline-flex', marginBottom: `3em`, marginTop: '1em' }}>
            <DatePicker
              id="dob"
              openToYearSelection={true}
              value={this.state.dateObject}
              onChange={this.onDatePickerChange}
              hintText={hintText.dob}
              onBlur={() => this.setBlur('dob')}
              errorText={!validations.dob ? errorText.dob : ''}
              errorStyle={blur.dob ? {} : errorStyle}
              underlineFocusStyle={underlineFocusStyle}
              floatingLabelFocusStyle={floatingLabelFocusStyle}
            />
            <div
              style={{ display: 'inline-flex', marginLeft: '10px', alignItems: 'center' }}
            >
              <ActionGrade style={{ visibility: 'hidden' }} />
            </div>

          </span>
          <br />

          <div>
            <RaisedButton style={{ marginRight: '34px' }} disabled={!this.state.continue} type="submit" label="Next" />
          </div>
        </form>
      </div>
    )
  }
}

export default IndividualForm;

IndividualForm.defaultProps = {
  styles: {
    errorStyle: {},
    underlineStyle: {},
    underlineFocusStyle: {},
    floatingLabelFocusStyle: {},
  }
}

IndividualForm.propTypes = {
  // const { onSubmit, updateField, formState, styles } = this.props;
  onSubmit: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  formState: PropTypes.shape({
    legalName: PropTypes.string.isRequired,
    Nationality: PropTypes.string.isRequired,
    SSN: PropTypes.string.isRequired,
    DOB: PropTypes.string.isRequired,
    // test: PropTypes.string.isRequired
  }),
  styles: PropTypes.shape({
    errorStyle: PropTypes.object,
    underlineStyle: PropTypes.object,
    underlineFocusStyle: PropTypes.object,
    floatingLabelFocusStyle: PropTypes.object,
  })
}
