import React, { Component } from "react";
import { UserConsumer } from './userContext'
import Login from "./login.component"
import {withTranslation} from "react-i18next";
import DatePicker from 'react-datepicker'
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';

import "react-datepicker/dist/react-datepicker.css";

/**
 * Info component is responsible for finding and showing explorations
 * from API according to specified criteria, such as lax/strict mode,
 * datetime and clinic.
 */
class Info extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            clinic: '',
            success: true,
            navigate: false,
            userInfo: null,
            name: [],
            mode: "STRICT",
            showExplorations: false,
            queriedExplorations: [],
            showLoader: false
        };
    }

    state = {
        startDate: new Date(),
        endDate: new Date(),
      };
     
      handleChange = date => {
        if(date) {
          this.setState({
            startDate: date
          });
        }
      };

      handleChangeEndDate = date => {
        if (date) {
          this.setState({
            endDate: date
          });
        }
      };

      changeHandler = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleChangeMultiselect = (e) => {
        this.setState({ name: e.target.value });
    };

    submitHandler = e => {
        e.preventDefault()
        this.setState({ navigate: true })
    }

    searchExplorations = (e, token) => {
     e.preventDefault();
     this.setState({ showLoader: true });
     const startDate = new Date(this.state.startDate)
     const endDate = new Date(this.state.endDate)

     const startDatetime = {
        "startYYYY": startDate == "Invalid Date" ? 2019 : startDate.getUTCFullYear(),
        "startMM": startDate == "Invalid Date" ? 1 : startDate.getUTCMonth(),
        "startDD": startDate == "Invalid Date" ? 1 : Number(startDate.getUTCDate()) - 1,
        "startHH": startDate == "Invalid Date" ?  14 : Number(startDate.getUTCHours()) + 14,
        "startMm": startDate == "Invalid Date" ? 1 : startDate.getUTCMinutes(),
        "startSs": startDate == "Invalid Date" ? 0 : startDate.getUTCSeconds(),
        "startSss": startDate == "Invalid Date" ? 0 : startDate.getUTCMilliseconds()}
        
        const endDatetime = {
          "endYYYY": endDate == "Invalid Date" ? new Date().getUTCFullYear() : endDate.getUTCFullYear(),
          "endMM": endDate == "Invalid Date" ? new Date().getUTCMonth() : endDate.getUTCMonth(),
          "endDD": endDate == "Invalid Date" ? Number(new Date().getUTCDate()) -1 : Number(endDate.getUTCDate()) - 1,
          "endHH": endDate == "Invalid Date" ? Number(new Date().getUTCHours()) + 14 : Number(endDate.getUTCHours()) + 14,
          "endMm": endDate == "Invalid Date" ? new Date().getUTCMinutes() : endDate.getUTCMinutes(),
          "endSs": endDate == "Invalid Date" ? new Date().getUTCSeconds() : endDate.getUTCSeconds(),
          "endSss": endDate == "Invalid Date" ? new Date().getUTCMilliseconds() : endDate.getUTCMilliseconds()
           }

     const req = {
         mode: this.state.mode,
         consumedMedications: this.state.name,
         clinicName: this.state.clinic,
         startDatetime,
         endDatetime}   

     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
     axios.get('http://localhost:4000/api/explorations',
     {headers: {
        "X-ExplorationRequest": JSON.stringify(req),
        "auth": `Bearer ${token}`
     } }).then(res => {
        if (res != []) {
          this.setState({ queriedExplorations: res.data });
        }
        this.setState({ showExplorations: true });
        this.setState({ showLoader: false });
     }).catch(e => {
         console.log(e)
         this.setState({ showLoader: false });
     }) 
    }

    setMode = e => {
     e.preventDefault();
     this.setState({ mode: e.target.value });
    }

    generate = element => {
      return [0, 1, 2].map((value) =>
        React.cloneElement(element, {
          key: value,
        }),
      );
    }

    render() {
        const { navigate, clinic, showExplorations, showLoader, queriedExplorations} = this.state
        const ITEM_HEIGHT = 48;
        const { t } = this.props
        const ITEM_PADDING_TOP = 8;
        const MenuProps = {
            PaperProps: {
              style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
              },
            },
          };
          
          const names = [
            "VITAMINS", 
            "ANTIBIOTICS", 
            "BLOOD_THINNERS", 
            "HORMONE_THERAPY", 
            "COAGULANTS"
          ];

        if (!navigate && !showLoader && !showExplorations) {
            return (
                <UserConsumer>
                  {
                      (userInfo) => {
                      return <div>
                                <form onSubmit={this.submitHandler}>
                                    <br/><br/>
                                     <h3>Search explorations</h3>
                                        <div className="form-group">
                                            <label>Start Datetime</label><br/>
                                                  <DatePicker
                                                    selected={this.state.startDate}
                                                    onChange={this.handleChange}
                                                    showTimeSelect
                                                    timeIntervals={1}
                                                    placeholderText="MM/DD/YYY, HH:mm"
                                                    timeFormat="p"
                                                    dateFormat="Pp"
                                                  />
                                        </div>

                                        <div className="form-group">
                                            <label>End Datetime</label><br/>
                                                  <DatePicker
                                                    selected={this.state.endDate}
                                                    onChange={this.handleChangeEndDate}
                                                    showTimeSelect
                                                    timeIntervals={1}
                                                    placeholderText="MM/DD/YYY, HH:mm"
                                                    timeFormat="p"
                                                    dateFormat="Pp"
                                                  />
                                        </div>

                                        <div className="form-group">
                                            <label>Clinic</label>
                                            <input type="text" name="clinic" value={clinic} onChange={this.changeHandler} className="form-control" />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label>Consumed medications</label>
                                            <Select
                                                labelId="demo-mutiple-name-label"
                                                id="demo-mutiple-name"
                                                multiple
                                                value={this.state.name}
                                                onChange={this.handleChangeMultiselect}
                                                input={<Input fullWidth/>}
                                                MenuProps={MenuProps}
                                                >
                                                {names.map((name) => (
                                                    <MenuItem key={name} value={name} >
                                                    {name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>    
                                        <div className="form-group">
                                            <label>Mode</label>
                                            <RadioGroup row aria-label="position" name="position" defaultValue="top">
                                                <FormControlLabel
                                                value="LAX"
                                                control={<Radio color="secondary" />}
                                                label="LAX"
                                                labelPlacement="top"
                                                onChange={this.setMode}
                                                />
                                                <FormControlLabel
                                                value="STRICT"
                                                control={<Radio color="secondary" />}
                                                label="STRICT"
                                                labelPlacement="top"
                                                onChange={this.setMode}
                                                />
                                            </RadioGroup>
                                        </div>
                                        <div className="btn-group btn-block"> 
                                            <button onClick={e => this.searchExplorations(e, userInfo.token)} className="btn btn-light btn-block mr-2">Search</button>
                                           <button type="submit" className="btn btn-light btn-block mr-2">{t('welcome.logout')}</button> 
                                        </div>
                                </form>
                             </div>
                      }
                  }
                </UserConsumer>
            );
        } else if (navigate){
            return (
                 <Login/>
            )
        } else if (!navigate && showLoader) {
          return (
            <CircularProgress disableShrink />
                )
        } else if (!navigate && !showLoader && showExplorations) {
            return (
              <div>
                 <nav className="scrollableList">
                  <ul>
                  {this.state.queriedExplorations.map((queriedExploration, idx) => {
                      var consumedMedications = ""
                      if (queriedExploration.consumedMedications === undefined || queriedExploration.consumedMedications.length == 0) {
                         consumedMedications = "None";
                      } else {
                         consumedMedications = queriedExploration.consumedMedications.join(", ");
                      }
                      return (<li key={idx}>BookingId: {queriedExploration.bookingId}. Consumed medications: {consumedMedications}</li>)
                  })}
                  </ul>
                </nav>

            </div>
            )
        }
       
    }
}

export default withTranslation('common')(Info);
