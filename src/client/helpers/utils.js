/*
 * Copyright (C) 2016  Daniel Hsing
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
import {Iterable} from 'immutable';
import _ from 'lodash';
import {format} from 'date-fns';

/**
 * Injects entity model object with a default alias name property.
 *
 * @param {object} instance - Entity object.
 * @returns {object} - New object with injected properties.
 */
export function injectDefaultAliasName(instance) {
	if (instance && instance.name) {
		return Object.assign({}, instance, {
			defaultAlias: {
				name: instance.name
			}
		});
	}
	return instance;
}

export function formatDate(date, includeTime) {
	if (!date) {
		return null;
	}

	if (includeTime) {
		return format(date, 'yyyy-MM-dd HH:mm:ss');
	}
	return format(date, 'yyyy-MM-dd');
}

const MILLISECONDS_PER_DAY = 86400000;

export function isWithinDayFromNow(date) {
	return Boolean(Date.now() - date.getTime() < MILLISECONDS_PER_DAY);
}

export function labelsForAuthor(isGroup) {
	return {
		beginAreaLabel: isGroup ? 'Place founded' : 'Place of birth',
		beginDateLabel: isGroup ? 'Date founded' : 'Date of birth',
		endAreaLabel: isGroup ? 'Place of dissolution' : 'Place of death',
		endDateLabel: isGroup ? 'Date of dissolution' : 'Date of death',
		endedLabel: isGroup ? 'Dissolved?' : 'Died?'
	};
}

export function convertMapToObject(value) {
	return Iterable.isIterable(value) ? value.toJS() : value;
}

export function getTodayDate() {
	const date = new Date();
	const year = date.getFullYear().toString();
	const month = (date.getMonth() + 1).toString();
	const day = date.getDate().toString();
	return {day, month, year};
}

/**
 * Format a {day, month, year} object into an ISO 8601-2004 string (±YYYYYY-MM-DD)
 * This is a duplicate of a util that cannot be direcly imported from src/server/helpers/entityRouteUtils.js
 * @function dateObjectToISOString
 * @param {string} value - a {day, month, year} object
 * @returns {string} ISO 8601-2004 string (±YYYYYY-MM-DD)
 */
export function dateObjectToISOString(value) {
	const isCommonEraDate = Math.sign(value.year) > -1;
	// Convert to ISO 8601:2004 extended for BCE years (±YYYYYY)
	let date = `${isCommonEraDate ? '+' : '-'}${_.padStart(Math.abs(value.year).toString(), 6, '0')}`;
	if (value.month) {
		date += `-${value.month}`;
		if (value.day) {
			date += `-${value.day}`;
	  }
	}
	return date;
}
