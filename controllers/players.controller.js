const fs = require('fs');

exports.addPlayerPage = (req, res) => {
    res.render('add-player.ejs', {
        title: "Welcome to Socka | Add a new player",
        message: ''
    });
};

exports.addPlayer = (req, res) => {
    if (!req.files) {
        return res.status(400).send("No files were uploaded.");
    }

    let message = '';
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let position = req.body.position;
    let number = req.body.number;
    let username = req.body.username;
    let uploadedFile = req.files.image;
    let image_name = uploadedFile.name;
    let fileExtension = uploadedFile.mimetype.split('/')[1];
    image_name = username + '.' + fileExtension;

    let usernameQuery = "SELECT * FROM `players` WHERE user_name = '" + username + "'";

    db.query(usernameQuery, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }

        if (result.length > 0) {
            message = 'Username already exists';
            res.render('add-player.ejs', {
                message,
                title: "Welcome to Socka | Add a new player"
            });
        } else {
            // check the filetype before uploading it
            if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                // upload the file to the /public/assets/img directory
                uploadedFile.mv(`public/assets/img/${image_name}`, (err) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    // send the player's details to the database
                    let query = "INSERT INTO `players` (first_name, last_name, position, number, image, user_name) VALUES ('" +
                        first_name + "', '" + last_name + "', '" + position + "', '" + number + "', '" + image_name + "', '" + username + "')";
                    db.query(query, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/');
                    });
                });
            } else {
                message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                res.render('add-player.ejs', {
                    message,
                    title: "Welcome to Socka | Add a new player"
                });
            }
        }
    });
}

exports.editPlayerPage = (req, res) => {
    let playerId = req.params.id;
    let query = "SELECT * FROM `players` WHERE id = '" + playerId + "' ";
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.render('edit-player.ejs', {
            title: "Edit  Player",
            player: result[0],
            message: ''
        });
    });
}

exports.editPlayer = (req, res) => {
    let playerId = req.params.id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let position = req.body.position;
    let number = req.body.number;

    // Check if an image is being uploaded
    if (req.files && req.files.image) {
        let uploadedFile = req.files.image;

        // Validation
        if (!(uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif')) {
            return res.status(400).send("Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.");
        }

        // Get current player data to retrieve username and old image
        let getPlayerQuery = "SELECT * FROM `players` WHERE id = '" + playerId + "'";
        db.query(getPlayerQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let player = result[0];
            let username = player.user_name; // Use existing username
            let oldImage = player.image;

            let fileExtension = uploadedFile.mimetype.split('/')[1];
            let image_name = username + '.' + fileExtension;

            // Delete old image if it exists and is different (or blindly delete to ensure cleanup if extension changes)
            if (oldImage && oldImage.length > 0) {
                fs.unlink(`public/assets/img/${oldImage}`, (err) => {
                    if (err) console.log("Old image deletion failed or file missing: " + err);
                });
            }

            // Upload new image
            uploadedFile.mv(`public/assets/img/${image_name}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }

                // Update database with new image name
                let query = "UPDATE `players` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `position` = '" + position + "', `number` = '" + number + "', `image` = '" + image_name + "' WHERE `players`.`id` = '" + playerId + "'";
                db.query(query, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });

    } else {
        // No new image uploaded, just update other details
        let query = "UPDATE `players` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `position` = '" + position + "', `number` = '" + number + "' WHERE `players`.`id` = '" + playerId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    }
}

exports.deletePlayer = (req, res) => {
    let playerId = req.params.id;
    let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"';
    let deleteUserQuery = 'DELETE FROM players WHERE id = "' + playerId + '"';

    db.query(getImageQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }

        let image = result[0].image;

        fs.unlink(`public/assets/img/${image}`, (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            db.query(deleteUserQuery, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/');
            });
        });
    });
}
