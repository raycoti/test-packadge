import React from 'react';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import stateIndex from './usStates'
import RaisedButton from 'material-ui/RaisedButton';
import validate, { validateObject } from './validations'
import { countries } from './countries';

/**
 * Address form component, with validations
 * @constructor
 */
class AddressForm extends React.Component {
  constructor(props) {
    super()
    this.liveaddress = undefined;
    this.state = {
      type: props.type || '',
      continue: false,
      validations: {
        address: false,
        city: false,
        zip: false,
        state: false,
      },
      errorText: {
        nationality: 'Required',
        city: 'Required',
        address: 'Required',
        zip: 'Required',
      },
      blur: {
        address: false,
        city: false,
        zip: false,
        state: false,
      },
      style: {
        form: {
          textAlign: 'center',
        },
      },
    }
    this.isStreetValid = this.isStreetValid.bind(this);
    this.isCityValid = this.isCityValid.bind(this);
    this.isZipValid = this.isZipValid.bind(this);
    this.areAllValid = this.areAllValid.bind(this);
    this.checkAllValidations = this.checkAllValidations.bind(this);
    this.isStateValid = this.isStateValid.bind(this);
    this.handleInternationalChange = this.handleInternationalChange.bind(this);
    this.setBlur = this.setBlur.bind(this);
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
   * Function that handles toggling to/from international country and resetting validations
   * @param {object} formState
   * @property {string} country Country code value from formState 
   * @property {string} zip zip code value from formState
   * @property {string} state state value from formState 
   */
  handleInternationalChange(formState) {
    const type = this.state.type;
    const isInternational = formState[`country${type}`] !== 'US';
    const zipCode = formState[`zip${type}`];
    const state = formState[`state${type}`];
    const stateArray = Object.keys(stateIndex);
    if (!isInternational) {
      this.setState({
        validations: Object.assign({}, this.state.validations, {
          zip: validate('zip', zipCode),
          state: stateArray.indexOf(state) !== -1
        })
      })
    }
    else {
      this.setState({
        validations: Object.assign({}, this.state.validations, {
          zip: validate('length', zipCode),
          state: state !== null && state !== '',
        })
      })
    }
  }

  /**
   *  
   * @param {string} address street address 1 
   */
  isStreetValid(address, checkDirty = true) {
    const valid = validate('length', address); //
    this.setState({
      validations: Object.assign({}, this.state.validations, { address: valid })
    }, this.areAllValid)
  }
  /**
   * 
   * @param {string} state the geographical state 
   */
  isStateValid(state) {
    // const type = this.state.type;
    // const isInternational = this.props.formState[`country${type}`] !== 'US';

    const valid = state !== null && state !== ''; //null handles material ui unselected state, empty string handles international emtpy string
    this.setState({
      validations: Object.assign({}, this.state.validations, {
        state: valid,
      })
    }, this.areAllValid)

  }

  /**
   * 
   * @param {string} city 
   */
  isCityValid(city) {
    const valid = city.length > 3;
    this.setState({
      validations: Object.assign({}, this.state.validations, { city: valid }),
    }, this.areAllValid)
  }

  /**
   * 
   * @param {string} zip 
   */
  isZipValid(zip) {
    const type = this.state.type;
    const zipValid = validate('zip', zip)
    const postalValid = validate('length', zip) //international
    const isInternational = this.props.formState[`country${type}`] !== 'US';
    const valid = isInternational ? postalValid : zipValid;
    this.setState({
      validations: Object.assign({}, this.state.validations, { zip: valid }),
    }, this.areAllValid)
  }

  /**
   * 
   */
  areAllValid() {
    const canContinue = validateObject(this.state.validations);
    this.setState({
      continue: canContinue,
    })
  }

  /**
   * 
   */
  checkAllValidations() {
    const type = this.state.type;
    const isInternational = this.props.formState[`country${type}`] !== 'US';
    const address1 = this.props.formState[`address1${type}`];
    const zip = this.props.formState[`zip${type}`];
    const city = this.props.formState[`city${type}`];
    const streetABR = this.props.formState[`state${type}`]
    const cityValid = city.length > 3;
    const addressValid = validate('length', address1);
    const zipValid = isInternational ? validate('length', zip) : validate('zip', zip);

    const stateValid = isInternational ? streetABR !== null : (Object.keys(stateIndex).indexOf(streetABR) !== -1);

    this.setState({
      validations: {
        address: addressValid,
        city: cityValid,
        zip: zipValid,
        state: stateValid,
      }
    }, this.areAllValid)
  }

  componentWillMount() {
    const {type, formState, updateField} = this.props;

    if (formState[`country${type}`] === '' && formState[`Nationality${type}`]){
      //If country has not been submitted, default to nationality of person
      const nationality = formState[`Nationality${type}`];
      updateField(`country${type}`, nationality, this.checkAllValidations())
    }
    else {
      this.checkAllValidations();
    }
  }

  componentDidMount() {
    const type = this.props.type;
    const { updateFieldBulk } = this.props;
    if (!this.liveaddress && !this.props.smartyOff) {
      this.liveaddress = $.LiveAddress({
        key: configObject.smarty || this.props.smartyKey, //test
        waitForStreet: true,
        debug: false,
        autocomplete: 10,
        submitVerify: false,
        target: "US|INTERNATIONAL",
        addresses: [{
          country: "#country",
          address1: '#StreetAddress1',
          address2: '#StreetAddress2',
          locality: '#City',
          administrative_area: '#State',
          postal_code: '#PostalCode',
        }]
      });
      this.liveaddress.on("AutocompleteUsed", (event, data, previousHandler) => {
        const country = this.props.formState[`country${type}`];
        //state might be abbreviated;
        const { state, city, street_line, zipcode } = data.suggestion;
        updateFieldBulk({
          [`country${type}`]: country,
          [`address1${type}`]: street_line,
          [`city${type}`]: city,
          [`state${type}`]: state,
          [`zip${type}`]: zipcode || '',
        }, this.checkAllValidations)
      })

      this.liveaddress.on("AddressAccepted", (event, data, previousHandler) => { //previous is if they go back, 
        const country = this.props.formState[`country${type}`];

        const addressArr = data.response.raw;
        if (addressArr.length) {
          const components = addressArr[0].components;
          const { state_abbreviation, city_name, zipcode } = components
          const address1 = addressArr[0].delivery_line_1;
          updateFieldBulk({
            [`country${type}`]: country,//autocomplete
            [`address1${type}`]: address1,
            [`city${type}`]: city_name,
            [`state${type}`]: state_abbreviation,
            [`zip${type}`]: zipcode,
          }, this.checkAllValidations)
        }
      });
    }
    else {
      this.checkAllValidations();
    }


  }

  componentWillUnmount() {
    this.liveaddress = undefined;
    $('.smarty-ui').remove()
  }

  render() {
    /*eslint complexity: */

    const { onSubmit, onBack, formState, updateField, updateFieldBulk, styles } = this.props;
    const { type, validations, errorText, style, blur } = this.state;
    const { errorStyle, errorStyleBlur, underlineStyle, underlineFocusStyle, floatingLabelFocusStyle } = styles;
    const isInternational = formState[`country${type}`] !== "US";
    return (
      <div>
        <form
          style={style.form}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit()
          }} >
          <h3> {type === '' ? 'Personal Addresss' : `${formState.customerType} Address`} </h3>
          <SelectField
            onChange={(e, index, value) => {
              const updatedFields = {
                [`country${type}`]: value,
                [`state${type}`]: formState[`state${type}`],
                [`zip${type}`]: formState[`zip${type}`]
              }
              updateFieldBulk(updatedFields, this.handleInternationalChange)
            }}
            id="country"
            disabled={type === 'Group'}
            floatingLabelText="Country"
            style={{ textAlign: 'left' }}
            floatingLabelFixed={true}
            value={formState[`country${type}`]}
          >
            {countries.map((country) => {
              return (
                <MenuItem value={country.code} key={country.code} primaryText={country.name} />
              )
            })}
          </SelectField>

          <br />
          <TextField
            id="StreetAddress1"
            floatingLabelText="Street Address 1"
            onBlur={() => this.setBlur('address')}
            onChange={(e) => { updateField(`address1${type}`, e.target.value, this.isStreetValid) }}
            value={formState[`address1${type}`]}
            errorText={!validations.address ? errorText.address : ''}
            errorStyle={blur.address ? {} : errorStyle}
            underlineFocusStyle={underlineFocusStyle}
            floatingLabelFocusStyle={floatingLabelFocusStyle}
          />
          <br />
          <TextField
            id="StreetAddress2"
            floatingLabelText="Street Address 2"
            onChange={(e) => { updateField(`address2${type}`, e.target.value) }}
            value={formState[`address2${type}`]}
          />
          <br />
          <TextField
            floatingLabelText="City"
            id="City"
            onChange={(e) => { updateField(`city${type}`, e.target.value, this.isCityValid) }}
            onBlur={() => this.setBlur('city')}
            value={formState[`city${type}`]}
            errorText={!validations.city ? errorText.city : ''}
            errorStyle={blur.city ? {} : errorStyle}
            underlineFocusStyle={underlineFocusStyle}
            floatingLabelFocusStyle={floatingLabelFocusStyle}
          />
          <br />
          <span>
            {
              isInternational ? <TextField
                onChange={e => {
                  updateField(`state${type}`, e.target.value, this.isStateValid)
                }}
                floatingLabelText="State/Providence/Region"
                id="State"
                style={{ textAlign: 'left' }}
                floatingLabelFixed={true}
                value={formState[`state${type}`] !== null ? formState[`state${type}`] : ''} />
                :
                <SelectField

                  onChange={(e, index, value) => { updateField(`state${type}`, value, this.isStateValid) }}
                  floatingLabelText="State"
                  id="State"
                  style={{ textAlign: 'left' }}
                  floatingLabelFixed={true}
                  value={formState[`state${type}`]}>
                  <MenuItem value={null} primaryText={''} />
                  {Object.keys(stateIndex).map((item) => {
                    return (
                      <MenuItem value={item} key={item} primaryText={item} />
                    )
                  })}
                </SelectField>
            }
          </span>
          <br />
          {/* International addressses?? */}
          <TextField
            style={{ marginBottom: '3em' }}
            floatingLabelText="Zip/PostalCode"
            id="PostalCode"
            onBlur={() => this.setBlur('zip')}
            floatingLabelFocusStyle={floatingLabelFocusStyle}
            onChange={(e) => { updateField(`zip${type}`, e.target.value, this.isZipValid) }}
            value={formState[`zip${type}`]}
            errorText={!validations.zip ? errorText.zip : ''}
            errorStyle={blur.zip ? {} : errorStyle}
          />
          <br />
          <div><RaisedButton label="Back" onClick={() => onBack()} /><RaisedButton disabled={!this.state.continue} type="submit" label="Next" /></div>
        </form>
      </div>
    )
  }
}

