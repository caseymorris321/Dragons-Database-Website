// <!-- Citation for the following code:
// Date: 12/28/2024
// Adapted from nodejs-starterapp:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main -->
/*
    SETUP
*/
// Express
var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in our code
var path = require('path');
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
PORT = 39006;                 // Set a port number at the top so it's easy to change in the future
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
app.use(express.static('public'));

app.set('server.timeout', 15000);

var db = require('./database/db-connector')

/*
    ROUTES
*/

app.get('/', function (req, res) {
    res.render('index');
})

// Route to display dragons
app.get('/dragons', function (req, res) {
    // Declare Query 1
    let queryDragons = `
    SELECT Dragons.dragon_id, Dragons.dragon_name, Types.type_name AS type, 
           Dragons.dragon_height, Dragons.dragon_weight, Dragons.dragon_age, 
           Dragons.dragon_personality, Dragons.dragon_alignment, Environments.environment_name AS environment, 
           GROUP_CONCAT(Abilities.ability_name SEPARATOR ', ') AS Abilities,
           Dragons.number_of_people_killed, Dragons.dragon_lore
    FROM Dragons
    LEFT JOIN Types ON Dragons.type_id = Types.type_id
    LEFT JOIN Environments ON Dragons.environment_id = Environments.environment_id
    LEFT JOIN Dragons_Abilities ON Dragons.dragon_id = Dragons_Abilities.dragon_id
    LEFT JOIN Abilities ON Dragons_Abilities.ability_id = Abilities.ability_id
    GROUP BY Dragons.dragon_id
`;

    // Execute the query for dragons
    db.pool.query(queryDragons, function (error, dragonsResults) {
        if (error) {
            console.error('Error fetching dragons:', error);
            return res.sendStatus(500);
        }
        
        // Display the results correctly
    
        const modifiedResults = dragonsResults.map(dragon => ({
            ID: dragon.dragon_id,
            Name: dragon.dragon_name,
            Type: dragon.type,
            Height: dragon.dragon_height,
            Weight: dragon.dragon_weight,
            Age: dragon.dragon_age,
            Personality: dragon.dragon_personality,
            Alignment: dragon.dragon_alignment,
            Environment: dragon.environment,
            Abilities: dragon.Abilities,
            Number_of_People_Killed: dragon.number_of_people_killed,
            Lore: dragon.dragon_lore
        }));

        // Query to fetch Types for dropdown
        let queryTypes = "SELECT * FROM Types;";

        // Query to fetch Environments for dropdown
        let queryEnvironments = "SELECT * FROM Environments;";

        // Query to fetch Abilities for dropdown
        let queryAbilities = "SELECT * FROM Abilities;";

        // Execute the query for types
        db.pool.query(queryTypes, function (error, typesResults) {
            if (error) {
                console.error('Error fetching types:', error);
                return res.sendStatus(500);
            }

            // Execute the query for environments
            db.pool.query(queryEnvironments, function (error, environmentsResults) {
                if (error) {
                    console.error('Error fetching environments:', error);
                    return res.sendStatus(500);
                }

                // Execute the query for abilities
                db.pool.query(queryAbilities, function (error, abilitiesResults) {
                    if (error) {
                        console.error('Error fetching abilities:', error);
                        return res.sendStatus(500);
                    }

                    // Now that we have all the data, render the template
                    res.render('dragons', {
                        data: modifiedResults,
                        dragons: dragonsResults,
                        types: typesResults,
                        environments: environmentsResults,
                        abilities: abilitiesResults
                    });
                });
            });
        });
    });
});

