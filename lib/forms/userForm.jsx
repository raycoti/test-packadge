import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import validate, { validateObject } from './validations'
import ActionGrade from 'material-ui/svg-icons/action/help-outline';
import { grey500, black, cyan400 } from 'material-ui/styles/colors';

class UserInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      continue: false,
      validations: {
        name: false,
        email: false,
        phone: false,
      },
      blur: {
        name: false,
        email: false,
        phone: false,
      },

      errorText: {
        email: 'Required',
        phone: 'Required',
        name: 'Required',
      },

    }
    this.isEmailValid = this.isEmailValid.bind(this);
    this.isNameValid = this.isNameValid.bind(this);
    this.isPhoneValid = this.isPhoneValid.bind(this);
    this.areAllValid = this.areAllValid.bind(this);
    this.setBlur = this.setBlur.bind(this);
  }

  setBlur(field) {
    this.setState({
      blur: {
        ...this.state.blur,
        [field]: true,
      }
    })
  }

  isNameValid(name) {
    const nameValid = validate('noNum', name);
    const valid = nameValid && name.length > 4; this.setState({
      validations: {
        ...this.state.validations,
        name: valid
      }
    },
      this.areAllValid)
  }

  isPhoneValid(phone) {
    const valid = validate('numbers', phone);
    this.setState({
      validations: {
        ...this.state.validations,
        phone: valid
      }
    }, this.areAllValid)
  }

  isEmailValid(email) {
    const valid = validate('email', email);
    this.setState({
      validations: {
        ...this.state.validations,
        email: valid,
      }
    }, this.areAllValid)
  }

  areAllValid() {
    const isValid = validateObject(this.state.validations);
    this.setState({
      continue: isValid,
    })
  }

  render() {

    const { formState, styles,  updateForm, onSubmit } = this.props;
    const { validations,  errorText, blur } = this.state;
    const { errorStyle, underlineStyle, underlineFocusStyle, floatingLabelFocusStyle } = styles;

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        style={{ textAlign: 'center' }}>

        <span style={{ display: "inline-flex", marginBottom: `.7em` }}>
          <TextField
            id="userName"
            floatingLabelFixed={true}
            floatingLabelText={`Your Name`}
            onBlur={() => this.setBlur('name')}
            onChange={(e) => { updateForm( 'name', e.target.value, this.isNameValid) }}
            value={formState.name}
            errorText={!validations.name ? errorText.name : ''}
            errorStyle={!blur.name ? errorStyle : {}}
            underlineFocusStyle={underlineFocusStyle}
            floatingLabelFocusStyle={floatingLabelFocusStyle}
          // errorText={}
          />
          <div
            style={{ display: "inline-flex", alignItems: 'center' }}
            data-tip={`This is your name`}
          >
            <ActionGrade />
          </div>
        </span>
        <br />
        <span style={{ display: "inline-flex", marginBottom: `.7em` }}>
          <TextField
            id="userEmail"
            floatingLabelFixed={true}
            onBlur={() => this.setBlur('email')}
            floatingLabelText="Email"
            onChange={(e) => { updateForm('email', e.target.value, this.isEmailValid) }}
            value={formState.email}
            errorText={!validations.email ? errorText.email : ''}
            errorStyle={!blur.email ? errorStyle : {}}
            underlineFocusStyle={underlineFocusStyle}
            floatingLabelFocusStyle={floatingLabelFocusStyle}
          // errorText={}
          />
          <div
            style={{ display: "inline-flex", alignItems: 'center' }}
            data-tip='The best email to send you updates and additional information.'
          >
            <ActionGrade />
          </div>
        </span>
        <br />
        <span style={{ display: "inline-flex", marginBottom: `.7em` }}>
          <TextField
            id="userPhone"
            maxLength="10"
            floatingLabelFixed={true}
            floatingLabelText="Phone Number"
            onBlur={() => this.setBlur('phone')}
            onChange={(e) => { updateForm('phone', e.target.value, this.isPhoneValid) }}
            errorText={!validations.phone ? errorText.email : ''}
            errorStyle={!blur.phone ? errorStyle : {}}
            value={formState.phone}
            underlineFocusStyle={underlineFocusStyle}
            floatingLabelFocusStyle={floatingLabelFocusStyle}
          // errorText={}
          />
          <div
            style={{ display: "inline-flex", alignItems: 'center' }}
            data-tip='The best phone number to reach you for questions and follow-up on your asset.'
          >
            <ActionGrade />
          </div>
        </span>
        <br />
        <div>
            <RaisedButton style={{ marginRight: '34px' }} disabled={!this.state.continue} type="submit" label="Next" />
          </div>
      </form>
    )
  }
}

export default UserInfo;
UserInfo.defaultProps = {
  onSubmit: function () {
    console.log('User info ready')
  },
  styles: {
    errorStyle: {
      color: black,
    },
    underlineStyle: {
      borderColor: grey500,
    },
    underlineFocusStyle: {
      color: cyan400,
    },
    floatingLabelFocusStyle: {
      color: cyan400,
    },
  },
}
UserInfo.propTypes = {
  formState: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }),
  updateForm: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
