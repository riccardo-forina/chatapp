import 'jest-localstorage-mock';
import { Server } from 'mock-socket';

beforeAll(() => {
  const mockServer = new Server('ws://localhost:8080');
  mockServer.on('connection', server => {
  });
});
