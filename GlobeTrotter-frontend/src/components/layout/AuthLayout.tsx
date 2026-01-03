import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="text-2xl font-bold text-primary">
            GlobeTrotter
          </div>
          <h1 className="text-xl font-semibold">{title}</h1>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  )
}