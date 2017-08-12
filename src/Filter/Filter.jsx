import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import moment from 'moment'
import 'react-day-picker/lib/style.css'

const options = [
	{text: 'Date', value: 'date'},
	{text: 'Week', value: 'week'},
	{text: 'Month', value: 'month'}
]

const DEFAULT_DATE_FORMAT = 'D MMM YYYY'

const ControlledFilter = () => {
	return(
		<div>
			<span>{'From: '}<DayPickerInput format={DEFAULT_DATE_FORMAT}/></span>
			<span style={{marginLeft:'10px'}}>{'To: '}<DayPickerInput format={DEFAULT_DATE_FORMAT} value={moment(new Date()).format(DEFAULT_DATE_FORMAT)} /></span>
			<span style={{marginLeft:'100px'}}>{'Per'}<Dropdown selection compact defaultValue={'date'} options={options} style={{marginLeft:'10px'}}/></span>
		</div>
	)
}

const control = WrappedComponent =>
	class extends Component {
		render() {
			return(
				<WrappedComponent />
			)
		}
	}

const UncontrolledFilter = control(ControlledFilter)
export { ControlledFilter, UncontrolledFilter }