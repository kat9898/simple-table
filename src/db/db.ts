import Dexie from 'dexie';
import {Row} from '../types';


export const db = new Dexie('ordersDatabase');
db.version(1).stores({
  orders: '++id, status, sum, qty, volume, name, delivery_date, currency'
});

