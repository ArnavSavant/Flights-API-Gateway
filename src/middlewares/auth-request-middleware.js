const { StatusCodes } = require("http-status-codes");

const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");

const { UserService } = require("../services");
function validateAuthRequest(req, res, next) {
	if (!req.body.email) {
		ErrorResponse.messages =
			"Something went wrong while authenticating the user";
		ErrorResponse.error = new AppError(
			["Email not found in the incoming request in the correct form"],
			StatusCodes.BAD_REQUEST
		);
		return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
	}
	if (!req.body.password) {
		ErrorResponse.messages =
			"Something went wrong while authenticating the user";
		ErrorResponse.error = new AppError(
			["Password not found in the incoming request in the correct form"],
			StatusCodes.BAD_REQUEST
		);
		return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
	}
	next();
}
async function checkAuthentication(req, res, next) {
	try {
		const response = await UserService.isAuthenticated(
			req.headers["x-access-token"]
		);
		if (response) {
			req.user = response;
			next();
		}
	} catch (error) {
		return res.status(error.statusCode).json(error);
	}
}

async function isAdmin(req, res, next) {
	const response = await UserService.isAdmin(req.user);
	if (!response) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ message: "User is not authorized to perform following action" });
	}
	next();
}
module.exports = {
	validateAuthRequest,
	checkAuthentication,
	isAdmin,
};
