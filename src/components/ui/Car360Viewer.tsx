export default function Car360Viewer() {
  return (
    <div className="rounded-2xl bg-surface-light border border-border overflow-hidden">
      <div className="flex items-center justify-center h-80 md:h-96">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-10 h-10 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
              />
            </svg>
          </div>
          <h3 className="text-lg font-heading font-bold mb-2 text-foreground">
            360 Degree Vehicle View
          </h3>
          <p className="text-sm text-muted max-w-xs mx-auto">
            Interactive 360 degree view coming soon. Drag to rotate the vehicle and explore every angle.
          </p>
        </div>
      </div>
    </div>
  );
}
