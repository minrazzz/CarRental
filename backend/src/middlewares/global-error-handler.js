export const globalErrorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500
  const message = error.message || 'Something went wrong'
  res.status(statusCode).json({ message })
}
