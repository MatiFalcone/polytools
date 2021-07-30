// Puerto
process.env.PORT = process.env.PORT || 3001;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || "dev"

// DB
if (process.env.NODE_ENV === "dev") {
    process.env.DB = 'mongodb://localhost:27017/PolyTools';
} else {
    process.env.DB = 'mongodb+srv://polytools:Z8eqI3KGwHuHU9xR@cluster0.onmti.mongodb.net/test';
}