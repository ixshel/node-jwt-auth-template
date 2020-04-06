'use strict';
require('dotenv').config({ debug: process.env.DEBUG });
const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;

function getRandomInt() {
	let a = Math.floor((Math.random() * 1000) + 1) + Math.floor((Math.random() * 1000) + 1);
	return a;
}


function chargeCustomerProfile(req, callback) {
	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(process.env.PAYMENT_APILOGINKEY);
	merchantAuthenticationType.setTransactionKey(process.env.PAYMENT_TRANSACTIONKEY);

	var profileToCharge = new ApiContracts.CustomerProfilePaymentType();
	profileToCharge.setCustomerProfileId(req.customerProfileID);

	var paymentProfile = new ApiContracts.PaymentProfile();
	paymentProfile.setPaymentProfileId(req.customerPaymentProfileID);
	profileToCharge.setPaymentProfile(paymentProfile);

	var orderDetails = new ApiContracts.OrderType();
	orderDetails.setInvoiceNumber(`INV-${getRandomInt()}`);
	orderDetails.setDescription(req.plan_name);

	var customerAddress = new ApiContracts.CustomerAddressType();
	customerAddress.setFirstName(req.first_name);
	customerAddress.setLastName(req.last_name);
	customerAddress.setAddress(req.street_address);
	customerAddress.setCity(req.city);
	customerAddress.setState(req.state);
	customerAddress.setZip(req.zip);
	customerAddress.setCountry(req.country);
	customerAddress.setPhoneNumber(req.phone);

	var transactionRequestType = new ApiContracts.TransactionRequestType();
	transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
	transactionRequestType.setProfile(profileToCharge);
	transactionRequestType.setAmount(req.price);
	// transactionRequestType.setLineItems(lineItem);
	transactionRequestType.setOrder(orderDetails);

	var createRequest = new ApiContracts.CreateTransactionRequest();
	createRequest.setMerchantAuthentication(merchantAuthenticationType);
	createRequest.setTransactionRequest(transactionRequestType);

	//pretty print request
	console.log(JSON.stringify(createRequest.getJSON(), null, 2));

	var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());

	ctrl.execute(function () {

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.CreateTransactionResponse(apiResponse);

		//pretty print response
		console.log(JSON.stringify(response, null, 2));

		if (response != null) {
			if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
				if (response.getTransactionResponse().getMessages() != null) {
					let success = {
						TransactionID: response.getTransactionResponse().getTransId(),
						ResponseCode: response.getTransactionResponse().getResponseCode(),
						MessageCode: response.getTransactionResponse().getMessages().getMessage()[0].getCode(),
						Description: response.getTransactionResponse().getMessages().getMessage()[0].getDescription(),
						Message: "Payment Successfully Completed"
					}
					console.log('Successfully created transaction with Transaction ID: ' + response.getTransactionResponse().getTransId());
					console.log('Response Code: ' + response.getTransactionResponse().getResponseCode());
					console.log('Message Code: ' + response.getTransactionResponse().getMessages().getMessage()[0].getCode());
					console.log('Description: ' + response.getTransactionResponse().getMessages().getMessage()[0].getDescription());
					callback(success, null)
				} else {
					console.log('Failed Transaction.');
					if (response.getTransactionResponse().getErrors() != null) {
						let error = {
							ErroCode: response.getTransactionResponse().getErrors().getError()[0].getErrorCode(),
							ErrorMessage: response.getTransactionResponse().getErrors().getError()[0].getErrorText()
						}
						callback(null, error);
						console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
						console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
					}
				}
			} else {
				console.log('Failed Transaction. ');
				if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null) {
					let error = {
						ErroCode: response.getTransactionResponse().getErrors().getError()[0].getErrorCode(),
						ErrorMessage: response.getTransactionResponse().getErrors().getError()[0].getErrorText()
					}
					callback(null, error);

					console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
					console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
				} else {

					let error = {
						ErroCode: response.getMessages().getMessage()[0].getCode(),
						ErrorMessage: response.getMessages().getMessage()[0].getText()
					}
					callback(null, error);

					console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
					console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
				}
			}
		} else {
			let error = {
				ErroCode: 400,
				ErrorMessage: 'Null Response.'
			}
			callback(null, error);
		}
	});
}

if (require.main === module) {
	chargeCustomerProfile('111111', '222222', function () {
		console.log('chargeCustomerProfile call complete.');
	});
}

module.exports.chargeCustomerProfile = chargeCustomerProfile;