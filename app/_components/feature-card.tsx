interface FeatureCardProps {
    children: React.ReactNode,
    title: string,
    description: string,
  }

export const FeatureCard: React.FC<FeatureCardProps> = ({children, title, description}) => {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          {children}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    )
  }