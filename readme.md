**Website Functionality**
- READ/BROWSE/DISPLAY entities
    * Abilities, Environments, Types, Dragons
- CREATE/INSERT/ADD NEW entites
    * Abilities, Environments, Types, Dragons
- DELETE functionality (one M:N) clearly indicate where you have implemented the delete of a M:N
    * Abilities, Environments, Types, Dragons
    * M:N - Deleting from Abilities table will remove associated Ability from all dragons in Dragons table
- EDIT/UPDATE functionality (one nullable FK, update one M:N relationship) Clearly indicate where you have implemented update of one M:N relationship and NULLable relationship.
    * M:N - Updating from Abilities table will remove associated Ability from all dragons in Dragons table
    * Updating from Types table will update associated Dragon in Dragons table. Can be updated to NULL. Dragon Type can be NULL as an option.
    * Updating from Environments table will update associated Dragon in Dragons table. Can be updated to NULL on delete.
- DYNAMIC DROPDOWN functionality for FKs
    * Dynamic Dropdowns in Dragons table for Types and Environments.


**This project has code adapted from the following sources:**

- nodejs-starterapp for editing and deleting entities.
    * Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

- showform function adapted from people.html starter code.
    * Source URL: https://canvas.oregonstate.edu/courses/1946034/pages/exploration-web-application-technology?module_item_id=23809327 

**Icons used are from the following sources:**
* add-button.svg: https://www.iconpacks.net/free-icon/add-button-12007.html
* delete-button.svg: https://www.iconpacks.net/free-icon/trash-can-10416.html
* edit-button.svg: https://www.iconpacks.net/free-icon/pencil-327.html

