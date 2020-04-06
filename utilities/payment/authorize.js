'use strict';
require('dotenv').config({ debug: process.env.DEBUG });
const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;

function getRandomInt() {
    let a = Math.floor((Math.random() * 1000) + 1) + Math.floor((Math.random() * 1000) + 1);
    return a;
}

function chargeCreditCard(req, callback) {
    console.log("inside payment", req)
    var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(process.env.PAYMENT_APILOGINKEY);
    merchantAuthenticationType.setTransactionKey(process.env.PAYMENT_TRANSACTIONKEY);

    var creditCard = new ApiContracts.CreditCardType();
    creditCard.setCardNumber(req.setCardNumber);
    creditCard.setExpirationDate(req.setExpirationDate);
    creditCard.setCardCode(req.setCardCode);

    var paymentType = new ApiContracts.PaymentType();
    paymentType.setCreditCard(creditCard);


    var orderDetails = new ApiContracts.OrderType();
    orderDetails.setInvoiceNumber(`INV-${getRandomInt()}`);
    orderDetails.setDescription(req.plan_name);

    var transactionRequestType = new ApiContracts.TransactionRequestType();
    transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
    transactionRequestType.setPayment(paymentType);
    transactionRequestType.setAmount(req.price);
    transactionRequestType.setOrder(orderDetails);

    var createRequest = new ApiContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setTransactionRequest(transactionRequestType);

    //pretty print request
    var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
    //Defaults to sandbox
    //ctrl.setEnvironment(SDKConstants.endpoint.production);

    ctrl.execute(function () {
        var apiResponse = ctrl.getResponse();
        var response = new ApiContracts.CreateTransactionResponse(apiResponse);
        //pretty print response
        // console.log("response", JSON.stringify(response, null, 2));
        if (response != null) {
            if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                if (response.getTransactionResponse().getMessages() != null) {
                    let success = {
                        TransactionID: response.getTransactionResponse().getTransId(),
                        ResponseCode: response.getTransactionResponse().getResponseCode(),
                        MessageCode: response.getTransactionResponse().getMessages().getMessage()[0].getCode(),
                        Description: response.getTransactionResponse().getMessages().getMessage()[0].getDescription()
                    }
                    //Once transaction is done , add to seller card to refund payment
                    // creditBankAccount(a); 
                    callback(success, null);

                } else {
                    if (response.getTransactionResponse().getErrors() != null) {
                        let error = {
                            ErroCode: response.getTransactionResponse().getErrors().getError()[0].getErrorCode(),
                            ErrorMessage: response.getTransactionResponse().getErrors().getError()[0].getErrorText()
                        }
                        callback(null, error);
                    }
                }
            } else {
                if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null) {
                    let error = {
                        ErroCode: response.getTransactionResponse().getErrors().getError()[0].getErrorCode(),
                        ErrorMessage: response.getTransactionResponse().getErrors().getError()[0].getErrorText()
                    }
                    callback(null, error);

                } else {

                    let error = {
                        ErroCode: response.getMessages().getMessage()[0].getCode(),
                        ErrorMessage: response.getMessages().getMessage()[0].getText()
                    }
                    callback(null, error);
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
    chargeCreditCard(function () {
        console.log('chargeCreditCard call complete.');
    });
}

module.exports.chargeCreditCard = chargeCreditCard;