// Route to get details for a single dragon by ID
app.get('/dragons/:id', function (req, res) {
    let dragonId = req.params.id; // Extract the dragon ID from the request path

    // SQL query to fetch details for the specified dragon
    let query = `
    SELECT Dragons.dragon_id, Dragons.dragon_name, Types.type_name AS type, 
           Dragons.dragon_height, Dragons.dragon_weight, Dragons.dragon_age, 
           Dragons.dragon_personality, Dragons.dragon_alignment, Environments.environment_name AS environment, 
           GROUP_CONCAT(Abilities.ability_name SEPARATOR ', ') AS Abilities,
           Dragons.number_of_people_killed, Dragons.dragon_lore
    FROM Dragons
    LEFT JOIN Types ON Dragons.type_id = Types.type_id
    LEFT JOIN Environments ON Dragons.environment_id = Environments.environment_id
    LEFT JOIN Dragons_Abilities ON Dragons.dragon_id = Dragons_Abilities.dragon_id
    LEFT JOIN Abilities ON Dragons_Abilities.ability_id = Abilities.ability_id
    WHERE Dragons.dragon_id = ?
    GROUP BY Dragons.dragon_id
    `;

    // Execute the query
    db.pool.query(query, [dragonId], function (error, results) {
        if (error) {
            console.error('Error fetching dragon details:', error);
            return res.sendStatus(500); // Internal Server Error
        }

        // Query will return one row since dragon_id is unique
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('Dragon not found'); // No dragon found with the given ID
        }
    });
});