export default AddressForm;

const AddressKeys = [
  'address1', 'address2', 'city', 'state', 'zip', 'country'
]

AddressForm.defaultProps = {
  type: '',
  styles: {
    floatingLabelFocusStyle: {},
    underlineFocusStyle: {},
    errorStyle: {},
  }
}

AddressForm.propTypes = {
  /** @property {string} type Optional property name extender eg: type = 'Guardian', address1 => address1Guardian */
  type: PropTypes.string,
  /**
   * An object with fields the form is updating,
   * Fields must be postfixed with 'type' string passed in props
   * @property {Object} formState
   * @property {string} formState.address1
   * @property {string} formState.address2
   * @property {string} formState.city
   * @property {string} formState.state
   * @property {string} formState.zip
   * @property {string} formState.country 
   */
  formState: function (props, propName, componentName) {
    const type = props.type;
    const addressForm = props[propName];
    const validated = AddressKeys.map((value) => {
      const addressProp = value + type;
      const addressFormVal = addressForm[addressProp]
      return addressFormVal !== undefined && (typeof addressFormVal === 'string' || addressFormVal === null);
    })
    if (validated.indexOf(false) !== -1) {
      return new Error(
        'Invalid value for key `' + AddressKeys[validated.indexOf(false)] + type + '` supplied to ' +
        '`' + componentName
      );
    }
  },
  /** Function invoked on each field change.
   * @property {function} updateField
   *  @param {string} updatedField the field being updated
   *  @param {string} newValue new field value
   *  @param {function} cb Callback function
   */
  updateField: PropTypes.func,
  
  /** function invoked when multiple fields update
   * @property {function} updateFieldBulk
   * @param {Object.<string string>} updatedFieldObj Object of updated fields keyed by their field name
   * @param {function} cb Callback function;
   */
  updateFieldBulk: PropTypes.func,
  
  /** Function invoked on back button click
   * @property {function} onBack
   */
  onBack: PropTypes.func,
  
  /**
   * Material-ui styles
   * @property {Object} [styles]
   * @property {Object} styles.floatingLabelFocusStyle
   * @property {Object} styles.underlineFocusStyle
   * @property {Object} styles.errorStyle
   */
  styles: PropTypes.shape({
    floatingLabelFocusStyle: PropTypes.object,
    underlineFocusStyle: PropTypes.object,
    errorStyle: PropTypes.object,
  })
}
