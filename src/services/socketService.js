import io from 'socket.io-client';

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io('https://backendinventory-4lnp.onrender.com', {
      transports: ['websocket'],
    });
  }
  return socket;
};

export const emit = (event, data) => {
  const s = getSocket();
  s.emit(event, data);
};

export const on = (event, cb) => {
  const s = getSocket();
  s.on(event, cb);
};

export const off = (event) => {
  const s = getSocket();
  s.off(event);
};
