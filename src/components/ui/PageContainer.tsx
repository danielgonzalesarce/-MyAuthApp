interface PageContainerProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
};

export default function PageContainer({
  children,
  size = "lg",
}: PageContainerProps) {
  return (
    <div className={`mx-auto w-full px-4 py-8 sm:px-6 ${sizes[size]}`}>
      {children}
    </div>
  );
}
