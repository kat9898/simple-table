import React, {useState, useEffect, useMemo, useCallback} from 'react';
import _ from 'lodash';
import { Modal } from 'antd';
import {sortingFunc, filterFunc} from './utils.js';
import {data1, data2} from '../data';

import arrow from '../assets/up-arrow-svgrepo-com.svg';
import search from '../assets/search-svgrepo-com.svg';
import close from '../assets/close-svgrepo-com (1).svg';

import {Row, IColumsNames, SortOrder, CheckedInterface} from '../types';

import './Table.scss';

type Props = {
}

  const columnsData: IColumsNames[] = [
    {
        header: 'Name',
        accessor: 'name'
    },
    {
        header: 'Status',
        accessor: 'status'
    },
    {
        header: 'Volume',
        accessor: 'volume'
    },
    {
        header: 'Delivery Date',
        accessor: 'delivery_date'
    },
    {
        header: 'Quantity',
        accessor: 'qty'
    },
    {
        header: 'Sum',
        accessor: 'sum'
    },
    {
        header: 'Total',
        accessor: 'total'
    },
    {
        header: 'Currency',
        accessor: 'currency'
    }
];

const Table = (props: Props) => {
    const [rows, setRows] = useState<Row[]>([]);
    const [currentRows, setCurrentRows] = useState<Row[]>([]);
    const [checkedRows, setCheckedRows] = useState<CheckedInterface>({
    });

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [sorting, setSorting] = useState<String>('Delivery Date');
    const [sortDirection, setSortDirection] = useState<SortOrder>('down');

    const [filterColumn, setFilterColumn] = useState<string>('');
    const [filterValue, setFilterValue] = useState<string>('');

    const columns = useMemo(() => columnsData, []);

    useEffect(() => {
        //добавляем столбец Всего
        const addColumn = (data: Row[]) => {
            return data?.map((row: Row) => {
                row.total = row.qty*row.sum;
                return row;
            }); 
        }
        const getData = async () => {
            try {
              const resp1 = await fetch('/documents1');
              const resp2 = await fetch('/documents2');
              const data1 = await resp1.json();
              const data2 = await resp2.json();
              const rowsList = addColumn([...data1, ...data2]);
              setCurrentRows(rowsList);
              setRows(rowsList);
            } catch (error) {
              console.log('Failed download data from server');
              setCurrentRows([...data1, ...data2]);
              setRows([...data1, ...data2]);
            }
          }
        getData();

        let objChecked: CheckedInterface = {};
        for (let i = 0; i < currentRows?.length; i++) {
            objChecked[i] = false;
        }
        setCheckedRows(objChecked); 
    }, [])

    const totalVolume = useMemo(() => rows?.length && rows.reduce((accum: number, curVal: any) => accum + curVal.volume, 0 ), []); 

    const totalQty = useMemo(() => rows?.length && rows.reduce((accum: number, curVal: any) => accum + curVal.qty, 0 ), []);

    useEffect(() => {
        const sortedData = sortingFunc(sorting, sortDirection, rows, columns);
        setCurrentRows(sortedData);
    }, [sorting, sortDirection]) 

    useEffect(() => {
        setCurrentRows(filterFunc(filterColumn, filterValue, columns, rows));
    }, [filterValue])


    //сортировка

    const handleSort = (key: string): void => {
        setSorting(key);
    }

    const handleSortDirection = (): void => {
        setSortDirection(sortDirection === 'up' ? 'down' : 'up');
    }

    //поиск

    const handleSearch = (key: string): void => {
        setFilterColumn(key);
    }

    const handleCloseSearch = (): void => {
        setFilterColumn('');
        setFilterValue('');
    }

    const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFilterValue(e.target.value);
    }

    //модалка удаления

    const showModal = (): void => {
        setIsModalOpen(true);
      };
    
      const handleOk = (): void => {
        setIsModalOpen(false);
        const idArr: any = [];
        Object.keys(checkedRows).map((num) => {
            if (checkedRows[Number(num)] === true) idArr.push(currentRows[Number(num)].id);
        });

        requestDelete(idArr);
      };
    
      const handleCancel = (): void => {
        setIsModalOpen(false);
      };

      //запрос удаления
      const requestDelete = async (data: string[]) => {
        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        };
        try {
            const fetchResponse = await fetch(`/cancel`, settings);
            const data = await fetchResponse.json();
            return data;
        } catch (e) {
            console.log('Delete request failed for:', data.join(', '));
        }    
    
    }

      //выбор строки

      const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, row?: Row, id?: number) => {
        if (!row && e.target.checked) {
            let objChecked: CheckedInterface = {};
            for (let i = 0; i < currentRows?.length; i++) {
                objChecked[i] = true;
            }
            setCheckedRows(objChecked);
            return;
        };
        if (!row && !e.target.checked) {
            let objChecked: CheckedInterface = {};
            for (let i = 0; i < currentRows?.length; i++) {
                objChecked[i] = false;
            }
            setCheckedRows(objChecked);
            return;
        };
        if (row && id != undefined) {
            let objChecked: any = {...checkedRows, [id]: !checkedRows[id]};
            setCheckedRows(objChecked);
            return;
        };
      }


  return (
    <div>
        <table>
            <thead>
                <tr>
                    <th>
                        <input type="checkbox" onChange={handleCheck} />
                    </th>
                    {columns.map((obj, id) => {
                        return (
                            <th key={id}>
                                <img 
                                    className='searchImg'  
                                    src={search} 
                                    alt='search'
                                    onClick={() => handleSearch(obj.header)}
                                /> 
                                <span onClick={() => handleSort(obj.header)}>{obj.header}</span>
                                {sorting === obj.header && 
                                <img  
                                    onClick={handleSortDirection}
                                    className={`arrowImg ${sortDirection === 'down' ? "down" : ""}`} 
                                    src={arrow} 
                                    alt="sorting" 
                                />}
                                {filterColumn === obj.header && 
                                    <form>
                                        <input 
                                            type="text"
                                            onChange={handleChangeSearch}
                                        />
                                        <img 
                                            onClick={handleCloseSearch}
                                            src={close} 
                                            alt="close" 
                                        />
                                    </form>
                                }
                            </th>
                        )
                    })}
                </tr>
            </thead>
            <tbody>
                {currentRows?.length && currentRows.map((row: any, id: number) => {
                return (
                    <tr key={id}>
                        <td>
                            <input 
                                type="checkbox" 
                                onChange={(e) => handleCheck(e, row, id)}
                                checked={checkedRows[id]} 
                            /></td>
                        <td>{row.name}</td>
                        <td>{row.status}</td>
                        <td>{row.volume}</td>
                        <td>{row.delivery_date}</td>
                        <td>{row.qty}</td>
                        <td>{row.sum}</td>
                        <td>{row.total}</td>
                        <td>{row.currency}</td>
                    </tr>
                )})}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={2}>{`Total Volume: ${totalVolume}`}</td>
                    <td colSpan={2}>{`Total amount: ${totalQty}`}</td>
                </tr>
            </tfoot>
        </table>
        <button className='annul' onClick={showModal}>Delete</button>
        <Modal title="Confirm delete" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>Are you sure you want to delete this goods: {Object.keys(checkedRows).map((num) => {
                if (checkedRows[Number(num)] === true) return currentRows[Number(num)].name;
            }).filter(function (el) {
                return el != null;
              }).join(', ')}?</p> 
            
        </Modal>
    </div>
    
  )
}

export default Table