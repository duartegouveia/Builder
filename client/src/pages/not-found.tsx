import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="card" style={{ maxWidth: 400, margin: '0 1rem' }}>
        <div className="card-content" style={{ paddingTop: '1.5rem' }}>
          <div className="flex gap-2 mb-4" style={{ marginBottom: '1rem' }}>
            <AlertCircle style={{ width: 32, height: 32, color: 'var(--destructive)' }} />
            <h1 className="text-2xl font-bold text-foreground">404 Page Not Found</h1>
          </div>

          <p className="text-sm text-muted-foreground" style={{ marginTop: '1rem' }}>
            Did you forget to add the page to the router?
          </p>
        </div>
      </div>
    </div>
  );
}
