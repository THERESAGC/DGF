const mysql = require('mysql2/promise');

const mockPool = {
  query: jest.fn(),
  execute: jest.fn(),
  getConnection: jest.fn().mockResolvedValue({
    release: jest.fn(),
  }),
};

jest.mock('mysql2/promise', () => ({
  createPool: jest.fn(() => mockPool),
}));

module.exports = { mockPool };
