# NTAK(T) filler tool for Pálköve's camp

This tool is used to fill the NTAK site from Csaba with data from Pálköve's camp. For installation, see the
section [Installation](#installation). For usage and possible caveats, see the section [Usage](#usage).

## Installation

Make sure you have node.js and pnpm installed on your system.

1. Clone the repository:
   ```bash
   git clone
   ```
2. Navigate to the cloned directory:
   ```bash
    cd ntakt
    ```
3. Install the required dependencies:

    ```bash
    pnpm install
    ```

4. Set the .env file's 2 variables: the site's URL and the path to the Excel file
5. Run the main.ts file:
    ```bash
    pnpm tsx main.ts
    ```
   
## Usage

The tool will read the Excel file specified in the `.env` file, extract the necessary data, and fill the NTAK site with it. The script takes a few minutes to run (about 10), in this timespan, please do not interact with the device (i.e. don't hide the browser window, don't switch to another tab, etc.). 

## Requirements

Your Excel sheet should have the following columns:

- `name`
- `participant_birthday` in Excel's date format
- `gender`: 1 if male, 0 if female
- `participant_zip`
- `participant_birth_place`
- `id_card_number`

## Caveats, limitations

- The tool currently does not fill nationality, as it would be an overkill, and is defaulted to Hungarian. If you need to fill it, you can do so manually on the NTAK site. 
- The site is slow as heck, so it might be required to manually check the filled data.
- In some cases, the gender gets misfilled