import fs from 'node:fs';
import { parse } from 'csv-parse'

const cvsFilePath = new URL('cvsFile.csv', import.meta.url);

async function readingCvsFile() {
    const parser = fs.createReadStream(cvsFilePath)
        .pipe(parse({
            delimiter: ',',
            skipEmptyLines: true,
            fromLine: 2 // começando da segunda linha
        }));

    for await (const chunk of parser) {
        const [title, description] = chunk;

        await fetch('http://localhost:3333/task', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description
                }),
                duplex: 'half'
            }
        )
    };
};

readingCvsFile();