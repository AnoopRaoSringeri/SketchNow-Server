export type SendEmailRequest = {
  to: string;
  subject: string;
  text: string;
};

export type SendEmailWithTemplateRequest = {
  to: string;
  subject: string;
  text: string;
  template: string;
  data?: { [key: string]: string };
};
