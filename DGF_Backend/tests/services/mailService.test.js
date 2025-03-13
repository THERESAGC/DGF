const nodemailer = require("nodemailer");
const { sendEmail } = require("../../services/mailService");

jest.mock("nodemailer");

describe("sendEmail", () => {
  let sendMailMock;

  beforeEach(() => {
    sendMailMock = jest.fn();
    nodemailer.createTransport.mockReturnValue({
      sendMail: sendMailMock, 
    });
  });
  

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should send an email successfully", async () => {
    sendMailMock.mockImplementation((mailOptions, callback) => {
      callback(null, { response: "Email sent successfully" });
    });

    const to = "recipient@example.com";
    const subject = "Test Email";
    const text = "<p>This is a test email</p>";
    const cc = "cc@example.com";

    const result = await sendEmail(to, subject, text, cc);

    expect(result).toEqual({ response: "Email sent successfully" });
    expect(nodemailer.createTransport).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to,
        subject,
        html: text,
        cc,
      }),
      expect.any(Function)
    );
  });

  test("should reject if email sending fails", async () => {
    sendMailMock.mockImplementation((mailOptions, callback) => {
      callback(new Error("SMTP error"), null);
    });

    await expect(sendEmail("recipient@example.com", "Test", "<p>Test</p>")).rejects.toThrow(
      "SMTP error"
    );

    expect(nodemailer.createTransport).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });

  test("should send an email without CC", async () => {
    sendMailMock.mockImplementation((mailOptions, callback) => {
      callback(null, { response: "Email sent without CC" });
    });

    const to = "recipient@example.com";
    const subject = "No CC Email";
    const text = "<p>This is a test email</p>";

    const result = await sendEmail(to, subject, text);

    expect(result).toEqual({ response: "Email sent without CC" });
    expect(nodemailer.createTransport).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to,
        subject,
        html: text,
        cc: "", // Default CC should be an empty string
      }),
      expect.any(Function)
    );
  });
});
