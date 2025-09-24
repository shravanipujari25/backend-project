const asyncHandler=(requestHandler)=>{
   return (req, res, next) => {
       Promise.resolve(requestHandler(req,res,next)).
           catch((error) => next(error))
   }
 }

export {asyncHandler}
//higher order function
// const asyncHandler=(fn)=>async function (req, res, next) {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }