import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";


const healthcheck = asyncHandler( async (req, res) =>{
    return res
     .status(200)
     .json(new ApiResponse(200, "OK", "Healthcheck Passed!"))
})

export { healthcheck }