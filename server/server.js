const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); 
const todosRoutes = require('./routes/todosRoutes');
const postsRoutes = require('./routes/postsRoutes');
const commentRoutes = require('./routes/commentRoutes'); 
const albumRoutes = require('./routes/albumRoutes'); 
const photoRoutes = require('./routes/photoRoutes'); 

const commentController = require('./controllers/commentController');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/todos', todosRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/photos', photoRoutes);

app.get('/api/posts/:postId/comments', commentController.getPostComments);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));