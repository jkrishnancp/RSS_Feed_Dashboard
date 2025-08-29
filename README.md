# RSS Feed Dashboard

A modern, comprehensive RSS feed management and monitoring dashboard built with React, TypeScript, and Tailwind CSS. This application provides advanced RSS feed management capabilities including bulk import, health monitoring, and real-time validation.

![RSS Dashboard](https://img.shields.io/badge/RSS-Dashboard-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 📰 RSS Feed Management
- **Single Feed Addition**: Add individual RSS feeds with real-time validation
- **Bulk Import**: Import multiple feeds from Excel (.xlsx, .xls) or CSV files
- **Health Monitoring**: Real-time feed health tracking with status indicators
- **7-Day Limit**: Automatically imports only articles from the last 7 days
- **Category Management**: Organize feeds by categories with dropdown selection

### 🔍 Advanced Monitoring
- **Health Status Indicators**:
  - 🟢 **Active**: Working normally (last updated within 6 hours)
  - 🟡 **Warning**: No data received for 6+ hours  
  - 🔴 **Error**: No data received for 24+ hours
- **Real-time Updates**: Health checks every 60 seconds
- **Feed Statistics**: Live dashboard with health metrics and counts

### 🛠 Management Features
- **Inline Editing**: Edit feed titles, URLs, categories, and status directly
- **Bulk Operations**: Refresh all feeds at once
- **Advanced Filtering**: Filter by category, status, folder, and search terms
- **Pagination**: Handle large feed collections efficiently
- **Export Templates**: Download CSV templates for bulk import

### 📁 File Import Support
- **Excel Files**: `.xlsx`, `.xls` formats
- **CSV Files**: Standard comma-separated values
- **TSV Files**: Tab-separated values
- **Auto-detection**: Automatically detects file format and column headers
- **Validation**: Real-time validation during bulk import process

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Git**: For cloning the repository

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jkrishnancp/RSS_Feed_Dashboard.git
   cd RSS_Feed_Dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Using nohup:
  nohup npm run dev > app.log 2>&1 &

  Using screen:
  screen -S rss-dashboard
  npm run dev
  # Press Ctrl+A, then D to detach


4. **Open your browser**
   ```
   http://localhost:3443
   ```

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 📋 System Requirements

### Minimum Requirements
- **RAM**: 4GB (8GB recommended)
- **Storage**: 500MB free space
- **Browser**: Modern browser supporting ES2020+
  - Chrome 88+
  - Firefox 85+
  - Safari 14+
  - Edge 88+

### Recommended Development Environment
- **OS**: Windows 10/11, macOS 11+, or Ubuntu 20.04+
- **IDE**: VS Code with TypeScript and React extensions
- **Terminal**: Modern terminal with Git support

## 📁 Project Structure

```
RSS_Feed_Dashboard/
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── common/            # Reusable components
│   │   ├── rss/               # RSS-specific components
│   │   │   ├── AddRSSModal.tsx         # Single feed addition
│   │   │   ├── BulkImportModal.tsx     # Bulk import functionality
│   │   │   └── EditableRSSRow.tsx      # Inline editing component
│   │   └── ...
│   ├── hooks/                 # Custom React hooks
│   ├── pages/                 # Page components
│   │   └── AdminRSSManagement.tsx      # Main RSS management page
│   ├── utils/
│   │   └── rssValidator.ts             # RSS validation utilities
│   └── ...
├── package.json              # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts         # Vite build configuration
```

## 📦 Dependencies

### Core Dependencies
- **React 18.3.1**: UI library
- **React Router DOM 7.8.2**: Navigation and routing
- **TypeScript 5.5.3**: Type safety and enhanced development

### RSS & File Processing
- **xlsx 0.18.5**: Excel file parsing
- **papaparse 5.5.3**: CSV file parsing and validation

### UI & Styling
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **Lucide React 0.344.0**: Modern icon library
- **Recharts 3.1.2**: Charts and data visualization

### Utilities
- **date-fns 4.1.0**: Date manipulation and formatting

### Development Dependencies
- **Vite 5.4.2**: Fast build tool and dev server
- **ESLint 9.9.1**: Code linting and quality
- **Autoprefixer 10.4.18**: CSS vendor prefixes
- **PostCSS 8.4.35**: CSS processing

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Optional: Custom port for development server
VITE_PORT=3443

# Optional: API base URL (if using external RSS API)
VITE_API_BASE_URL=http://localhost:3000/api
```

### RSS Import File Format

#### CSV Format Example:
```csv
Category,RSS URL,Title
Tech News,https://example.com/tech/feed.xml,Example Tech Blog
Dev Blogs,https://dev-blog.example.com/rss,Development Blog
Security,https://security-blog.example.com/feed,Security Updates
```

#### Excel Format:
- **Column A**: Category
- **Column B**: RSS URL  
- **Column C**: Title (optional)

#### Supported Column Headers (case-insensitive):
- **Category**: `category`, `category name`
- **URL**: `url`, `rss url`, `link`
- **Title**: `title`, `name`

## 🎯 Usage Guide

### Adding Single RSS Feed
1. Click "Add RSS Feed" button
2. Select category from dropdown
3. Enter RSS URL (will be validated in real-time)
4. Optional: Add custom title
5. Click "Add Feed" to save

### Bulk Import Process
1. Click "Import Excel/CSV" button
2. Choose file or drag & drop
3. Preview imported feeds
4. Click "Validate & Import"
5. Review validation results
6. Import valid feeds

### Monitoring Feed Health
- **Green dot**: Feed is active and working
- **Yellow dot**: Warning - no data for 6+ hours
- **Red dot**: Error - no data for 24+ hours
- Health checks run automatically every minute

### Managing Feeds
- **Edit**: Click edit icon to modify feed details
- **Refresh**: Click refresh icon to fetch latest articles
- **Delete**: Click delete icon to remove feed
- **Refresh All**: Use bulk refresh button for all feeds

## 🔍 Troubleshooting

### Common Issues

**Build Errors:**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Port Already in Use:**
```bash
# Change port in package.json or use environment variable
export PORT=3444
npm run dev
```

**TypeScript Errors:**
```bash
# Check TypeScript compilation
npx tsc --noEmit
```

**Linting Issues:**
```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### RSS Feed Validation Issues
- Ensure URLs start with `http://` or `https://`
- Check if the RSS feed is publicly accessible
- Verify the feed returns valid XML/RSS content
- Common RSS patterns: `/feed`, `/rss`, `/atom`, `.xml`

## 📚 API Documentation

### RSS Validator Functions

```typescript
// Validate RSS URL
validateRSSUrl(url: string): Promise<{isValid: boolean, error?: string, title?: string}>

// Batch validate multiple feeds
batchValidateRSSFeeds(feeds: Array<{category: string, url: string, title?: string}>): Promise<ValidationResult[]>

// Check feed health status
checkRSSHealth(lastSuccessfulFetch: Date): 'active' | 'warning' | 'error'

// Parse CSV content
parseRSSCSV(csvContent: string): Array<{category: string, url: string, title?: string}>

// Parse Excel file
parseRSSExcel(file: File): Promise<Array<{category: string, url: string, title?: string}>>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Run tests: `npm run lint`
5. Commit changes: `git commit -m "Add new feature"`
6. Push to branch: `git push origin feature/new-feature`
7. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write descriptive commit messages
- Ensure all linting passes
- Test RSS functionality thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team**: For the amazing React framework
- **Tailwind Labs**: For Tailwind CSS
- **Lucide**: For the beautiful icon library
- **RSS Community**: For RSS/Atom standards and specifications

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section above
- Review the API documentation

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

> This RSS Feed Dashboard provides a comprehensive solution for managing and monitoring RSS feeds with advanced features like bulk import, health monitoring, and real-time validation. Perfect for content aggregation and feed management workflows.
