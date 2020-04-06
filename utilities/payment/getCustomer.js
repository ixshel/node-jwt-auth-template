'use strict';
require('dotenv').config({ debug: process.env.DEBUG });
const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;

function getCustomerProfile(customerProfileId, callback) {
    var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(process.env.PAYMENT_APILOGINKEY);
    merchantAuthenticationType.setTransactionKey(process.env.PAYMENT_TRANSACTIONKEY);
    var getRequest = new ApiContracts.GetCustomerProfileRequest();
    getRequest.setCustomerProfileId(customerProfileId);
    getRequest.setMerchantAuthentication(merchantAuthenticationType);

    // pretty print request
    //console.log(JSON.stringify(createRequest.getJSON(), null, 2));
    var ctrl = new ApiControllers.GetCustomerProfileController(getRequest.getJSON());
    ctrl.execute(function () {
        var apiResponse = ctrl.getResponse();
        var response = new ApiContracts.GetCustomerProfileResponse(apiResponse);
        //pretty print response
        //  console.log(JSON.stringify(response, null, 2));
        if (response != null) {
            if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                let success = {
                    paymentProfileId: response.getProfile().getPaymentProfiles()[0].getCustomerPaymentProfileId(),
                    CustomerProfileID: response.getProfile().getCustomerProfileId(),
                    CustomerEmail: response.getProfile().getEmail(),
                    Description: response.getProfile().getDescription(),
                    payment: response.getProfile().getPaymentProfiles()[0].getPayment()
                }
                console.log(success);
                callback(success, null);
            } else {
                let error = {
                    'Error Code: ': response.getMessages().getMessage()[0].getCode(),
                    'Error message: ': response.getMessages().getMessage()[0].getText()
                }
                callback(null, error);
            }
        } else {
            let error = {
                ErroCode: 400,
                ErrorMessage: 'NULL Response'
            }
            callback(null, error);
        }
    });
}

if (require.main === module) {
    getCustomerProfile('40936719', function () {
        console.log('getCustomerProfile call complete.');
    });
}

module.exports.getCustomerProfile = getCustomerProfile;