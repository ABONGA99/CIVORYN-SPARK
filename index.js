const fs = require('fs');
const path = require('path');

console.log("Civoryn indexing trigger");

// Function to recursively find all documentation files
function findDocumentationFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        // Skip .git and node_modules directories
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            findDocumentationFiles(filePath, fileList);
        } else if (stat.isFile()) {
            // Index markdown and text files
            const ext = path.extname(file).toLowerCase();
            if (['.md', '.txt', '.rst'].includes(ext)) {
                fileList.push(filePath);
            }
        }
    });
    
    return fileList;
}

// Function to parse documentation file and extract metadata
function parseDocumentationFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const relativePath = path.relative(process.cwd(), filePath);
    
    // Extract title (first heading or first line)
    let title = path.basename(filePath, path.extname(filePath));
    const headings = [];
    
    lines.forEach(line => {
        const trimmed = line.trim();
        // Match markdown headings
        const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
            const level = headingMatch[1].length;
            const text = headingMatch[2].trim();
            headings.push({ level, text });
            
            // Use first H1 as title if available
            if (level === 1 && headings.length === 1) {
                title = text;
            }
        }
    });
    
    return {
        path: relativePath,
        title: title,
        headings: headings,
        size: content.length,
        lines: lines.length,
        lastModified: fs.statSync(filePath).mtime.toISOString()
    };
}

// Main indexing function
function indexDocumentation() {
    console.log("Starting documentation indexing...");
    
    const rootDir = process.cwd();
    const docFiles = findDocumentationFiles(rootDir);
    
    console.log(`Found ${docFiles.length} documentation file(s)`);
    
    const index = {
        generatedAt: new Date().toISOString(),
        repository: path.basename(rootDir),
        totalFiles: docFiles.length,
        files: docFiles.map(parseDocumentationFile)
    };
    
    // Write index to JSON file
    const indexPath = path.join(rootDir, 'documentation-index.json');
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
    
    console.log(`Documentation index created: ${indexPath}`);
    console.log(`Indexed ${index.totalFiles} file(s)`);
    
    return index;
}

// Run the indexing
indexDocumentation();
