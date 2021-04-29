import glob from 'glob'
import { readFileSync } from 'fs';
export async function* parseTokens(textStream: AsyncIterable<string> | Iterable<string>) {
    let token = "";
    for await (const txt of textStream) {
        for await (const char of txt) {
            if (["\n", " ", "(", ")", "!", "[", "]", "\"", "\`", ";", "=", ",", "|", "#"].includes(char)) {
                if (token) {
                    // aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                    // Its unlikely that this string is class name
                    if (token.length < 100) {
                        yield token
                    }
                };
                token = "";
                continue;
            }
            token += char;
        }
    }
}

export function matchToken(token: string, match: string) {
    let matches = 0;
    for (const char of token.split("")) {
        const matchLetter = match[matches];
        if (matchLetter === char) {
            matches += 1;
            continue;
        }
    }
    return matches === match.length;
}


async function listFiles(pattern: string) {
    return new Promise<ReadonlyArray<string>>((resolve, reject) => {
        glob(pattern, (err: unknown, files: ReadonlyArray<string>) => {
            if (err) {
                reject(err)
                return
            }
            resolve(files)
        })
    })
}

async function* loadContent(pattern: string) {
    const files = await listFiles(pattern)
    for (const file of files) {
        yield readFileSync(file).toString()
    }
}
export async function* findClasses(pattern: string, match: string) {
    for await (const token of parseTokens(loadContent(pattern))) {
        if (matchToken(token, match)) {
            yield token
        }
    }
}

