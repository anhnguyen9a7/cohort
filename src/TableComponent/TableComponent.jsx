import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Table, Header, Popup, Confirm } from 'semantic-ui-react'
import moment from 'moment'

import { action } from '@storybook/addon-actions';

const typeAndRangeToTableHeader = (type,range) => {
	let i, t, res = [];
	type === 'date' 
	? t = 'Day'
	: type === 'week'
		? t = 'Week'
		: t = 'Month'
	Array(range+1).fill(null).forEach((val,idx) => res[idx] = `${t} ${idx}`)
	return res
}

const calculateRange = (query) => {
	switch(query.type) {
		case 'date': 
			return moment.duration(moment(query.to) - moment(query.from),'milliseconds').asDays()
		case 'week':
			return moment.duration(moment(moment(`${moment(query.to).format('w YYYY')} 1`,'w YYYY e').format('D MMM YYYY')) - moment(moment(`${moment(query.from).format('w YYYY')} 1`,'w YYYY e').format('D MMM YYYY'))).asWeeks()
		default: return null
	}
}

const calculateAllUsers = query => {
	const range = calculateRange(query);
	let res = {cells:[],users:0}
	query.data.users.forEach(val => res.users += val)
	query.data.cells.forEach(rowVal => rowVal.forEach((colVal,idx) => res.cells[idx] = (res.cells[idx] || 0) + (colVal || 0)))
	res.cells = res.cells.map((val,idx) => {
		return (val/(range-idx)).toLocaleString('en-IN', { maximumFractionDigits: 2 })
	})
	return res
}

const getWeekRange = date => {
	const monday = moment(`${moment(`${date}`).format('w YYYY')} 1`, 'w YYYY e').format('D MMM YYYY')
	return `${monday} - ${moment(`${moment(`${moment(moment(monday) + 7*24*3600*1000).format('D MMM YYYY')}`).format('w YYYY')} 1`, 'w YYYY e').format('D MMM YYYY')}`
}

const calculateTimeList = query => {
	const range = calculateRange(query), oneDay = 24*3600*1000
	let res = [], from = query.from
	switch (query.type) {
		case 'date':
			Array(range+1).fill(null).forEach((val,idx) => res[idx] = moment(moment(from) + idx*oneDay).format('D MMM YYYY'))
			break
		case 'week':
			Array(range+1).fill(null).forEach((val,idx) => {
				let week = moment(from).format('w - YYYY')
				res[idx] = `Week ${week} (${getWeekRange(from)})`
				from = moment(moment(from)+7*oneDay).format('D MMM YYYY')
			})
			break
		default: res = []
	}
	return res
}

const getCell = (val,max,date,dayNum,onCellClick) => {
	return 	<Table.Cell  
						onClick={onCellClick(date,dayNum)}
	        	textAlign='right' 
	        	style={{backgroundColor: `rgba(13,71,161,${val/max+0.1})`}}
        	>
        		{val}%
        	</Table.Cell>
}

const getMax = query => {
	let max = 0
	query.data.cells.forEach(rowVal => rowVal.forEach(colVal => colVal > max ? max = colVal : max))
	return max
}

const getLastRow = query => {
	switch (query.type){
		case 'date': 
			return query.to
		case 'week':
			return `Week ${moment(query.to).format('w - YYYY')} (${getWeekRange(query.to)})`
		default: return null
	}
}

const uppercaseFirstLetter = (type, prep = false) => {
	const res = type.charAt(0).toUpperCase() + type.slice(1)
  switch (type) {
  	case 'date': return prep ? `${res} on` : res
  	case 'week': return prep ? `${res} in` : res
  	default: return res 	
  }
}

