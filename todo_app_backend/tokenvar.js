let checkToken = (req,res,next)=>{    
    var token = req.query.token || req.body.token // token = token.split(';');token=token[token.length-1];  
    // console.log('1',token);
          
    if(typeof(token) !== undefined){
        // console.log('2',token);
        if(token.startsWith('Bearer ')){
            // console.log('3',token);
            token=token.slice(7,token.length)
        }
        if(token.endsWith('=undefined')){
            token=token.slice(1,token.length-10)
        }
        // console.log('finaltoken',token);
        
        req.token = token;
        // res.json(token)
    }
    next()
}
module.exports = checkToken;