import 'dotenv/config';
import puppeteer from 'puppeteer';
import * as xlsx from 'xlsx';

const workbook = xlsx.readFile(process.env.SHEET_PATH!);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(process.env.TARGET_URL!, {
        waitUntil: 'networkidle2',
    });

    await page.waitForSelector('table');

    const rows = await page.$$('table tbody tr.row_group');

    for (let i = 0; i < data.length && i < rows.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // slower row pacing

        const student = data[i] as any;
        const row = rows[i];

        const excelSerial = Number(student['participant_birthday']);
        const birthday = new Date(Date.UTC(1899, 11, 30 + excelSerial));
        const birthdayStr = birthday.toISOString().split('T')[0];
        console.log('birthdaystr:', birthdayStr);
        const gender = student['gender'] === '1' ? 'male' : 'female';

        const fill = async (selector: string, value: string | undefined) => {
            if (!value) return;
            const input = await row.$(selector);
            if (input) {
                await input.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
                await input.click({ clickCount: 3 });
                await input.type(String(value));
                await new Promise(r => setTimeout(r, 200)); // short delay after each fill
            }
        };

        await fill('input[name="name"]', student['name']);

        await new Promise(r => setTimeout(r, 300));
        await fill('input[name="okmany"]', student['id_card_number']);

        await new Promise(r => setTimeout(r, 300));
        await fill('input[name="birthday"]', birthdayStr);

        await new Promise(r => setTimeout(r, 300));
        await fill('input[name="birthplace"]', student['participant_birth_place']);

        await new Promise(r => setTimeout(r, 300));
        await fill('input[name="zip"]', student['participant_zip']);

        const radios = await row.$$(`input[type="radio"]`);
        const genderRadio = gender === 'male' ? radios[0] : radios[1];
        await new Promise(r => setTimeout(r, 300));
        await genderRadio?.click();

        console.log(`✅ Filled row ${i + 1}: ${student['name']}`);
    }

    console.log('🎉 Done filling all visible rows.');
})();
