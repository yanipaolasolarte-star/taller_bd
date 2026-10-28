const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// Conexión a la base de datos MySQL
let conectar = mysql.createConnection({
    host: "mysql-19df654d-yanipaolasolarte-466c.f.aivencloud.com",
    user: "avnadmin",
    password: "",
    database: "",
    port: 19958
});

conectar.connect((error) => {
    if (error) {
        console.error("Error de conexión a la BD:", error);
        return;
    }
    console.log("Conexión realizada exitosamente a la base de datos.");
});

// Ruta 1 (GET /prueba): Verificar el funcionamiento del servidor
app.get("/prueba", (req, res) => {
    res.json({ "mensaje": "Prueba realizada correctamente" });
});

// Ruta 2 (POST /productos): Registrar un producto en la base de datos
app.post("/productos", (req, res) => {
    const { nombre, categoria, precio, cantidad } = req.body;

    // Validación básica de datos (Fase 4)
    if (!nombre || !categoria || precio === undefined || cantidad === undefined) {
        return res.status(400).json({ "mensaje": "Todos los campos son obligatorios (nombre, categoria, precio, cantidad)" });
    }

    const query = "INSERT INTO productos (nombre, categoria, precio, cantidad) VALUES (?, ?, ?, ?)";
    
    conectar.query(query, [nombre, categoria, precio, cantidad], (error, resultado) => {
        if (error) {
            return res.status(500).json({ "mensaje": "Error al registrar el producto en la base de datos", error: error.message });
        }
        return res.status(201).json({ 
            "mensaje": "Producto registrado correctamente", 
            "id": resultado.insertId 
        });
    });
});

// Ruta 3 (GET /productos): Consultar todos los productos almacenados
app.get("/productos", (req, res) => {
    conectar.query("SELECT * FROM productos", (error, resultados) => {
        if (error) {
            return res.status(500).json({ "mensaje": "Error al consultar los datos" });
        }
        return res.status(200).json(resultados);
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log("Servidor en ejecución en el puerto " + PORT);
});