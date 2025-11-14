import { Button } from "./button";

export function ErrorState({ message, onRetry }: any) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <p className="text-red-500 font-medium mb-3">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