app.post('/dragons/add', function (req, res) {
    const data = req.body;
    // Insert dragon data

    // const typeId = data.type_id === "" ? null : data.type_id;
    const typeId = data.type_id === "" || data.type_id === "NULL" ? null : parseInt(data.type_id);

    const insertDragonQuery = `INSERT INTO Dragons (dragon_name, type_id, dragon_height, dragon_weight, dragon_age, dragon_personality, dragon_alignment, environment_id, number_of_people_killed, dragon_lore) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.pool.query(insertDragonQuery, [data.dragon_name, typeId, data.dragon_height, data.dragon_weight, data.dragon_age, data.dragon_personality, data.dragon_alignment, data.environment_id, data.number_of_people_killed, data.dragon_lore], function (error, result) {
        if (error) {
            console.error(error);
            return res.sendStatus(500);
        }

        const dragonId = result.insertId;
        if (Array.isArray(data.abilities) && data.abilities.length) {
            const insertAbilitiesQuery = 'INSERT INTO Dragons_Abilities (dragon_id, ability_id) VALUES ?';
            const abilitiesValues = data.abilities.map(abilityId => [dragonId, parseInt(abilityId, 10)]);

            db.pool.query(insertAbilitiesQuery, [abilitiesValues], function (error) {
                if (error) {
                    console.error(error);
                    // Handle error (rollback transaction, send error response, etc.)
                    return res.sendStatus(500);
                }
                // Redirect or send a success response after all operations are successful
                res.redirect('/dragons');
            });
        } 
    });
});


app.put('/put-dragon-ajax', function (req, res) {
    let data = req.body;
    let dragonId = parseInt(data.dragon_id);

    const typeId = data.type === "" ? null : data.type;
    // let typeId = ["", "NULL", "None", undefined].includes(data.type_id) ? null : parseInt(data.type_id);

    // Make sure parsing did not result in NaN. If it did, set typeId to null (indicative of a parsing error or invalid input).
    if (isNaN(typeId)) {
        typeId = null;
    }
    // Update dragon basic information
    let updateDragonQuery = `
        UPDATE Dragons 
        SET dragon_name = ?, type_id = ?, dragon_height = ?, dragon_weight = ?, 
            dragon_age = ?, dragon_personality = ?, dragon_alignment = ?, 
            environment_id = ?, number_of_people_killed = ?, dragon_lore = ? 
        WHERE dragon_id = ?`;

    db.pool.query(updateDragonQuery, [
        data.name, typeId, data.height, data.weight, data.age,
        data.personality, data.alignment, data.environment,
        data.number_of_people_killed, data.lore, dragonId
    ], function (error) {
        if (error) {
            console.error('Error updating dragon:', error);
            return res.sendStatus(500); // Internal Server Error
        }

        // Handle abilities update
        let deleteExistingAbilitiesQuery = `DELETE FROM Dragons_Abilities WHERE dragon_id = ?`;

        db.pool.query(deleteExistingAbilitiesQuery, [dragonId], function (deleteError) {
            if (deleteError) {
                console.error('Error deleting existing abilities:', deleteError);
                return res.sendStatus(500); // Internal Server Error
            }

            // Insert new abilities for the dragon
            if (data.abilities && data.abilities.length > 0) {
                let insertAbilitiesQuery = `INSERT INTO Dragons_Abilities (dragon_id, ability_id) VALUES ?`;
                let abilitiesValues = data.abilities.map(abilityId => [dragonId, parseInt(abilityId)]);

                db.pool.query(insertAbilitiesQuery, [abilitiesValues], function (insertError) {
                    if (insertError) {
                        console.error('Error inserting new abilities:', insertError);
                        return res.sendStatus(500); // Internal Server Error
                    }
                    res.send({ message: 'Dragon and abilities updated successfully.' });
                });
            } else {
                // If there are no abilities to update, just send a success response
                res.send({ message: 'Dragon updated successfully, no abilities to update.' });
            }
        });
    });
});

app.delete('/delete-dragon-ajax/', function (req, res, next) {
    let data = req.body;
    let dragonID = parseInt(data.id);
    let deleteDragonsAbilities = `DELETE FROM Dragons_Abilities WHERE dragon_id = ?`;
    let deleteDragons = `DELETE FROM Dragons WHERE dragon_id = ?`;

    // Run the 1st query
    db.pool.query(deleteDragonsAbilities, [dragonID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else {
            // Run the second query
            db.pool.query(deleteDragons, [dragonID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

/*
   TYPES
*/
app.get('/types', function (req, res) {
    let query = "SELECT * FROM Types;";

    db.pool.query(query, function (error, typesResults) {
        if (error) {
            console.error('Error fetching types:', error);
            return res.sendStatus(500);
        }
        
        const modifiedResults = typesResults.map(type => ({
            ID: type.type_id,
            Name: type.type_name,
            Average_Height: type.type_average_height,
            Average_Weight: type.type_average_weight,
            Average_Age: type.type_average_age,
            Total_Number: type.total_number
        }));
        res.render('types', { data: modifiedResults }); // Assuming 'types' is the name of your Handlebars template
    });
});

app.get('/types/:id', function (req, res) {
    let typeId = req.params.id; // Extract the type ID from the request path

    // SQL query to fetch details for the specified type
    let query = `
    SELECT type_id, type_name, type_average_height, type_average_weight, type_average_age, total_number
    FROM Types
    WHERE type_id = ?`;

    // Execute the query
    db.pool.query(query, [typeId], function (error, results) {
        if (error) {
            console.error('Error fetching type details:', error);
            return res.sendStatus(500); // Internal Server Error
        }

        // Query will return one row since type_id is unique
        if (results.length > 0) {
            res.json(results[0]); // Send the type details as is, without appending any units
        } else {
            res.status(404).send('Type not found'); // No type found with the given ID
        }
    });
});

app.post('/types/add', function (req, res) {
    const { type_name, type_average_height, type_average_weight, type_average_age, total_number } = req.body;
    const query = `INSERT INTO Types (type_name, type_average_height, type_average_weight, type_average_age, total_number) VALUES (?, ?, ?, ?, ?)`;

    db.pool.query(query, [type_name, type_average_height, type_average_weight, type_average_age, total_number], function (error, results) {
        if (error) {
            console.error('Error adding new type:', error);
            return res.sendStatus(500); // Internal Server Error
        }
        res.redirect('/types');
    });
});

app.put('/put-type-ajax', function (req, res) {
    let data = req.body;
    let typeId = parseInt(data.type_id); // Ensure this matches how you're sending the ID from the client
    // Update type basic information
    let updateTypeQuery = `
        UPDATE Types 
        SET type_name = ?, type_average_height = ?, type_average_weight = ?, 
            type_average_age = ?, total_number = ? 
        WHERE type_id = ?`;

    db.pool.query(updateTypeQuery, [
        data.type_name, data.type_average_height, data.type_average_weight,
        data.type_average_age, data.total_number, typeId
    ], function (error) {
        if (error) {
            console.error('Error updating type:', error);
            return res.sendStatus(500); // Internal Server Error
        }
        res.send({ message: 'Type updated successfully.' });
    });
});

app.delete('/delete-type-ajax/', function (req, res) {
    let data = req.body;
    let typeID = parseInt(data.id);
    // Assuming you might have foreign key constraints or related data to handle, 
    // adjust or add any preliminary delete statements as needed before deleting the type itself.
    // For example, if types are referenced in another table, you might need to delete those references first.
    // This example assumes direct deletion of a type without additional dependencies.

    let deleteTypes = `DELETE FROM Types WHERE type_id = ?`;

    // Run the query to delete the type
    db.pool.query(deleteTypes, [typeID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400); // Bad Request
        } else {
            res.sendStatus(204); // No Content (successful deletion)
        }
    });
});

/*
    ENVIRONMENTS
*/

app.get('/environments', function(req, res) {
    let queryEnvironments = "SELECT * FROM Environments;";
    db.pool.query(queryEnvironments, function(error, environmentResults) {
        if (error) {
            console.error('Error fetching environments:', error);
            res.sendStatus(500);
        } const modifiedResults = environmentResults.map(environment => ({
            ID: environment.environment_id,
            Name: environment.environment_name,
            Terrain: environment.environment_terrain,
            Climate: environment.environment_climate
        }));
        res.render('environments', { data: modifiedResults });
    });
});

app.get('/environments/:id', function (req, res) {
    let environmentId = req.params.id; // Extract the environment ID from the request path

    // SQL query to fetch details for the specified environment
    let query = `
    SELECT environment_id, environment_name, environment_terrain, environment_climate
    FROM Environments
    WHERE environment_id = ?`;

    // Execute the query
    db.pool.query(query, [environmentId], function (error, results) {
        if (error) {
            console.error('Error fetching environment details:', error);
            return res.sendStatus(500); // Internal Server Error
        }

        // Query will return one row since environment_id is unique
        if (results.length > 0) {
            res.json(results[0]); // Send the environment details as is
        } else {
            res.status(404).send('Environment not found'); // No environment found with the given ID
        }
    });
});


app.post('/environments/add', function(req, res) {
    let data = req.body;
    let insertQuery = "INSERT INTO Environments (environment_name, environment_terrain, environment_climate) VALUES (?, ?, ?);";

    db.pool.query(insertQuery, [data.environment_name, data.environment_terrain, data.environment_climate, data.average_temperature, data.common_hazard], function(error, results) {
        if (error) {
            console.error('Error adding environment:', error);
            res.sendStatus(500);
        } else {
            res.redirect('/environments');
        }
    });
});

app.put('/put-environment-ajax', function(req, res) {
    let data = req.body;
    let updateQuery = "UPDATE Environments SET environment_name = ?, environment_terrain = ?, environment_climate = ? WHERE environment_id = ?;";

    db.pool.query(updateQuery, [data.name, data.terrain, data.climate, data.environment_id], function(error) {
        if (error) {
            console.error('Error updating environment:', error);
            res.sendStatus(500);
        } else {
            res.send({ message: 'Environment updated successfully.' });
        }
    });
});

app.delete('/delete-environment-ajax/', function (req, res) {
    let data = req.body;
    let environmentID = parseInt(data.id); // Ensure the environment ID is interpreted as an integer

    // Query to delete the environment
    let deleteEnvironments = `DELETE FROM Environments WHERE environment_id = ?`;

    // Execute the query to delete the environment
    db.pool.query(deleteEnvironments, [environmentID], function (error) {
        if (error) {
            console.log(error);
            res.sendStatus(400); // Bad Request if there's an error
        } else {
            res.sendStatus(204); // No Content (successful deletion)
        }
    });
});


/*
    LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});