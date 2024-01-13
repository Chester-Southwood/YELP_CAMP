/*
    Used by passing in function and catching if error occurs by running passed in middle ware
*/

module.exports = func => {
    return (request, response, next) => {
        func (request, response, next).catch(next);
    }
}