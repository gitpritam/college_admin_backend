import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
  SendSmtpEmail,
} from "@getbrevo/brevo";

let emailAPI = new TransactionalEmailsApi();
emailAPI.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.EMAIL_BREVO_API_KEY || "",
);

export default emailAPI;
