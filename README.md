# CIVORYN-SPARK
SPARK version

## Documentation Indexing

This repository includes automatic documentation indexing functionality that scans and catalogs all documentation files.

### Usage

Run the indexing script:
```bash
node index.js
```

This will:
- Scan the repository for documentation files (.md, .txt, .rst)
- Extract metadata (titles, headings, file info)
- Generate a `documentation-index.json` file with the indexed content

### Index Structure

The generated index includes:
- **generatedAt**: Timestamp of index generation
- **repository**: Repository name
- **totalFiles**: Number of indexed files
- **files**: Array of file metadata containing:
  - path: Relative file path
  - title: Document title (extracted from first H1 heading)
  - headings: List of all headings with levels
  - size: File size in bytes
  - lines: Number of lines
  - lastModified: Last modification timestamp
