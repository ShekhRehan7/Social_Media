import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import Connection from './config/db.js';

import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';


Connection();

const app = express();
const port = 9000;

app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the home page');
});

app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/message', messageRoutes);


const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST']
  }
});


io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('sendMessage', (data) => {
    // console.log('📨 New Message:', data);
    io.emit('receiveMessage', data); 
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ✅ Start the server
server.listen(port, () => {
  console.log(` Server running on http://localhost:${port}`);
});
