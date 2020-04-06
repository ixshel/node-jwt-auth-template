require('dotenv').config({ debug: process.env.DEBUG });
const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;

function getDate() {
  return (new Date()).toISOString().substring(0, 10);
}

function getRandomString(text) {
  return text + Math.floor((Math.random() * 100000) + 1);
}

function createCustomerProfile(req, cardDetails, callback) {
  const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(process.env.PAYMENT_APILOGINKEY);
  merchantAuthenticationType.setTransactionKey(process.env.PAYMENT_TRANSACTIONKEY);

  const interval = new ApiContracts.PaymentScheduleType.Interval();
  interval.setLength(1);
  interval.setUnit(ApiContracts.ARBSubscriptionUnitEnum.MONTHS);

  const paymentScheduleType = new ApiContracts.PaymentScheduleType();
  paymentScheduleType.setInterval(interval);
  paymentScheduleType.setStartDate(getDate());
  paymentScheduleType.setTotalOccurrences(9999);
  paymentScheduleType.setTrialOccurrences(1);

  const creditCard = new ApiContracts.CreditCardType();
  creditCard.setCardNumber(cardDetails.setCardNumber);
  creditCard.setExpirationDate(cardDetails.setExpirationDate);
  creditCard.setCardCode(cardDetails.setCardCode);

  const paymentType = new ApiContracts.PaymentType();
  paymentType.setCreditCard(creditCard);

  const customerAddress = new ApiContracts.CustomerAddressType();
  customerAddress.setFirstName(req.first_name);
  customerAddress.setLastName(req.last_name);
  customerAddress.setAddress(req.street_address);
  customerAddress.setCity(req.city);
  customerAddress.setState(req.state);
  customerAddress.setZip(req.zip);
  customerAddress.setCountry(req.country);
  customerAddress.setPhoneNumber(req.phone);

  const customerPaymentProfileType = new ApiContracts.CustomerPaymentProfileType();
  customerPaymentProfileType.setCustomerType(ApiContracts.CustomerTypeEnum.INDIVIDUAL);
  customerPaymentProfileType.setPayment(paymentType);
  customerPaymentProfileType.setBillTo(customerAddress);

  const paymentProfilesList = [];
  paymentProfilesList.push(customerPaymentProfileType);

  const customerProfileType = new ApiContracts.CustomerProfileType();
  customerProfileType.setMerchantCustomerId(`MSA_${getRandomString('cust')}`);
  customerProfileType.setDescription('Practice Admin');
  customerProfileType.setEmail(req.email);
  customerProfileType.setPaymentProfiles(paymentProfilesList);

  const createRequest = new ApiContracts.CreateCustomerProfileRequest();
  createRequest.setProfile(customerProfileType);
  createRequest.setValidationMode(ApiContracts.ValidationModeEnum.TESTMODE);
  createRequest.setMerchantAuthentication(merchantAuthenticationType);

  // pretty print request
  // console.log(JSON.stringify(createRequest.getJSON(), null, 2));


  const ctrl = new ApiControllers.CreateCustomerProfileController(createRequest.getJSON());

  ctrl.execute(() => {

    const apiResponse = ctrl.getResponse();

    const response = new ApiContracts.CreateCustomerProfileResponse(apiResponse);

    // pretty print response
    // console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
        const success = {
          profileId: response.getCustomerProfileId()
          // paymentProfileId: response.getPaymentProfile().getCustomerPaymentProfileId()

        };
        callback(success, null);
      } else {
        const error = {
          ResultCode: response.getMessages().getResultCode(),
          ErrorCode: response.getMessages().getMessage()[0].getCode(),
          ErrorMessage: response.getMessages().getMessage()[0].getText()
        };
        callback(null, error);
      }
    } else {
      const error = {
        ErroCode: 400,
        ErrorMessage: 'NULL Response'
      };
      callback(null, error);
    }
  });
}

if (require.main === module) {
  createCustomerProfile(() => {
    console.log('createCustomerProfile call complete.');
  });
}

module.exports.createCustomerProfile = createCustomerProfile;
