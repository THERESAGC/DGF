const { handleSubmit } = require("../../controllers/emailController");
const { sendEmail } = require("../../services/mailService");

jest.mock("../../services/mailService");

describe("Email Controller - handleSubmit", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        requestid: "REQ123",
        requestedbyid: "user@example.com",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    sendEmail.mockReset(); // Reset mocks before each test
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  test("should send emails and return 200 on success", async () => {
    sendEmail.mockResolvedValue(true); // Simulate successful email sending

    await handleSubmit(req, res);

    expect(sendEmail).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Request processed and emails sent." });
  });

  test("should return 500 if email sending fails", async () => {
    sendEmail.mockRejectedValue(new Error("Email service failure"));

    await handleSubmit(req, res);

    expect(sendEmail).toHaveBeenCalledTimes(1); // It should fail on the first email itself
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Error during email sending" });
  });
});
