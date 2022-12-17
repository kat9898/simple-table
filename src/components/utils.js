import moment from 'moment';

export const sortingFunc = (sorting, sortDirection, rows, columns) => {
    //'Name' 'Down' [{id:'', name: ''}]
    //если строки и числа
    const sortingObj = columns?.find(column => column.header === sorting);
    const sortingProp = sortingObj.accessor;
    console.log(sortingProp);

    const sortedRowsDown = () => rows?.sort((a, b) => {
        //по убыванию или  Я-А Z-A
        console.log('1');
        if (a[sortingProp] < b[sortingProp]) {
            return -1;
        }
        if (a[sortingProp] > b[sortingProp]) {
            console.log(a[sortingProp], b[sortingProp]);
            return 1;
        }
        return 0;  
    });

    const sortedRowsUp = () => rows?.sort((a, b) => {
        //по убыванию или  Я-А Z-A
        console.log('2');

        if (a[sortingProp] > b[sortingProp]) {
            return -1;
        }
        if (a[sortingProp] < b[sortingProp]) {
            return 1;
        }
        return 0;
    });

    //даты
    // по убыванмю
    
    const sortedRowsDownDate = () => {
        console.log('3');
        return rows?.sort((a, b) => moment(a[sortingProp], 'DD.MM.YYYY').valueOf() - moment(b[sortingProp], 'DD.MM.YYYY')).valueOf()};

    // по возрастанию

    const sortedRowsUpDate = () => {
        console.log('4');
        return rows?.sort((a, b) => moment(b[sortingProp], 'DD.MM.YYYY').valueOf() - moment(a[sortingProp], 'DD.MM.YYYY')).valueOf()};

    if (sorting === 'Delivery Date') {
        if (sortDirection === 'up')  return sortedRowsUpDate()
        else return sortedRowsDownDate()
    } else {
        if (sortDirection === 'up')  return sortedRowsUp()
        else return sortedRowsDown()
    }
}

export const filterFunc = (filterColumn, filterValue, columns, rows) => {
    if (filterColumn === '') return rows;
    const filterObj = columns?.find(column => column.header === filterColumn);

    const filterProp = filterObj?.accessor;
    const filteredRows = filterValue === '' ? rows : rows.filter((row) => {
        return row[filterProp].includes(filterValue)
    })
    console.log(filteredRows)
    return filteredRows
}