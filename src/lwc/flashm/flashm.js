/**
 * @author Vishnu Kumar
 * @email vishnukumarramawat@gmail.com
 * @desc This is Flash Middleware aka Flashm to make server calls faster across the Salesforce Lightning App. 
*/

//Flag to set debug on or off.
let isDebugOn = true;

//Cell's address
let blocks = new Map();

/**
 * @author Vishnu Kumar
 * @email vishnukumarramawat@gmail.com
 * @desc This method invokes the apex calls. 
*/
const invoke = (blockAddress , fun, payload = '' , forceRefresh = false) => {
    let cell = blockAddress + ( payload ? JSON.stringify(payload) : '' );

    let _promise;
    
    if( !forceRefresh ){
        _promise = getPromise(blockAddress, cell, payload );
    }

    if( _promise === undefined || forceRefresh ){

        if( payload ){
            _promise = fun( payload );
        }
        else{
            _promise = fun();
        }

        //Registering Cell
        let cells = new Map();
        if ( blocks.has(blockAddress) ){
            cells = blocks.get(blockAddress)
        }
        cells.set(cell, _promise );

        //Registering Block
        blocks.set(blockAddress, cells );

        log(blockAddress, payload, 'Server');
    }
    return _promise;
}

/**
 * @author Vishnu Kumar
 * @email vishnukumarramawat@gmail.com
 * @desc This method flush the cell.
*/
const flushCell = (blockAddress , payload = '') => {
    let cell = blockAddress + ( payload ? JSON.stringify(payload) : '' );
    if ( blocks.has(blockAddress) && blocks.get(blockAddress).has(cell) ){
        blocks.get(blockAddress).delete(cell);
    }
}

/**
 * @author Vishnu Kumar
 * @email vishnukumarramawat@gmail.com
 * @desc This method flush the given block and the cells inside it.
*/
const flushBlock = (blockAddress) => {
    if ( blocks.has(blockAddress) ){
        blocks.delete(blockAddress);
    }
}

/**
 * @author Vishnu Kumar
 * @email vishnukumarramawat@gmail.com
 * @desc This method flush all the blocks and cells.
*/
const flushAll = () => {
    blocks = new Map();
}

/**
 * @author Vishnu Kumar
 * @email vishnukumarramawat@gmail.com
 * @desc Getting the cached promises. 
*/
function getPromise( blockAddress, cell, payload ){

    if ( blocks.has(blockAddress) && blocks.get(blockAddress).has(cell) ){
        log(blockAddress, payload, 'Local');
        return blocks.get(blockAddress).get(cell);
    }
    return undefined;
}

/**
 * @author Vishnu Kumar
 * @email vishnukumarramawat@gmail.com
 * @desc Pritns the log statements.
*/
function log(cellAddress, payload, promiseSource){
    if( isDebugOn ){
        console.log( 'Flashm: ', { 'Cell Address' : cellAddress,
                       'Payload' : payload,
                       'Data Retrieved From' : promiseSource
                    });
    }
}

export default {
    invoke,
    flushCell,
    flushBlock,
    flushAll
};