const ControlledTableComponent = ({
	query,
	onCellClick
}) => {
	const allUsers = calculateAllUsers(query)
	const timeList = calculateTimeList(query)
	const max = getMax(query)
	return(
		<Table celled>
			<Table.Header>
        <Table.Row>
          <Table.HeaderCell />
          {typeAndRangeToTableHeader(query.type, calculateRange(query)).map(val => <Table.HeaderCell textAlign='right'>{val}</Table.HeaderCell>)}
        </Table.Row>
      
        <Table.Row>
        	<Table.Cell>
	        	<Header>
	            <Header.Content>
	              All Users
	              <Header.Subheader>{allUsers.users}</Header.Subheader>
	            </Header.Content>
	          </Header>
	         </Table.Cell>
	         <Table.HeaderCell textAlign='right'>100%</Table.HeaderCell>
	         {allUsers.cells.map(val => <Table.Cell textAlign='right'>{val}%</Table.Cell>)}
        </Table.Row>
        {
        	query.data.users.map((val,idx) => {
        		return <Table.Row>
		        	<Table.Cell>
			        	<Header>
			            <Header.Content>
			              {timeList[idx]}
			              <Header.Subheader>{val}</Header.Subheader>
			            </Header.Content>
			          </Header>
			         </Table.Cell>
			         <Table.HeaderCell textAlign='right'>100%</Table.HeaderCell>
			         {
			         		query.data.cells[idx].map((val,colIdx) => {
			         			return typeof(val) == 'number' 
			         			? val > 0 
			         				? <Popup trigger={getCell(val,max,timeList[idx],colIdx+1,onCellClick)} position='bottom right' wide>
			         						{
			         							<div>
			         								<b>Click to create a cohort segment.</b><br /><br />
			         								<table>
			         									<tbody>
					         								<tr>
					         									<td><i>Cohort Group</i></td>
					         									<td style={{paddingLeft:'10px'}}><i>Acquisition {uppercaseFirstLetter(query.type,true)} {timeList[idx]}.</i></td>
					         								</tr>
					         								<tr>
					         									<td><i>{uppercaseFirstLetter(query.type)} Range</i></td>
					         									<td style={{paddingLeft:'10px'}}>
					         										<i>{colIdx+1} {query.type == 'date' ? 'day' : query.type}(s) after Acquisition {uppercaseFirstLetter(query.type)}.</i>
					         									</td>
					         								</tr>
				         								</tbody>
			         								</table>
			         							</div>
			         						}
			         					</Popup>
			         				: <Table.Cell textAlign='right' style={{backgroundColor: 'rgba(13,71,161,0.1)'}}>{val}%</Table.Cell>
			         			: <Table.Cell />
			         		})
			       		}
		        </Table.Row>
        	})
        }

        <Table.Row>
        	<Table.Cell>
	        	<Header>
	            <Header.Content>
              	{getLastRow(query)}
	              <Header.Subheader>{0}</Header.Subheader>
	            </Header.Content>
	          </Header>
	         </Table.Cell>
	         <Table.HeaderCell textAlign='right'>0%</Table.HeaderCell>
	         {Array(calculateRange(query)).fill(null).map(val => <Table.Cell/>)}
        </Table.Row>
      </Table.Header>
		</Table>
	)
}

const control = WrappedComponent =>
	class extends Component {
		constructor(){
			super()
			this.state = {
				open: false,
				dateChosen: '',
				dayNum: 0
			}
		}

		onCellClick = (date,dayNum) => () => {
			this.setState({open: true,dateChosen:date,dayNum:dayNum})
		}

		onChoose = () => this.setState({open:false})

		render() {
			const { query } = this.props
			const { open, dateChosen, dayNum } = this.state
			return(
				<div>	
					<WrappedComponent
						query={query}
						onCellClick={this.onCellClick}
					/>
					<Confirm 
						open={open}
	          onCancel={this.onChoose}
	          onConfirm={this.onChoose}
	          header='Create Cohort Segment?'
	          content={
 							<table style={{paddingLeft:'20px',paddingTop:'20px',paddingBottom:'20px'}}>
	 							<tbody>
	 								<tr style={{height:'20px'}}>
	 									<td>Cohort Group</td>
	 									<td style={{paddingLeft:'10px'}}>Acquisition {uppercaseFirstLetter(query.type,true)} {dateChosen}.</td>
	 								</tr>
	 								<tr style={{height:'20px'}}>
	 									<td>{uppercaseFirstLetter(query.type)} Range</td>
	 									<td style={{paddingLeft:'10px'}}>{dayNum} {query.type == 'date' ? 'day' : query.type}(s) after Acquisition {uppercaseFirstLetter(query.type)}.</td>
	 								</tr>
	 							</tbody>
 							</table>
 						}
          />
				</div>
			)
		}
	}

const UncontrolledTableComponent = control(ControlledTableComponent)
export {ControlledTableComponent,UncontrolledTableComponent}