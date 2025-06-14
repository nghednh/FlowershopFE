Install nodejs v22.16.0

Clone then run following command:
cd rt         # cd into rt folder
npm install   # Install dependencies
npm run dev   # Start the development server
npm run build # Build for production
Incase there is still error, try running:
npm install react-router-dom@6
npm install -D @types/react-router-dom

Project structure:
/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable UI components
│   ├── assets/       # Images, fonts, etc.
│   ├── App.tsx       # Main application component
│   ├── main.tsx      # Application entry point
│   └── index.css     # Global styles and theme variables
├── index.html        # HTML template
├── tsconfig.json     # TypeScript configuration
└── vite.config.ts    # Vite configuration
