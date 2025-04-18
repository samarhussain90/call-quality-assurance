# Call Quality Assurance Platform

A modern web application for automated call quality assurance and compliance monitoring.

## Features

- Campaign & Call Management
- Real-time Call Analysis
- Compliance Rules Engine
- Transcript & Summary Generation
- Agent Analytics & Dashboards
- Integration Hub (Slack, CRM, Email)
- Model Training & Feedback Loop
- Comprehensive Reporting

## Tech Stack

- Frontend: React + TypeScript + Vite
- UI Components: Tailwind CSS + shadcn/ui
- State Management: React Context + Hooks
- Backend: Node.js + Express (mock API for now)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd [your-repo-name]
```

2. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

3. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# In a new terminal, start frontend server
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## Project Structure

```
src/
├── api/          # API client and mock data
├── components/   # Reusable UI components
├── pages/        # Page components
├── context/      # React context providers
└── types/        # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
