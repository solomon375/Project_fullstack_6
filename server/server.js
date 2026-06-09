const express = require('express');
const cors = require('cors'); // חובה כדי לאפשר ל-React לפנות לשרת
const app = express();

const todosRoutes = require('./routes/todosRoutes');
const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(cors());
app.use(express.json()); // מפרסס נתונים שמגיעים ב-POST כ-JSON

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todosRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
