const mongoose = require("mongoose")

// Se conecta a la BD
mongoose.connect("mongodb+srv://giancarissimo:gGgPP863MH1pGf6B@cluster0.ckbgdx2.mongodb.net/ecommerce?retryWrites=true&w=majority")
    .then(() => console.log("Connection to db successful"))
    .catch((error) => console.log("Error establishing connection to db:", error))