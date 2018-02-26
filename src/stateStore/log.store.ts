export interface Region {
  city:any;
  region_code:any;
  region_coords:any;
}
export interface Coordination {
 coord:any;
 chosedData:Data
}
interface Data{
  item:any;
  id:any;
}
export const INITIAL_REGION: Region = {
  city:'济南市',
  region_code:'370000',
  region_coords:'117.02496706629,36.682784727161'
};
export  const INITIAL_COORD:Coordination = {
 coord:'',
  chosedData:{
   item:'',
    id:''
  }
};
