const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const archiver = require('archiver');

if (process.env.CI) {
    dotenv.config({ path: path.join(__dirname, '../config/.env') });
}
else {
    dotenv.config({ path: path.join(__dirname, '../config/.env.local') });
}


const assetsSrcDir = path.join(__dirname, '../assets');
const manifestSrcDir = path.join(__dirname, '../package');
const packagingDir = path.join(__dirname, '../packaging');
const destDir = path.join(__dirname, '../packaging/package-files');
const manifestPath = path.join(destDir, 'manifest.json');

try {
    fs.rmSync(packagingDir, { recursive: true });
}
catch (err) {
    // if error is no such file or directory, ignore it
    if (err.code !== 'ENOENT') {
        console.error('Error removing packaging directory:', err);
        process.exit(1);
    }
}

fs.mkdirSync(packagingDir);
fs.mkdirSync(destDir);

async function copyFiles() {
    try {
        const files = await fs.promises.readdir(assetsSrcDir);
        for (const file of files) {
            const srcFilePath = path.join(assetsSrcDir, file);
            const destFilePath = path.join(destDir, file);
            await fs.promises.copyFile(srcFilePath, destFilePath);
        }
    } catch (err) {
        console.error('Error copying files:', err.message);
    }
}

async function replaceInFile() {
    // create the destination manifest file
    await fs.writeFileSync(manifestPath, '{}');

    const filePath = path.join(manifestSrcDir, 'manifest.json');

    try {
        // Read the file
        let content = await fs.promises.readFile(filePath, 'utf8');

        // Replace variables in the content
        content = content.replace(/\${{(\w+)}}/g, (match, p1) => {
            const replacement = process.env[p1];
            if (replacement === undefined) {
                throw new Error(`Environment variable ${p1} is not defined`);
            }
            return replacement;
        });

        // Write the updated content back to the file
        const destFilePath = path.join(destDir, path.basename(filePath));
        await fs.promises.writeFile(destFilePath, content);
    } catch (err) {
        console.error(`Error replacing variables in ${filePath}:`, err);
    }
}

async function zipFiles() {
    const { exec } = require('child_process');
    const zipFileName = 'teams_app.zip';
    const zipPath = path.join(__dirname, `../packaging/package`);
    const zipFilePath = path.join(zipPath, zipFileName);

    // remove zipPath
    try {
        fs.rmSync(zipPath, { recursive: true });
    }
    catch (err) {
        // if error is no such file or directory, ignore it
        if (err.code !== 'ENOENT') {
            console.error('Error removing zipPath directory:', err);
            process.exit(1);
        }
    }

    // create the destination zip directory
    fs.mkdirSync(zipPath);

    // create the destination zip file
    await fs.writeFileSync(zipFilePath, '');

    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', function() {
        const size = archive.pointer();
        // size in megabytes
        const sizeMB = size / 1024 / 1024;
        console.log(`Package created: ${zipFilePath} (${sizeMB.toFixed(2)} MB)`);
    });

    archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            console.warn(err);
        } else {
            throw err;
        }
    });

    archive.on('error', function(err) {
        throw err;
    });

    archive.pipe(output);

    archive.directory(destDir, false);

    archive.finalize();
}

async function main() {
    await copyFiles();
    await replaceInFile();
    await zipFiles();
}

main();
