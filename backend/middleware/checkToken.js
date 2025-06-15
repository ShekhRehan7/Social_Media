import jwt from 'jsonwebtoken'
const JWT_SECRET = 'SocialApp'

const checkToken = (req, res, next)=>{
    let token  = req.headers.authorization;
    // console.log(token)
    if(!token){
        return res.status(401).json({msg:"Unauthorized"})
    }

    try {
        let decoded =  jwt.verify(token, JWT_SECRET) // {_id}
        req.user = decoded
        // console.log(decoded)
        next()
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
}

export default checkToken