'use strict';

require('dotenv').config({ debug: process.env.DEBUG });
const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;

function updateCustomerPaymentProfile(req, callback) {
	console.log("-- updateCustomerPaymentProfile --");

	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(process.env.PAYMENT_APILOGINKEY);
	merchantAuthenticationType.setTransactionKey(process.env.PAYMENT_TRANSACTIONKEY);

	var creditCardForUpdate = new ApiContracts.CreditCardType();
	creditCardForUpdate.setCardNumber(req.setCardNumber);
	creditCardForUpdate.setExpirationDate(req.setExpirationDate);
	creditCardForUpdate.setCardCode(req.setCardCode);


	var paymentType = new ApiContracts.PaymentType();
	paymentType.setCreditCard(creditCardForUpdate);

	var customerForUpdate = new ApiContracts.CustomerPaymentProfileExType();
	customerForUpdate.setPayment(paymentType);
	customerForUpdate.setDefaultPaymentProfile(true);


	customerForUpdate.setCustomerPaymentProfileId(req.customerPaymentProfileId);
	// customerForUpdate.setBillTo(customerAddressType);

	var updateRequest = new ApiContracts.UpdateCustomerPaymentProfileRequest();
	updateRequest.setMerchantAuthentication(merchantAuthenticationType);
	updateRequest.setCustomerProfileId(req.customerProfileId);
	updateRequest.setPaymentProfile(customerForUpdate);
	// updateRequest.setValidationMode(ApiContracts.ValidationModeEnum.LIVEMODE);


	//pretty print request
	console.log(JSON.stringify(updateRequest.getJSON(), null, 2));

	var ctrl = new ApiControllers.UpdateCustomerPaymentProfileController(updateRequest.getJSON());

	ctrl.execute(function () {

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.UpdateCustomerPaymentProfileResponse(apiResponse);

		//pretty print response
		//console.log(JSON.stringify(response, null, 2));

		if (response != null) {
			if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
				console.log("5555 Success");

				let success = {
					PaymentID: req.customerPaymentProfileId,
					Message: "Successfully updated a customer Card Details"
				}
				console.log('Successfully updated a customer payment profile with id: ' + req.customerPaymentProfileId);
				callback(success, null)
			} else {

				let error = {
					ErrorCode: response.getMessages().getMessage()[0].getCode(),
					Errormessage: response.getMessages().getMessage()[0].getText()
				}
				//console.log('Result Code: ' + response.getMessages().getResultCode());
				console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
				console.log('Error message: ' + response.getMessages().getMessage()[0].getCode());
				callback(null, error)
			}
		} else {
			let error = {
				ErrorMessage: "Null response received"
			}
			callback(null, error);

		}

	});
}

if (require.main === module) {
	updateCustomerPaymentProfile(cc, cc, function () {
		console.log('updateCustomerPaymentProfile call complete.');
	});
}

module.exports.updateCustomerPaymentProfile = updateCustomerPaymentProfile;