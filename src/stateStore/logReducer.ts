import {Coordination, INITIAL_COORD, INITIAL_REGION, Region} from './log.store';
import {ChildAction, CHOSED_ITEM, CLEAR_STATUS, COORD, REGION_CODE, REGION_COORDS, REGION_SWITCH} from './action';

export function regionReducer(state: Region = INITIAL_REGION , action: ChildAction) {
  switch (action.type) {
    case REGION_SWITCH:
    return {...state, city: action.payload};
    case REGION_CODE:
    return {...state, region_code: action.payload};
    case REGION_COORDS:
    return {...state, region_coords: action.payload};
    default:
      return state;
  }
}
export function mapNavReducer(state: Coordination = INITIAL_COORD , action: ChildAction){
  switch(action.type) {
    case COORD:
      return {...state, coord: action.payload};
    case CHOSED_ITEM:
      return {...state, chosedData: action.payload};
    case CLEAR_STATUS:
      return INITIAL_COORD;
    default:
      return state;
  }
}

