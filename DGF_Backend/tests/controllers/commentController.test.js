const { getComments, addComment } = require('../../controllers/commentController');
const commentService = require('../../services/CommentService');

jest.mock('../../services/CommentService'); 

describe('Comment Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { requestid: '123' },
      body: {
        requestid: '123',
        comment_text: 'This is a test comment',
        created_by: 'User123',
        parent_comment_id: null,
        requeststatus: 'Pending'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getComments', () => {
    test('should return comments if service succeeds', async () => {
      const mockComments = [{ id: 1, text: 'Test comment' }];
      commentService.getCommentsByRequestId.mockResolvedValue(mockComments);

      await getComments(req, res);

      expect(res.json).toHaveBeenCalledWith(mockComments);
      expect(res.status).not.toHaveBeenCalledWith(500);
    });

    test('should return 500 if service throws an error', async () => {
      commentService.getCommentsByRequestId.mockRejectedValue(new Error('Database error'));

      await getComments(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch comments' });
    });
  });

  describe('addComment', () => {
    test('should return 201 if comment is added successfully', async () => {
      const mockCommentId = 101;
      commentService.addComments.mockResolvedValue(mockCommentId);

      await addComment(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Comment added successfully',
        comment_id: mockCommentId
      });
    });

    test('should return 500 if service throws an error', async () => {
      commentService.addComments.mockRejectedValue(new Error('Database error'));

      await addComment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add comment' });
    });
  });
});
