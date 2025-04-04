const { handleAction } = require("../../controllers/actionEmailController");
const { sendEmail } = require("../../services/mailService");

jest.mock("../../services/mailService"); 

describe("Action Email Controller - handleAction", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        action: "approve",
        requestid: "REQ123",
        requestedbyid: "user@example.com",
        requestedby: "John Doe",
        ccEmail: "cc@example.com",
        commentdata: { comment_text: "Some reason" },
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    sendEmail.mockReset(); 
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });


  test("should send approval email and return 200 on success", async () => {
    sendEmail.mockResolvedValue(true); // Simulate successful email sending

    await handleAction(req, res);

    expect(sendEmail).toHaveBeenCalledWith(
      "user@example.com", 
      "Congratulations! Learning Request Approved ", 
      expect.stringContaining("<html>"), // Expect email body to be an HTML string
      "" 
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Request has been approve and emails sent." });
  });

  test("should send rejection email with comment and return 200 on success", async () => {
    req.body.action = "reject";
    await handleAction(req, res);

    expect(sendEmail).toHaveBeenCalledWith(
      "user@example.com",
      "Learning request REQ123 is rejected",
      expect.stringContaining("<html>"),
      ""
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Request has been reject and emails sent." });
  });

  test("should send hold email with reason and return 200 on success", async () => {
    req.body.action = "hold";
    await handleAction(req, res);

    expect(sendEmail).toHaveBeenCalledWith(
      "user@example.com",
      "Training Request Suspended",
      expect.stringContaining("<html>"),
      ""
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Request has been hold and emails sent." });
  });

  test("should send need clarification email and return 200 on success", async () => {
    req.body.action = "needClarification";
    await handleAction(req, res);

    expect(sendEmail).toHaveBeenCalledWith(
      "user@example.com",
      "Clarification Required for Training Request",
      expect.stringContaining("<html>"),
      ""
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Request has been needClarification and emails sent." });
  });

  test("should return 400 for an invalid action", async () => {
    req.body.action = "invalidAction";
    await handleAction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid action" });
  });

  test("should return 500 if email sending fails", async () => {
    sendEmail.mockRejectedValue(new Error("Email service failure"));

    await handleAction(req, res);

    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Error during email sending" });
  });
});
