/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {CalibrationModeTypes, MapMetadata, MapsAction, MapState} from '../types/redux/map';
import {ActionType} from '../types/redux/actions';
import {CalibratedPoint} from "../utils/calibration";
import * as _ from "lodash";

const defaultState: MapState = {
	calibrationMode: CalibrationModeTypes.initiate,
	isLoading: false,
	byMapID: {},
	selectedMaps: [],
	editedMaps: {},
	// name: 'default',
	// isDisplayable: false,
	// note: 'left as blank',
	// filename: 'image',
	// lastModified: '',
	// image: new Image(),
	// currentPoint: {gps: {longitude: -1, latitude: -1}, cartesian: {x: -1, y: -1}},
	// calibrationSet: [],
	// calibrationResult: {origin: {longitude: 0, latitude: 0}, opposite: {longitude: 0, latitude: 0}},
};

export default function maps(state = defaultState, action: MapsAction) {
	switch (action.type) {
		case ActionType.UpdateMapMode:
			return {
				...state,
				calibrationMode: action.nextMode
			};
		case ActionType.RequestMapsDetails:
			return {
				...state,
				isLoading: true
			};
		case ActionType.ReceiveMapsDetails:
			const data: MapMetadata[] = action.data.map(mapData => {
				let image = new Image();
				image.src = mapData.mapSource;
				return {
					...mapData,
					image: image,
				}
			});
			return {
				...state,
				isLoading: false,
				byMapID: _.keyBy(data, map => map.id)
			};
		case ActionType.RequestSelectedMap:
			return {
				...state,
				isLoading: true
			};
		case ActionType.ReceiveSelectedMap:
			const receivedImage = new Image();
			receivedImage.src = action.map.mapSource;
			return {
				...state,
				isLoading: false,
				name: action.map.name,
				note: action.map.note,
				image: receivedImage,
				filename: action.map.filename,
				calibrationResult: {
					origin: action.map.origin,
					opposite: action.map.opposite,
				}
			}
		case ActionType.UpdateMapSource:
			const newImage = new Image();
			newImage.src = action.data.mapSource;
			return {
				...state,
				name: action.data.name,
				note: action.data.note, //should notes be updated only after upload is complete?
				image: newImage,
				filename: action.data.filename,
				isLoading: false
			};
		case ActionType.UpdateCurrentCartesian:
			return {
				...state,
				currentPoint: {
					...state.currentPoint,
					cartesian: action.currentCartesian,
				},
			};
		case ActionType.UpdateCurrentGPS:
			return {
				...state,
				currentPoint: {
					...state.currentPoint,
					gps: action.currentGPS,
				}
			};
		case ActionType.ResetCurrentPoint:
			return {
				...state,
				currentPoint: {gps: {longitude: -1, latitude: -1}, cartesian: {x: -1, y: -1}},
			};
		case ActionType.AppendCalibrationSet:
			return {
				...state,
				calibrationSet: [
					...state.calibrationSet.slice(0),
					action.calibratedPoint,
				],
			};
		case ActionType.UpdateCalibrationResults:
			return {
				...state,
				calibrationResult: action.result
			};
		case ActionType.DisplayMapLoading:
			return {
				...state,
				isLoading: true
			};
		default:
			return state;
	}
}
