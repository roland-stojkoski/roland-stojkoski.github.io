import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const workspaceRoot = process.cwd();
const claudeDir = path.join(workspaceRoot, '.claude');
const agentsDir = path.join(workspaceRoot, '.agents');

// Get git deleted files to handle deletion sync
const gitDeletedFiles = [];
try {
	const output = execSync('git status --porcelain', { encoding: 'utf8' });
	const lines = output.split('\n');
	for (const line of lines) {
		if (line.slice(0, 2).includes('D')) {
			const filePath = line.slice(3).trim();
			// Handle cases where the path might have quotes from spaces
			const cleanPath = filePath.replace(/^"(.*)"$/, '$1');
			gitDeletedFiles.push(path.resolve(workspaceRoot, cleanPath));
		}
	}
} catch {
	// Not a git repo or git not available
}

// Helper to copy file if contents differ or target doesn't exist
function syncFile(src, dest) {
	if (!fs.existsSync(src)) return;

	const destDir = path.dirname(dest);
	if (!fs.existsSync(destDir)) {
		fs.mkdirSync(destDir, { recursive: true });
	}

	let shouldCopy = false;
	if (!fs.existsSync(dest)) {
		shouldCopy = true;
	} else {
		const srcStat = fs.statSync(src);
		const destStat = fs.statSync(dest);
		// Copy if src is newer
		if (srcStat.mtimeMs > destStat.mtimeMs) {
			const srcBuf = fs.readFileSync(src);
			const destBuf = fs.readFileSync(dest);
			if (!srcBuf.equals(destBuf)) {
				shouldCopy = true;
			}
		}
	}

	if (shouldCopy) {
		fs.copyFileSync(src, dest);
		console.log(
			`Synced: ${path.relative(workspaceRoot, src)} -> ${path.relative(workspaceRoot, dest)}`
		);
	}
}

// Recursively get all files under a directory
function getFiles(dir) {
	if (!fs.existsSync(dir)) return [];
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...getFiles(fullPath));
		} else {
			files.push(fullPath);
		}
	}
	return files;
}

function main() {
	if (!fs.existsSync(claudeDir) && !fs.existsSync(agentsDir)) {
		// Create agents directory if only claude exists
		if (fs.existsSync(claudeDir)) {
			fs.mkdirSync(agentsDir, { recursive: true });
		} else {
			console.log('No agent configuration directories found to sync.');
			return;
		}
	}

	// 1. Process Git deletions first
	for (const file of gitDeletedFiles) {
		if (file.startsWith(claudeDir)) {
			const rel = path.relative(claudeDir, file);
			const counterpart = path.join(agentsDir, rel);
			if (fs.existsSync(counterpart)) {
				fs.rmSync(counterpart, { recursive: true, force: true });
				console.log(
					`Deleted counterpart: ${path.relative(workspaceRoot, counterpart)} (since ${path.relative(workspaceRoot, file)} was deleted)`
				);
			}
		} else if (file.startsWith(agentsDir)) {
			const rel = path.relative(agentsDir, file);
			const counterpart = path.join(claudeDir, rel);
			if (fs.existsSync(counterpart)) {
				fs.rmSync(counterpart, { recursive: true, force: true });
				console.log(
					`Deleted counterpart: ${path.relative(workspaceRoot, counterpart)} (since ${path.relative(workspaceRoot, file)} was deleted)`
				);
			}
		}
	}

	// 2. Scan `.claude` and sync to `.agents`
	const claudeFiles = getFiles(claudeDir);
	for (const file of claudeFiles) {
		const rel = path.relative(claudeDir, file);
		// Skip settings.json (Claude-specific command authorizations)
		if (rel === 'settings.json') continue;

		const target = path.join(agentsDir, rel);
		syncFile(file, target);
	}

	// 3. Scan `.agents` and sync to `.claude`
	const agentsFiles = getFiles(agentsDir);
	for (const file of agentsFiles) {
		const rel = path.relative(agentsDir, file);
		const target = path.join(claudeDir, rel);
		syncFile(file, target);
	}
}

main();
