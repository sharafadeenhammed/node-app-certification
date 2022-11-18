// const errorResponse = require("../utils/errorResponse");
const advancedResult = (model, populate) => async (req, res, next) => {
    // making a copy of req.query
    const reqQuery = { ...req.query };
    
    //fields to exclude for filtering
    const removeFields = ["select", "sort", "limit", "page"];
    
    //loop over removeFields and delete from reqQuery
    removeFields.forEach(field => delete reqQuery[field]);

    //creating a query string
    let queryStr = JSON.stringify(reqQuery);

    //create operators like $gt,$gte,etc
    queryStr = queryStr.replace(/\b(gt|gte|le|lte|in|lt|eq)\b/g, match => `$${match}`);
    // console.log( "query String: ", typeof JSON.parse(queryStr).weeks.$lte);

    // Finding resourse
    let query = model.find(JSON.parse(queryStr));
    
    //selecting fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }
    
    if (populate) {
        query =  query.populate(populate);
    }

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
    query = query.skip(startIndex).limit(limit);
    let pagination = {};
        
    // else{
    // query = query.sort("-createdAt");
    // }

    //executing query
    const result = await query;

    // setting the fields on tghe pagination object;
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit: limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit: limit
        }
    }
    if (result.length == 0) {
        pagination = {};
    }
    res.searchResult = {
        success: true,
        msg: `showing ${model.modelName}s`,
        count: result.length,
        pagination,
        Data: result
    }
    next();
}

module.exports = advancedResult;

