// import queryString from 'query-string';
// const value=queryString.parse(this.props.location.search);
// const token=value.key;

let checkToken = (req,res,next)=>{    
    var token = req.query.token || req.body.token // token = token.split(';');token=token[token.length-1];  
    if(typeof(token) !== undefined){ 
        req.token = token;
    }
    next()
}
module.exports = checkToken;