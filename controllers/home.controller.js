const fs = require('fs');

exports.getHomePage = (req, res) => {
    let query = "SELECT * FROM players ORDER BY id ASC";

    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log('Database error:', err); // Agrega logging para debug
            return res.redirect('/'); // ✅ Agrega RETURN aquí
        }

        res.render('index.ejs', {
            title: "Welcome to Socka | View Players",
            players: result || [] // ✅ Agrega fallback por si result es undefined
        });
    });
};
