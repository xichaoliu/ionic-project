import {Action} from "@ngrx/store";

export interface ChildAction extends Action{
  payload?: any;
}
export const REGION_SWITCH = 'REGION_SWITCH';
export const REGION_CODE = 'REGION_CODE';
export const REGION_COORDS = 'REGION_COORDS';
export const COORD = 'COORD';
export const CHOSED_ITEM = 'CHOSED_ITEM';
export const CLEAR_STATUS = 'CLEAR_STATUS';
