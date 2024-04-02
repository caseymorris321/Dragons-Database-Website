## Features
- **READ/BROWSE/DISPLAY entities**
    * Abilities, Environments, Types, Dragons
- **CREATE/INSERT/ADD NEW entites**
    * Abilities, Environments, Types, Dragons
- **DELETE functionality (one M:N)**
    * Abilities, Environments, Types, Dragons
    * M:N - Deleting from Abilities table will remove associated Ability from all dragons in Dragons table
- **EDIT/UPDATE functionality (one nullable FK, update one M:N relationship)**
    * M:N - Updating from Abilities table will remove associated Ability from all dragons in Dragons table
    * Updating from Types table will update associated Dragon in Dragons table. Can be updated to NULL. Dragon Type can be NULL as an option.
    * Updating from Environments table will update associated Dragon in Dragons table. Can be updated to NULL on delete.
- **DYNAMIC DROPDOWN functionality for FKs**
    * Dynamic Dropdowns in Dragons table for Types and Environments.


## Features
- **add-button.svg:** https://www.iconpacks.net/free-icon/add-button-12007.html
- **delete-button.svg:** https://www.iconpacks.net/free-icon/trash-can-10416.html
- **edit-button.svg:** https://www.iconpacks.net/free-icon/pencil-327.html

