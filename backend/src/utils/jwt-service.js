import jwt from 'jsonwebtoken'

class JwtService {
  signToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    })
  }
  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET)
  }
}
export const jwtService = new JwtService()
