// <!-- Citation for the following code:
// Date: 12/28/2024
// Adapted from nodejs-starterapp:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main -->

/*
    SETUP
*/

// <!-- Import required modules -->
// Express
const express = require('express');   // We are using the express library for the web server
const app = express();            // We need to instantiate an express object to interact with the server in our code
const db = require('./database/db-connector')  // Connect to DB
const cors = require('cors');

const PORT = process.env.PORT || 4000;                 // Set a port number at the top so it's easy to change in the future

// <!-- Middleware -->
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static('public'));

// <!-- Handlebars -->
const { engine } = require('express-handlebars');
const exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/

// <!-- Index page -->
app.get('/', function (req, res) {
    res.render('index');
})

// <!-- DRAGONS ROUTES -->

// <!-- Get all Dragons -->
app.get('/dragons', function (req, res) {

    // Query to get Dragons
    let queryDragons = `
    SELECT Dragons.dragon_id, Dragons.dragon_name, Types.type_name AS type, 
           Dragons.dragon_height, Dragons.dragon_weight, Dragons.dragon_age, 
           Dragons.dragon_personality, Dragons.dragon_alignment, Environments.environment_name AS environment, 
           string_agg(Abilities.ability_name SEPARATOR ', ') AS Abilities,
           Dragons.number_of_people_killed, Dragons.dragon_lore
    FROM Dragons
    LEFT JOIN Types ON Dragons.type_id = Types.type_id
    LEFT JOIN Environments ON Dragons.environment_id = Environments.environment_id
    LEFT JOIN Dragons_Abilities ON Dragons.dragon_id = Dragons_Abilities.dragon_id
    LEFT JOIN Abilities ON Dragons_Abilities.ability_id = Abilities.ability_id
    GROUP BY Dragons.dragon_id
    ORDER BY Dragons.dragon_name  ASC, 
    Types.type_name  ASC, 
    Environments.environment_name ASC,
    Dragons.dragon_alignment ASC;
`;

    // Execute the query
    db.pool.query(queryDragons, function (error, result) {
        if (error) {
            console.error('Error fetching dragons:', error);
            return res.sendStatus(500);
        }

        // Display the results correctly
        const dragonsResults = result.rows;
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

// <!-- Get a single Dragon -->
app.get('/dragons/:id', function (req, res) {
    let dragonId = req.params.id;

    // Query to fetch single Dragon by ID
    let query = `
    SELECT Dragons.dragon_id, Dragons.dragon_name, Types.type_name AS type, 
           Dragons.dragon_height, Dragons.dragon_weight, Dragons.dragon_age, 
           Dragons.dragon_personality, Dragons.dragon_alignment, Environments.environment_name AS environment, 
           string_agg(Abilities.ability_name SEPARATOR ', ') AS Abilities,
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
            return res.sendStatus(500);
        }
        // Query will return one row since dragon_id is unique
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('Dragon name already exists.');
        }
    });
});

// <!-- Add a Dragon -->
app.post('/dragons/add', function (req, res) {
    const data = req.body;

    const typeId = data.type_id === "" || data.type_id === "NULL" ? null : parseInt(data.type_id);

    // Query to add Dragons
    const insertDragonQuery = `INSERT INTO Dragons (dragon_name, type_id, dragon_height, dragon_weight, dragon_age, dragon_personality, dragon_alignment, environment_id, number_of_people_killed, dragon_lore) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Execute query
    db.pool.query(insertDragonQuery, [data.dragon_name, typeId, data.dragon_height, data.dragon_weight, data.dragon_age, data.dragon_personality, data.dragon_alignment, data.environment_id, data.number_of_people_killed, data.dragon_lore], function (error, result) {
        if (error) {
            console.error(error);
            res.redirect('/dragons/add');
        }
        const dragonId = result.insertId;
        if (Array.isArray(data.abilities) && data.abilities.length) {
            const insertAbilitiesQuery = 'INSERT INTO Dragons_Abilities (dragon_id, ability_id) VALUES ?';
            const abilitiesValues = data.abilities.map(abilityId => [dragonId, parseInt(abilityId, 10)]);

            db.pool.query(insertAbilitiesQuery, [abilitiesValues], function (error) {
                if (error) {
                    console.error(error);
                    res.redirect('/dragons/add');
                }
                res.redirect('/dragons');
            });
        }
    });
});

// <!-- Update Dragons -->
app.put('/put-dragon-ajax', function (req, res) {
    let data = req.body;

    let dragonId = parseInt(data.dragon_id); // Must be integer

    // Handle NULL Types
    const typeId = data.type === "" ? null : data.type;
    // Make sure parsing did not result in NaN. If it did, set typeId to null (indicative of a parsing error or invalid input).
    if (isNaN(typeId)) {
        typeId = null;
    }
    // Handle update Dragon
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
            return res.sendStatus(500);
        }
        // Handle Dragon_Abilities update
        let deleteExistingAbilitiesQuery = `DELETE FROM Dragons_Abilities WHERE dragon_id = ?`;

        db.pool.query(deleteExistingAbilitiesQuery, [dragonId], function (deleteError) {
            if (deleteError) {
                console.error('Error deleting existing abilities:', deleteError);
                return res.sendStatus(500);
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
                res.send({ message: 'Dragon updated successfully, no abilities to update.' });
            }
        });
    });
});

// <!-- Delete Dragons -->
app.delete('/delete-dragon-ajax/', function (req, res) {
    let data = req.body;
    let dragonID = parseInt(data.id);
    let deleteDragonsAbilities = `DELETE FROM Dragons_Abilities WHERE dragon_id = ?`;
    let deleteDragons = `DELETE FROM Dragons WHERE dragon_id = ?`;

    // Run the 1st query
    db.pool.query(deleteDragonsAbilities, [dragonID], function (error, rows, fields) {
        if (error) {
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

// <!-- TYPES ROUTES -->

// <!-- Get all Types -->
app.get('/types', function (req, res) {
    // Query to get Types
    let query = `
    SELECT 
        t.type_id, 
        t.type_name, 
        ROUND(AVG(d.dragon_height), 2) AS type_average_height, 
        ROUND(AVG(d.dragon_weight), 2) AS type_average_weight, 
        ROUND(AVG(d.dragon_age), 2) AS type_average_age, 
        COALESCE(SUM(d.number_of_people_killed), 0) AS total_number_of_people_killed,
        COUNT(d.dragon_id) AS total_number
    FROM 
        Types t
    LEFT JOIN 
        Dragons d ON t.type_id = d.type_id
    GROUP BY 
        t.type_id
    ORDER BY 
    t.type_name,    
        total_number DESC;
    `;

    // Execute Query
    db.pool.query(query, function (error, result) {
        if (error) {
            console.error('Error fetching types:', error);
            return res.sendStatus(500);
        }
        const typesResults = result.rows;

        const modifiedResults = typesResults.map(type => ({
            ID: type.type_id,
            Name: type.type_name,
            Average_Height: type.type_average_height || 0,
            Average_Weight: type.type_average_weight || 0,
            Average_Age: type.type_average_age || 0,
            Total_Number_of_People_Killed: type.total_number_of_people_killed || 0,
            Total_Number: type.total_number || 0,
        }));
        res.render('types', { data: modifiedResults });
    });
});

// <!-- Get a single Type -->
app.get('/types/:id', function (req, res) {
    let typeId = req.params.id;

    // Query to get Type
    let query = `
    SELECT 
        t.type_id,
        t.type_name,
        COALESCE(AVG(d.dragon_height), 0) AS type_average_height, 
        COALESCE(AVG(d.dragon_weight), 0) AS type_average_weight, 
        COALESCE(AVG(d.dragon_age), 0) AS type_average_age, 
        COALESCE(SUM(d.number_of_people_killed), 0) AS total_number_of_people_killed,
        COUNT(d.dragon_id) AS total_number

    FROM 
        Types t
    LEFT JOIN 
        Dragons d ON t.type_id = d.type_id
    WHERE 
        t.type_id = ?
    GROUP BY 
        t.type_id, t.type_name`;

    // Execute the query
    db.pool.query(query, [typeId], function (error, results) {
        if (error) {
            console.error('Error fetching type details:', error);
            return res.sendStatus(500);
        }

        // Query will return one row since type_id is unique
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('Type name already exists.');
        }
    });
});

// <!-- Add a Type -->
app.post('/types/add', function (req, res) {
    const {
        type_name,
        type_average_height,
        type_average_weight,
        type_average_age,
        total_number_of_people_killed,
        total_number
    } = req.body;
    let redirect_to = req.body.redirect_to;

    // Query to add Type
    const query = `INSERT INTO Types (type_name, type_average_height, type_average_weight, type_average_age, total_number_of_people_killed, total_number) VALUES (?, ?, ?, ?, ?, ?)`;

    // Execute query
    db.pool.query(query, [type_name, type_average_height, type_average_weight, type_average_age, total_number_of_people_killed, total_number], function (error, results) {
        if (error) {
            console.error('Error adding new type:', error);
            return res.sendStatus(500);
        }
        if (redirect_to === 'dragons') {
            res.redirect('/dragons');
        } else {
            // Default redirect to '/types' if 'redirect_to' is not specified or if it's 'types'
            res.redirect('/types');
        }
    });
});


// <!-- Update a Type -->
app.put('/put-type-ajax', function (req, res) {
    let data = req.body;

    let typeId = parseInt(data.type_id); // ID must be integer

    // Query to update Type
    let updateTypeQuery = `
        UPDATE Types 
        SET type_name = ?, type_average_height = ?, type_average_weight = ?, 
            type_average_age = ?, total_number_of_people_killed = ?, total_number = ?
        WHERE type_id = ?`;

    // Execute query to update Type
    db.pool.query(updateTypeQuery, [
        data.type_name, data.type_average_height, data.type_average_weight,
        data.type_average_age, data.total_number, data.total_number_of_people_killed, typeId
    ], function (error) {
        if (error) {
            console.error('Error updating type:', error);
            return res.sendStatus(500);
        }
        res.send({ message: 'Type updated successfully.' });
    });
});

// <!-- Delete a Type -->
app.delete('/delete-type-ajax/', function (req, res) {
    let data = req.body;
    let typeID = parseInt(data.id);

    let deleteTypes = `DELETE FROM Types WHERE type_id = ?`;

    // Run the query to delete the type
    db.pool.query(deleteTypes, [typeID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

// <!--ENVIRONMENTS ROUTES -->

// <!-- Get all Environments -->
app.get('/environments', function (req, res) {
    // Query to fetch all Environments
    let queryEnvironments = `
    SELECT 
        e.environment_id, 
        e.environment_name, 
        e.environment_terrain, 
        e.environment_climate,
        COALESCE(COUNT(d.dragon_id), 0) AS total_number_of_dragons
    FROM 
        Environments e
    LEFT JOIN 
        Dragons d ON e.environment_id = d.environment_id
    GROUP BY 
        e.environment_id
    ORDER BY 
    e.environment_name,
    e.environment_terrain ASC,
    e.environment_climate ASC,
    total_number_of_dragons DESC;
`;

    // Execute the query
    db.pool.query(queryEnvironments, function (error, result) {
        if (error) {
            console.error('Error fetching environments:', error);
            res.sendStatus(500);
        } 
        const environmentResults = result.rows;
        const modifiedResults = environmentResults.map(environment => ({
            ID: environment.environment_id,
            Name: environment.environment_name,
            Terrain: environment.environment_terrain,
            Climate: environment.environment_climate,
            Total_Number_of_Dragons: environment.total_number_of_dragons
        }));
        res.render('environments', { data: modifiedResults });
    });
});

// <!-- Get a single Environment -->
app.get('/environments/:id', function (req, res) {
    let environmentId = req.params.id;

    // Query to fetch an Environment by ID
    let query = `
    SELECT 
        e.environment_id, 
        e.environment_name, 
        e.environment_terrain, 
        e.environment_climate,
        COALESCE(COUNT(d.dragon_id), 0) AS total_number_of_dragons
    FROM 
        Environments e
    LEFT JOIN 
        Dragons d ON e.environment_id = d.environment_id
    WHERE 
        e.environment_id = ?
    GROUP BY 
        e.environment_id;
`;

    // Execute the query
    db.pool.query(query, [environmentId], function (error, results) {
        if (error) {
            console.error('Error fetching environment details:', error);
            return res.sendStatus(500);
        }

        // Query will return one row since environment_id is unique
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('Environment name already exists.');
        }
    });
});

// <!-- Add an Environment -->
app.post('/environments/add', function (req, res) {
    let { environment_name, environment_terrain, environment_climate } = req.body;
    let redirect_to = req.body.redirect_to;
    let total_number_of_dragons = 0;
    let insertQuery = `
    INSERT INTO Environments (environment_name, environment_terrain, environment_climate, total_number_of_dragons)
    VALUES (?, ?, ?, ?);
`;

    db.pool.query(insertQuery, [environment_name, environment_terrain, environment_climate, total_number_of_dragons], function (error, results) {
        if (error) {
            console.error('Error adding environment:', error);
            res.sendStatus(500);
        } else {
            if (redirect_to === 'dragons') {
                res.redirect('/dragons');
            } else {
                res.redirect('/environments');
            }
        }
    });
});

// <!-- Update an Environment -->
app.put('/put-environment-ajax', function (req, res) {
    let data = req.body;

    let updateQuery = "UPDATE Environments SET environment_name = ?, environment_terrain = ?, environment_climate = ? WHERE environment_id = ?;";

    db.pool.query(updateQuery, [data.name, data.terrain, data.climate, data.environment_id], function (error) {
        if (error) {
            console.error('Error updating environment:', error);
            res.sendStatus(500);
        } else {
            res.send({ message: 'Environment updated successfully.' });
        }
    });
});

// <!-- Delete an Environment -->
app.delete('/delete-environment-ajax/', function (req, res) {
    let data = req.body;
    let environmentID = parseInt(data.id); // Must be integer

    // Query to delete the environment
    let deleteEnvironments = `DELETE FROM Environments WHERE environment_id = ?`;

    // Execute the query to delete the environment
    db.pool.query(deleteEnvironments, [environmentID], function (error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

// <!-- ABILITIES ROUTES -->

// <!-- Get all Abilities -->
app.get('/abilities', function (req, res) {
    // Query to fetch all Abilities
    let query = `
    SELECT 
        a.ability_id, 
        a.ability_name, 
        a.ability_proficiency,
        COUNT(da.dragon_id) AS total_number_of_dragons
    FROM 
        Abilities a
    LEFT JOIN 
        Dragons_Abilities da ON a.ability_id = da.ability_id
    GROUP BY 
        a.ability_id, a.ability_proficiency
    ORDER BY
        a.ability_name ASC,
        a.ability_proficiency ASC, 
        total_number_of_dragons DESC;    
    `;

    // Execute the query
    db.pool.query(query, function (error, result) {
        if (error) {
            console.error('Error fetching abilities:', error);
            return res.sendStatus(500);
        }
        const abilitiesResults = result.rows;
        const modifiedResults = abilitiesResults.map(ability => ({
            ID: ability.ability_id,
            Name: ability.ability_name,
            Proficiency: ability.ability_proficiency,
            Total_Number_of_Dragons: ability.total_number_of_dragons
        }));
        res.render('abilities', { data: modifiedResults });
    });
});

// <!-- Get a single Ability -->
app.get('/abilities/:id', function (req, res) {
    let abilityId = req.params.id;

    // Query to fetch abilities
    let query = `
    SELECT 
        a.ability_id, 
        a.ability_name, 
        a.ability_proficiency,
        COUNT(da.dragon_id) AS total_number_of_dragons
    FROM 
        Abilities a
    LEFT JOIN 
        Dragons_Abilities da ON a.ability_id = da.ability_id
    WHERE 
        a.ability_id = ?
    GROUP BY 
        a.ability_id;
    `;

    // Execute the query
    db.pool.query(query, [abilityId], function (error, results) {
        if (error) {
            console.error('Error fetching ability details:', error);
            return res.sendStatus(500);
        }

        // Query will return one row since ability_id is unique
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('Ability name already exists.');
        }
    });
});

// <!-- Add an Ability -->
app.post('/abilities/add', function (req, res) {
    let { ability_name, ability_proficiency } = req.body;
    let redirect_to = req.body.redirect_to;
    let total_number_of_dragons = 0;
    let insertQuery = `
    INSERT INTO Abilities (ability_name, ability_proficiency, total_number_of_dragons)
    VALUES (?, ?, ?);
    `;

    db.pool.query(insertQuery, [ability_name, ability_proficiency, total_number_of_dragons], function (error, results) {
        if (error) {
            console.error('Error adding ability:', error);
            res.sendStatus(500);
        } else {
            // Conditional redirection based on the form's origin
            if (redirect_to === 'dragons') {
                res.redirect('/dragons');
            } else {
                // Default redirect to '/environments' if 'redirect_to' is not specified or if it's 'environments'
                res.redirect('/abilities');
            }
        }
    });
});

// <!-- Update an Ability -->
app.put('/put-ability-ajax', function (req, res) {
    let data = req.body;
    let updateQuery = "UPDATE Abilities SET ability_name = ?, ability_proficiency = ? WHERE ability_id = ?;";

    db.pool.query(updateQuery, [data.name, data.proficiency, data.ability_id], function (error) {
        if (error) {
            console.error('Error updating ability:', error);
            res.sendStatus(500);
        } else {
            res.send({ message: 'Ability updated successfully.' });
        }
    });
});

// <!-- Delete an Ability -->
app.delete('/delete-ability-ajax/', function (req, res) {
    let data = req.body;
    let abilityID = parseInt(data.id);

    // Query to delete the ability
    let deleteAbilities = `DELETE FROM Abilities WHERE ability_id = ?`;

    // Execute the query to delete the ability
    db.pool.query(deleteAbilities, [abilityID], function (error) {
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
