const fs = require('fs');
const path = require('path');

function extractChangelog(version) {
  const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
  if (!fs.existsSync(changelogPath)) {
    console.error('CHANGELOG.md not found');
    process.exit(1);
  }

  const content = fs.readFileSync(changelogPath, 'utf8');
  const escapedVersion = version.replace(/\./g, '\\.');
  const headerRegex = new RegExp(`##\\s*\\[${escapedVersion}\\]`, 'i');

  const match = content.match(headerRegex);
  if (!match) {
    console.error(`Version ${version} not found in CHANGELOG.md`);
    process.exit(1);
  }

  const startIndex = match.index + match[0].length;
  const nextHeaderRegex = /##\s*\[\d+\.\d+\.\d+\]/g;
  nextHeaderRegex.lastIndex = startIndex;
  const nextMatch = nextHeaderRegex.exec(content);

  let extracted = '';
  if (nextMatch) {
    extracted = content.substring(startIndex, nextMatch.index);
  } else {
    extracted = content.substring(startIndex);
  }

  extracted = extracted.replace(/^[^\n]*\n/, '');
  return extracted.trim();
}

function generateReleaseNotes(version, rawNotes) {
  return `# Upgrade Notice / Wichtiger Hinweis zum Update

[EN] Before updating Omega GoXLR, please save any active profiles or in-progress configuration changes. If you are upgrading from an older version, your local settings should remain intact, but backing up profiles is still recommended.

[DE] Bitte speichere vor dem Update von Omega GoXLR alle aktiven Profile oder laufenden Konfigurationsaenderungen. Beim Upgrade von einer aelteren Version sollten die lokalen Einstellungen erhalten bleiben, ein Profil-Backup wird trotzdem empfohlen.

---

# Omega GoXLR v${version} - Patch Notes / Versionshinweise

Welcome to the new release of **Omega GoXLR**. Below are the changes included in this version:
Willkommen zur neuen Version von **Omega GoXLR**. Nachfolgend findest du die Aenderungen dieser Version:

${rawNotes}`;
}

const targetVersion = process.argv[2];
const outputPath = process.argv[3];
if (!targetVersion) {
  console.error('Please specify a version as the first argument');
  process.exit(1);
}

try {
  const rawNotes = extractChangelog(targetVersion);
  const formattedNotes = generateReleaseNotes(targetVersion, rawNotes);
  if (outputPath) {
    fs.writeFileSync(outputPath, formattedNotes, 'utf8');
    console.log(`Changelog successfully written to ${outputPath} (UTF-8)`);
  } else {
    console.log(formattedNotes);
  }
} catch (err) {
  console.error('Error extracting changelog:', err);
  process.exit(1);
}
