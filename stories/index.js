import React from 'react';
import 'semantic-ui-css/semantic.min.css'

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import { ControlledTableComponent, UncontrolledTableComponent } from '../src/TableComponent'
import { ControlledFilter, UncontrolledFilter } from '../src/Filter'

const query = {
	type: 'date',
	from: '4 Aug 2017',
	to: '10 Aug 2017',
	data: {
		cells: [
			[17.01,  7.54,  4.07,  1.58,   2.4,     0],
			[ 4.08,  1.89,  0.62,  0.86,  	 0,  null],
			[ 4.08,  0.79,  0.96,  		0,	null,	 null],
			[ 1.99,  1.2 ,  	 0,	 null,	null,	 null],
			[ 5.34,  		0,	null,	 null,	null,	 null],
			[ 	 0,	 null,	null,	 null,	null,	 null]
		],
		users: [835,3701,3433,2660,1348,1866]
	}
}

const weekQuery = {
	type: 'week',
	from: '7 Jul 2017',
	to: '8 Aug 2017',
	data: {
		cells: [
			[48.92,   32.6,  25.18,  10.5,     0],
			[33.33,  29.88,   21.2,     0,  null],
			[ 21.2,  		10,   	 0,  null,  null],
			[19.55,      0,   null,  null,  null],
			[    0,   null,   null,  null,  null]
		],
		users: [12345,10101,8989,6845,9765]
	}
}

storiesOf('Filter',module)
	.add('Uncontrolled', () => <UncontrolledFilter />)

storiesOf('Table Component',module)
	.add('by Date', () => <UncontrolledTableComponent query={query} />)
	.add('by Week', () => <UncontrolledTableComponent query={weekQuery} />)