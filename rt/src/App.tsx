import Button from './components/Button';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-background">
      <div className="max-w-2xl w-full p-8 rounded-xl bg-surface border border-adaptive shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-adaptive">React + TypeScript + Vite + Tailwind Template</h1>
        <p className="mb-6 text-adaptive">A minimal starter template using CSS variables for theming.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded bg-background border border-adaptive">
            <h2 className="font-semibold mb-2 text-adaptive">Theme Colors</h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                <span className="text-sm text-adaptive">--color-primary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: 'var(--color-primary-hover)' }}></div>
                <span className="text-sm text-adaptive">--color-primary-hover</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: 'var(--color-select)' }}></div>
                <span className="text-sm text-adaptive">--color-select</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded bg-background border border-adaptive">
            <h2 className="font-semibold mb-2 text-adaptive">Current Theme</h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-background"></div>
                <span className="text-sm text-adaptive">--color-background</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-surface"></div>
                <span className="text-sm text-adaptive">--color-surface</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border border-adaptive"></div>
                <span className="text-sm text-adaptive">--color-border</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
        </div>
      </div>
    </div>
  );
}