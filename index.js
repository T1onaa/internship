const express = require("express");
const db = require("./config/db");

const app = express();
const port = 3000;

app.use(express.json());

app.post("/user", (req, res) => {
  const { fullname, username, age, gender } = req.body;

  db.query(
    "INSERT INTO users(fullname, username, age, gender) VALUES (?, ?, ?, ?)",
    [fullname, username, age, gender],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        id: result.insertId,
        fullname,
        username,
        age,
        gender
      });
    }
  );
});

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.delete("/user/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id=?", [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ message: "User deleted" });
  });
});

app.post("/services", (req, res) => {
  const { serviceCode, serviceName, servicePrice } = req.body;

  db.query(
    "INSERT INTO services VALUES (?, ?, ?)",
    [serviceCode, serviceName, servicePrice],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Service added" });
    }
  );
});

app.get("/services", (req, res) => {
  db.query("SELECT * FROM services", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.put("/services/:code", (req, res) => {
  db.query(
    "UPDATE services SET ? WHERE serviceCode=?",
    [req.body, req.params.code],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Services updated" });
    }
  );
});

app.delete("/services/:code", (req, res) => {
  db.query(
    "DELETE FROM services WHERE serviceCode=?",
    [req.params.code],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Service deleted" });
    }
  );
});


app.post("/car", (req, res) => {
  db.query("INSERT INTO car SET ?", req.body, (err, result) => {
    if (err) throw err;
    res.json({ message: "Car added" });
  });
});

app.get("/cars", (req, res) => {
  db.query("SELECT * FROM car", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.delete("/car/:plate", (req, res) => {
  db.query(
    "DELETE FROM car WHERE plateNumber=?",
    [req.params.plate],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Car deleted" });
    }
  );
});

app.post("/record", (req, res) => {
  const { serviceDate, plateNumber, serviceCode } = req.body;

  db.query(
    "INSERT INTO servicerecord(serviceDate, plateNumber, serviceCode) VALUES (?, ?, ?)",
    [serviceDate, plateNumber, serviceCode],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Record created" });
    }
  );
});

app.get("/records", (req, res) => {
  db.query(
    `SELECT * FROM servicerecord 
     JOIN car ON servicerecord.plateNumber = car.plateNumber
     JOIN services ON servicerecord.serviceCode = services.serviceCode`,
    (err, result) => {
      if (err) throw err;
      res.json(result);
    }
  );
});

app.post("/payment", (req, res) => {
  const { amountPaid, paymentDate, recordNumber } = req.body;

  db.query(
    "INSERT INTO payment(amountPaid, paymentDate, recordNumber) VALUES (?, ?, ?)",
    [amountPaid, paymentDate, recordNumber],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Payment recorded" });
    }
  );
});

app.get("/payments", (req, res) => {
  db.query(
    `SELECT * FROM payment
     JOIN servicerecord ON payment.recordNumber = servicerecord.recordNumber
     JOIN car ON servicerecord.plateNumber = car.plateNumber`,
    (err, result) => {
      if (err) throw err;
      res.json(result);
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});